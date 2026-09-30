"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  RegularPaymentDto,
  useRegularPaymentsQuery,
  useUpdateRegularPaymentMutation,
  useDeleteRegularPaymentMutation,
} from "~/lib/queries";
import { Edit, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { usePaymentUtils } from "~/lib/hooks/use-payment-utils";
import { useIsInkTheme } from "~/lib/hooks/use-app-theme";
import { InkDrop } from "~/components/ink/ink-drop";
import { cn } from "~/lib/utils";

interface RegularPaymentItemProps {
  payment: RegularPaymentDto;
}

export function RegularPaymentItem({
  payment,
}: RegularPaymentItemProps) {
  const { data: payments = [] } = useRegularPaymentsQuery();
  const updateMutation = useUpdateRegularPaymentMutation();
  const deleteMutation = useDeleteRegularPaymentMutation();
  const { isPaymentStale, getRelativeCost, getTextColor } = usePaymentUtils();
  const isInk = useIsInkTheme();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RegularPaymentDto>({
    ...payment,
  });

  const handleEditPayment = () => {
    setIsEditing(true);
    setEditingPayment({ ...payment });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPayment({ ...payment });
  };

  const handleSaveEdit = () => {
    updateMutation.mutate(editingPayment, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleEditingChange = (field: "name" | "amount", value: string) => {
    setEditingPayment((prev) => ({
      ...prev,
      [field]: field === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleDeletePayment = () => {
    if (payment.id) {
      deleteMutation.mutate(payment.id);
    }
  };

  const displayPayment = isEditing ? editingPayment : payment;
  const isStale = isPaymentStale(payment.lastModified);

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
        <Input
          placeholder="Name"
          value={displayPayment.name}
          onChange={(e) => handleEditingChange("name", e.target.value)}
          className="w-full"
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            €
          </span>
          <Input
            type="number"
            placeholder="0.00"
            value={displayPayment.amount}
            onChange={(e) => handleEditingChange("amount", e.target.value)}
            className="pl-7 w-full"
            step="0.01"
            min="0"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSaveEdit}
            disabled={updateMutation.isPending}
          >
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <button className="w-full rounded-lg border border-border/70 bg-card px-3 py-2.5 text-left transition-colors duration-150 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="flex items-center gap-3">
            {isInk ? (
              // Fixed-width slot so names line up whatever the drop's size.
              <span className="flex w-4 flex-shrink-0 justify-center">
                <InkDrop weight={getRelativeCost(payment.amount, payments)} />
              </span>
            ) : (
              <div
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{
                  backgroundColor: getTextColor(payment.amount, payments),
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{payment.name}</div>
            </div>
            <div className="flex flex-col items-end">
              {isStale && (
                <span
                  className={cn(
                    "px-1.5 text-[10px] font-semibold uppercase tracking-wide",
                    isInk
                      ? "-rotate-3 rounded-[3px] border border-primary text-accent-foreground"
                      : "rounded-sm bg-expense-muted text-expense"
                  )}
                >
                  old
                </span>
              )}
              <span className="figures font-medium">
                €{payment.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 flex gap-2 px-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleEditPayment();
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-expense hover:text-expense"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Regular Payment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{payment.name}"? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeletePayment}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}