"use client";

import { Button } from "~/components/ui/button";
import { CardContent, CardFooter } from "~/components/ui/card";
import {
  useRegularPaymentsQuery,
  RegularPaymentDto,
} from "~/lib/queries";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingIndicator from "./loading-indicator";
import { RegularPaymentItem } from "./regular-payment-item";
import { AddPaymentForm } from "./add-payment-form";

export function RegularPaymentsList() {
  const { data: regularPayments, isLoading, error } = useRegularPaymentsQuery();

  const [payments, setPayments] = useState<RegularPaymentDto[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (regularPayments && Array.isArray(regularPayments)) {
      // Sort payments by amount in descending order
      const sortedPayments = [...(regularPayments as RegularPaymentDto[])].sort(
        (a: RegularPaymentDto, b: RegularPaymentDto) => b.amount - a.amount
      );
      setPayments(sortedPayments);
      calculateTotal(sortedPayments);
    }
  }, [regularPayments]);

  const calculateTotal = (items: RegularPaymentDto[]) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
  };

  if (isLoading) {
    return <LoadingIndicator className="pb-4" />;
  }

  if (error) {
    return <div>Error loading regular payments</div>;
  }

  return (
    <>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment: RegularPaymentDto) => (
            <RegularPaymentItem
              key={payment.id || "new"}
              payment={payment}
            />
          ))}

          {isAddingNew && (
            <AddPaymentForm onCancel={handleCancelNew} />
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {!isAddingNew && (
            <Button variant="outline" onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" /> Add Payment
            </Button>
          )}
        </div>
        <div className="font-semibold text-right">
          Total: ${totalAmount.toFixed(2)}
        </div>
      </CardFooter>
    </>
  );
}
