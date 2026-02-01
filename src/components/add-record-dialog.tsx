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
import { useCategoryIcon } from "~/lib/hooks/use-category-icon";
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

interface AddRecordDialogProps {
  recordId?: number;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  isIncome?: boolean;
}

export function AddRecordDialog({
  recordId,
  trigger,
  onSuccess,
  isIncome = false,
}: AddRecordDialogProps) {
  const params = useParams({ from: '/app/$year/$month' });
  const month = Number(params.month) as Month;
  const year = Number(params.year);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getCategoryIcon } = useCategoryIcon();
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
    isError: isExchangeRateError,
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

  const getDefaultCategoryId = useCallback(() => {
    if (categories && categories.length > 0) {
      return categories[0].id.toString();
    }
    return "";
  }, [categories]);

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
        queryKey: QueryKeys.allTimeSummary(),
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
          queryKey: QueryKeys.allTimeSummary(),
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
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </DialogHeader>
          {isEditMode && isLoadingRecord ? (
            <div className="py-4 text-center">Loading record data...</div>
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
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-lg font-medium">
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
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-lg font-medium">
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
                      : `Add${eurValue ? ` (€${eurValue})` : ""}`}
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
                          <div className="grid grid-cols-3 gap-1 mt-2 mx-auto w-fit">
                            {categories?.map((category) => {
                              const IconComponent = getCategoryIcon(
                                category.icon
                              );
                              const isSelected =
                                category.id.toString() === field.value;

                              return (
                                <button
                                  key={category.id}
                                  type="button"
                                  onClick={() =>
                                    field.onChange(category.id.toString())
                                  }
                                  className={`flex items-center justify-center aspect-square h-20 w-20 border border-input rounded-md transition-colors ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-background hover:bg-accent hover:text-accent-foreground"
                                  }`}
                                  title={category.name}
                                  disabled={isSelected} // Disable button if already selected to prevent untoggling
                                >
                                  <IconComponent className="h-8 w-8" />
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
              Updated{" "}
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
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground hover:bg-primary/90"
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
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </DialogHeader>
        {isEditMode && isLoadingRecord ? (
          <div className="py-4 text-center">Loading record data...</div>
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
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-lg font-medium">
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
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-lg font-medium">
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
                    : `Add${eurValue ? ` (€${eurValue})` : ""}`}
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
                        <div className="grid grid-cols-3 gap-1 mt-2 mx-auto w-fit">
                          {categories?.map((category) => {
                            const IconComponent = getCategoryIcon(
                              category.icon
                            );
                            const isSelected =
                              category.id.toString() === field.value;

                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() =>
                                  field.onChange(category.id.toString())
                                }
                                className={`flex items-center justify-center aspect-square h-20 w-20 border border-input rounded-md transition-colors ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background hover:bg-accent hover:text-accent-foreground"
                                }`}
                                title={category.name}
                                disabled={isSelected} // Disable button if already selected to prevent untoggling
                              >
                                <IconComponent className="h-8 w-8" />
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
            Updated{" "}
            {formatDistanceToNow(parseISO(exchangeRateData.lastUpdatedAt), {
              addSuffix: true,
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}