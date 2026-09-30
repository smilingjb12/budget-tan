import { ActionButton } from "~/components/action-button";
import { Button } from "~/components/ui/button";
import { ComboboxInput } from "~/components/ui/combobox-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useIsInkTheme } from "~/lib/hooks/use-app-theme";
import { CategoryGlyph } from "~/components/category-glyph";
import { useDebounce } from "~/lib/hooks/use-debounce";
import { usePreviousMonth } from "~/lib/hooks/use-month-navigation";
import {
  useCategoriesQuery,
  useExchangeRateQuery,
  useRecordCommentsQuery,
  useRecordQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
} from "~/lib/queries";
import { QueryKeys } from "~/lib/query-keys";
import { Month } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { CreateOrUpdateRecordRequest } from "~/services/record-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { PencilIcon, Plus, Trash2 } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema based on the API schema but with string values for form inputs
const formSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  value: z.string().min(1, "Value is required"),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

/** Values used to deep-link into an already filled in "Add" dialog. */
export interface RecordPrefill {
  amountEur?: number;
  categoryName?: string;
  comment?: string;
}

interface AddRecordDialogProps {
  recordId?: number;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  isIncome?: boolean;
  prefill?: RecordPrefill | null;
  onPrefillConsumed?: () => void;
}

export function AddRecordDialog({
  recordId,
  trigger,
  onSuccess,
  isIncome = false,
  prefill,
  onPrefillConsumed,
}: AddRecordDialogProps) {
  const params = useParams({ from: '/app/$year/$month' });
  const month = Number(params.month) as Month;
  const year = Number(params.year);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const isInk = useIsInkTheme();
  const { prevMonth, prevYear } = usePreviousMonth(month, year);
  const isEditMode = !!recordId;

  // State for PLN and EUR values
  const [plnValue, setPlnValue] = useState<string>("");
  const [eurValue, setEurValue] = useState<string>("");
  const [, setIsUpdatingPln] = useState(false);
  const [, setIsUpdatingEur] = useState(false);

  // Fetch exchange rate
  const {
    data: exchangeRateData,
    isLoading: isLoadingExchangeRate,
  } = useExchangeRateQuery();
  const exchangeRate = exchangeRateData?.rate;

  const { data: allCategories } = useCategoriesQuery();
  const categories = useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter((category) => category.isExpense !== isIncome);
  }, [allCategories, isIncome]);

  // Fetch record data if in edit mode
  const { data: recordData, isLoading: isLoadingRecord } = useRecordQuery(
    recordId,
    isEditMode && isDialogOpen
  );

  const prefillCategoryName = prefill?.categoryName;

  const getDefaultCategoryId = useCallback(() => {
    if (!categories || categories.length === 0) {
      return "";
    }
    if (prefillCategoryName) {
      const match = categories.find(
        (category) =>
          category.name.toLowerCase() === prefillCategoryName.toLowerCase()
      );
      if (match) {
        return match.id.toString();
      }
    }
    return categories[0].id.toString();
  }, [categories, prefillCategoryName]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      value: "",
      comment: "",
    },
  });

  // Convert PLN to EUR
  const convertPlnToEur = useCallback(
    (pln: string) => {
      if (!pln || !exchangeRate) return "";
      const plnAmount = parseFloat(pln);
      if (isNaN(plnAmount)) return "";
      return (plnAmount / exchangeRate).toFixed(2);
    },
    [exchangeRate]
  );

  // Convert EUR to PLN
  const convertEurToPln = useCallback(
    (eur: string) => {
      if (!eur || !exchangeRate) return "";
      const eurAmount = parseFloat(eur);
      if (isNaN(eurAmount)) return "";
      return (eurAmount * exchangeRate).toFixed(2);
    },
    [exchangeRate]
  );

  // Handle PLN input change
  const handlePlnChange = (value: string) => {
    setIsUpdatingPln(true);
    setPlnValue(value);
    form.setValue("value", value);

    // Convert to EUR
    const newEurValue = convertPlnToEur(value);
    setEurValue(newEurValue);
    setIsUpdatingPln(false);
  };

  // Handle EUR input change
  const handleEurChange = (value: string) => {
    setIsUpdatingEur(true);
    setEurValue(value);

    // Convert to PLN and update form
    const newPlnValue = convertEurToPln(value);
    setPlnValue(newPlnValue);
    form.setValue("value", newPlnValue);
    setIsUpdatingEur(false);
  };

  // Set default values or populate form with record data when available
  useEffect(() => {
    if (isEditMode && recordData && exchangeRate) {
      // For edit mode, we get EUR value from backend
      const eur = recordData.value.toString();
      setEurValue(eur);

      // Convert EUR to PLN
      const pln = convertEurToPln(eur);
      setPlnValue(pln);

      form.reset({
        categoryId: recordData.categoryId.toString(),
        value: pln, // Store PLN value in the form
        comment: recordData.comment || "",
      });
    } else if (!isEditMode && categories) {
      const defaultCategoryId = getDefaultCategoryId();
      if (defaultCategoryId) {
        form.setValue("categoryId", defaultCategoryId);
      }
    }
  }, [
    categories,
    form,
    isEditMode,
    recordData,
    getDefaultCategoryId,
    exchangeRate,
    convertEurToPln,
  ]);

  // Add state for comment input
  const [commentInput, setCommentInput] = useState("");

  // Debounce the comment input with a 200ms delay
  const debouncedCommentInput = useDebounce(commentInput, 200);

  // Fetch comment suggestions based on the debounced input
  const { data: commentSuggestions = [] } = useRecordCommentsQuery(
    debouncedCommentInput
  );

  // Update commentInput when form value changes
  const handleCommentInputChange = useCallback((value: string) => {
    setCommentInput(value);
  }, []);

  // Initialize commentInput with form value when in edit mode
  useEffect(() => {
    if (recordData && recordData.comment) {
      setCommentInput(recordData.comment);
    }
  }, [recordData]);

  // Open the dialog with pre-filled values when navigated to with a prefill.
  // The category is handled by getDefaultCategoryId above.
  const prefillKey =
    !isEditMode && prefill
      ? `${prefill.amountEur ?? ""}|${prefill.categoryName ?? ""}|${
          prefill.comment ?? ""
        }`
      : null;
  const [appliedPrefillKey, setAppliedPrefillKey] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!prefillKey) {
      // Prefill was cleared - allow the same prefill to be applied again later
      if (appliedPrefillKey !== null) {
        setAppliedPrefillKey(null);
      }
      return;
    }
    if (prefillKey === appliedPrefillKey) return;
    // Wait for the exchange rate so the PLN mirror can be filled in as well
    if (isLoadingExchangeRate) return;

    if (prefill?.amountEur !== undefined) {
      const eur = prefill.amountEur.toFixed(2);
      const pln = convertEurToPln(eur);
      setEurValue(eur);
      setPlnValue(pln);
      form.setValue("value", pln || eur);
    }
    if (prefill?.comment) {
      form.setValue("comment", prefill.comment);
      setCommentInput(prefill.comment);
    }

    setAppliedPrefillKey(prefillKey);
    setIsDialogOpen(true);
  }, [
    prefillKey,
    appliedPrefillKey,
    prefill,
    isLoadingExchangeRate,
    convertEurToPln,
    form,
  ]);

  const createRecordMutation = useCreateRecordMutation();
  const updateRecordMutation = useUpdateRecordMutation();
  const deleteRecordMutation = useDeleteRecordMutation();

  const recordMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Date handling based on create/edit mode
      let dateUtc;

      if (isEditMode && recordData) {
        // When editing, use the existing date without modification
        dateUtc = recordData.dateUtc;
      } else {
        // When creating, use current date and time for the selected month/year
        const now = new Date(); // Get current date and time
        const date = new Date(year, month - 1); // Set year and month (0-indexed)

        // Set the current day
        date.setDate(now.getDate());

        // Copy the current time to our date
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
        date.setSeconds(now.getSeconds());
        date.setMilliseconds(now.getMilliseconds());

        dateUtc = date.toISOString();
      }

      // Use EUR value directly
      const eurAmount = parseFloat(eurValue);
      if (isNaN(eurAmount)) {
        throw new Error("EUR value is invalid");
      }

      // Create a request body that matches our Zod schema
      const requestBody: CreateOrUpdateRecordRequest = {
        ...(isEditMode && recordId ? { id: recordId } : {}),
        categoryId: parseInt(values.categoryId),
        value: eurAmount, // Send EUR value
        comment: values.comment,
        dateUtc: dateUtc,
        isExpense: !isIncome,
      };

      if (isEditMode) {
        return updateRecordMutation.mutateAsync(requestBody);
      } else {
        return createRecordMutation.mutateAsync(requestBody);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.monthSummary(year, month),
      });

      await queryClient.invalidateQueries({
        queryKey: QueryKeys.monthSummary(prevYear, prevMonth),
      });

      await queryClient.invalidateQueries({
        queryKey: QueryKeys.balance(),
      });

      await queryClient.invalidateQueries({
        queryKey: QueryKeys.monthRecords(year, month),
      });

      if (isEditMode) {
        await queryClient.invalidateQueries({
          queryKey: QueryKeys.record(recordId!),
        });
      }

      setIsDialogOpen(false);

      form.reset({
        categoryId: getDefaultCategoryId(),
        value: "",
        comment: "",
      });

      // Reset PLN and EUR values
      setPlnValue("");
      setEurValue("");

      if (onPrefillConsumed) {
        onPrefillConsumed();
      }

      if (onSuccess) {
        onSuccess();
      }
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    recordMutation.mutate(values);
  };

  const handleDelete = () => {
    if (!recordId) return;
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this entry permanently?");
      if (!confirmed) return;
    }
    deleteRecordMutation.mutate(recordId, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: QueryKeys.monthSummary(year, month),
        });
        await queryClient.invalidateQueries({
          queryKey: QueryKeys.monthSummary(prevYear, prevMonth),
        });
        await queryClient.invalidateQueries({
          queryKey: QueryKeys.balance(),
        });
        await queryClient.invalidateQueries({
          queryKey: QueryKeys.monthRecords(year, month),
        });
        if (recordId) {
          await queryClient.invalidateQueries({
            queryKey: QueryKeys.record(recordId),
          });
        }
        setIsDialogOpen(false);
        if (onSuccess) onSuccess();
      },
    });
  };

  if (trigger) {
    return (
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          // Reset form when dialog is closed, but only if not in edit mode
          if (!open && !isEditMode) {
            form.reset({
              categoryId: getDefaultCategoryId(),
              value: "",
              comment: "",
            });
            setPlnValue("");
            setEurValue("");
          }
          if (!open && onPrefillConsumed) {
            onPrefillConsumed();
          }
        }}
      >
        <DialogTrigger asChild>
          <button onClick={() => setIsDialogOpen(true)} className="cursor-pointer w-full">
            {trigger}
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {isEditMode
                  ? recordData
                    ? `Edit Record (${format(
                        parseISO(recordData.dateUtc),
                        "MMM d, yyyy"
                      )})`
                    : "Edit Record"
                  : isIncome
                  ? "Add Income"
                  : "Add Expense"}
              </DialogTitle>
              {isEditMode && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={deleteRecordMutation.isPending}
                  aria-label="Delete record"
                  title="Delete record"
                >
                  <Trash2 className="h-4 w-4 text-expense" />
                </Button>
              )}
            </div>
          </DialogHeader>
          {isEditMode && isLoadingRecord ? (
            <div className="py-4 text-center text-sm text-muted-foreground">Loading record…</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormItem>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="PLN"
                        value={plnValue}
                        onChange={(e) => handlePlnChange(e.target.value)}
                        className="pr-10"
                        disabled={!exchangeRate || isLoadingExchangeRate}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-sm font-semibold">
                        zł
                      </span>
                    </div>
                  </FormItem>
                  <FormItem>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="EUR"
                        value={eurValue}
                        onChange={(e) => handleEurChange(e.target.value)}
                        className="pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-sm font-semibold">
                        €
                      </span>
                    </div>
                  </FormItem>
                </div>
                {!exchangeRate && !isLoadingExchangeRate && (
                  <div className="text-sm text-muted-foreground">
                    Exchange rate unavailable - enter EUR directly
                  </div>
                )}
                <div className="hidden">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ComboboxInput
                            value={field.value || ""}
                            onChange={field.onChange}
                            onInputChange={handleCommentInputChange}
                            suggestions={commentSuggestions}
                            placeholder="Note"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ActionButton
                    variant="default"
                    className="h-10"
                    type="submit"
                    disabled={recordMutation.isPending || !eurValue}
                    isLoading={recordMutation.isPending}
                  >
                    {isEditMode
                      ? `Update${eurValue ? ` (€${eurValue})` : ""}`
                      : `${isInk ? "記 " : ""}Add${eurValue ? ` (€${eurValue})` : ""}`}
                  </ActionButton>
                </div>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => {
                    const selectedCategory = categories?.find(
                      (cat) => cat.id.toString() === field.value
                    );

                    return (
                      <FormItem>
                        <FormLabel>
                          Category{" "}
                          {selectedCategory ? `(${selectedCategory.name})` : ""}
                        </FormLabel>
                        <FormControl>
                          <div className="mx-auto mt-2 grid w-fit grid-cols-3 gap-1.5">
                            {categories?.map((category) => {
                              const isSelected =
                                category.id.toString() === field.value;

                              return (
                                <button
                                  key={category.id}
                                  type="button"
                                  onClick={() =>
                                    field.onChange(category.id.toString())
                                  }
                                  className={`flex aspect-square h-20 w-20 items-center justify-center rounded-lg border transition-colors duration-150 ${
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-muted/40 text-foreground hover:bg-muted"
                                  }`}
                                  title={category.name}
                                  disabled={isSelected} // Disable button if already selected to prevent untoggling
                                >
                                  <CategoryGlyph
                                    icon={category.icon}
                                    className="h-7 w-7"
                                    onFill={isSelected}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          )}
          {/* Exchange rate last updated info */}
          {exchangeRateData?.lastUpdatedAt && (
            <div className="mt-2 text-xs text-muted-foreground">
              Rate updated{" "}
              {formatDistanceToNow(parseISO(exchangeRateData.lastUpdatedAt), {
                addSuffix: true,
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        // Reset form when dialog is closed, but only if not in edit mode
        if (!open && !isEditMode) {
          form.reset({
            categoryId: getDefaultCategoryId(),
            value: "",
            comment: "",
          });
          setPlnValue("");
          setEurValue("");
        }
        if (!open && onPrefillConsumed) {
          onPrefillConsumed();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          className={cn(
            "h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-150 hover:bg-primary/90 hover:scale-105 active:scale-95",
            // Ink: a red hanko stamp rather than a floating pill.
            isInk && "hanko h-14 w-14 rounded-md text-2xl shadow-black/40"
          )}
          aria-label={
            isEditMode
              ? "Edit record"
              : isIncome
              ? "Add income record"
              : "Add expense record"
          }
        >
          {isEditMode ? (
            <PencilIcon className="h-6 w-6" />
          ) : isInk ? (
            <span aria-hidden="true">記</span>
          ) : (
            <Plus className="h-6 w-6" />
          )}
          <span className="sr-only">
            {isIncome ? "Add income" : "Add expense"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isEditMode
                ? recordData
                  ? `Edit Record (${format(
                      parseISO(recordData.dateUtc),
                      "MMM d, yyyy"
                    )})`
                  : "Edit Record"
                : isIncome
                ? "Add Income"
                : "Add Expense"}
            </DialogTitle>
            {isEditMode && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleteRecordMutation.isPending}
                aria-label="Delete record"
                title="Delete record"
              >
                <Trash2 className="h-4 w-4 text-expense" />
              </Button>
            )}
          </div>
        </DialogHeader>
        {isEditMode && isLoadingRecord ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading record…</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="PLN"
                      value={plnValue}
                      onChange={(e) => handlePlnChange(e.target.value)}
                      className="pr-10"
                      disabled={!exchangeRate || isLoadingExchangeRate}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-sm font-semibold">
                      zł
                    </span>
                  </div>
                </FormItem>
                <FormItem>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="EUR"
                      value={eurValue}
                      onChange={(e) => handleEurChange(e.target.value)}
                      className="pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-sm font-semibold">
                      €
                    </span>
                  </div>
                </FormItem>
              </div>
              {!exchangeRate && !isLoadingExchangeRate && (
                <div className="text-sm text-muted-foreground">
                  Exchange rate unavailable - enter EUR directly
                </div>
              )}
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ComboboxInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          onInputChange={handleCommentInputChange}
                          suggestions={commentSuggestions}
                          placeholder="Note"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ActionButton
                  variant="default"
                  className="h-10"
                  type="submit"
                  disabled={recordMutation.isPending || !eurValue}
                  isLoading={recordMutation.isPending}
                >
                  {isEditMode
                    ? `Update${eurValue ? ` (€${eurValue})` : ""}`
                    : `${isInk ? "記 " : ""}Add${eurValue ? ` (€${eurValue})` : ""}`}
                </ActionButton>
              </div>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => {
                  const selectedCategory = categories?.find(
                    (cat) => cat.id.toString() === field.value
                  );

                  return (
                    <FormItem>
                      <FormLabel>
                        Category{" "}
                        {selectedCategory ? `(${selectedCategory.name})` : ""}
                      </FormLabel>
                      <FormControl>
                        <div className="mx-auto mt-2 grid w-fit grid-cols-3 gap-1.5">
                          {categories?.map((category) => {
                            const isSelected =
                              category.id.toString() === field.value;

                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() =>
                                  field.onChange(category.id.toString())
                                }
                                className={`flex aspect-square h-20 w-20 items-center justify-center rounded-lg border transition-colors duration-150 ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-muted/40 text-foreground hover:bg-muted"
                                }`}
                                title={category.name}
                                disabled={isSelected} // Disable button if already selected to prevent untoggling
                              >
                                <CategoryGlyph
                                    icon={category.icon}
                                    className="h-7 w-7"
                                    onFill={isSelected}
                                  />
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>
        )}
        {/* Exchange rate last updated info */}
        {exchangeRateData?.lastUpdatedAt && (
          <div className="mt-2 text-xs text-muted-foreground">
            Rate updated{" "}
            {formatDistanceToNow(parseISO(exchangeRateData.lastUpdatedAt), {
              addSuffix: true,
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}