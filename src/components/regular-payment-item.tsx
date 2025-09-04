"use client";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
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
  RegularPaymentDto,
  useRegularPaymentsQuery,
  useUpdateRegularPaymentMutation,
  useDeleteRegularPaymentMutation,
} from "~/lib/queries";
import { Edit, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { usePaymentUtils } from "~/lib/hooks/use-payment-utils";

interface RegularPaymentItemProps {
  payment: RegularPaymentDto;
}

export function RegularPaymentItem({
  payment,
}: RegularPaymentItemProps) {
  const { data: payments = [] } = useRegularPaymentsQuery();
  const updateMutation = useUpdateRegularPaymentMutation();
  const deleteMutation = useDeleteRegularPaymentMutation();
  const { isPaymentStale, getTextColor } = usePaymentUtils();

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

  return (
    <div
      className={`flex space-x-2 ${isEditing ? "items-start" : "items-center"}`}
    >
      {isEditing ? (
        <>
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Name"
              value={displayPayment.name}
              onChange={(e) => handleEditingChange("name", e.target.value)}
              className="w-full"
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                $
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
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center flex-1 space-x-2">
            <div
              className="flex-1 font-medium pl-3"
              style={{
                borderLeft: `4px solid ${getTextColor(
                  payment.amount,
                  payments
                )}`,
              }}
            >
              <span>{payment.name}</span>
            </div>
            <div className="w-auto text-right font-medium">
              ${payment.amount.toFixed(2)}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {isStale && (
              <Badge variant="destructive" className="text-xs">
                Old
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={handleEditPayment}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
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
        </>
      )}
    </div>
  );
}