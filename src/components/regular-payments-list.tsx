"use client";

import { Button } from "~/components/ui/button";
import { CardContent, CardFooter } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  useRegularPaymentsQuery,
  RegularPaymentDto,
} from "~/lib/queries";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingIndicator from "./loading-indicator";
import { RegularPaymentItem } from "./regular-payment-item";
import { AddPaymentForm } from "./add-payment-form";
import { useCreateRegularPaymentMutation } from "~/lib/queries";

export function RegularPaymentsList() {
  const { data: regularPayments, isLoading, error } = useRegularPaymentsQuery();

  const [payments, setPayments] = useState<RegularPaymentDto[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPayment, setNewPayment] = useState<RegularPaymentDto>({
    name: "",
    amount: 0,
  });
  const createMutation = useCreateRegularPaymentMutation();

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

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewPayment({ name: "", amount: 0 });
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
        <div className="space-y-3">
          {payments.map((payment: RegularPaymentDto) => (
            <RegularPaymentItem
              key={payment.id || "new"}
              payment={payment}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Dialog
            open={isAddingNew}
            onOpenChange={(open) => {
              setIsAddingNew(open);
              if (!open) {
                setNewPayment({ name: "", amount: 0 });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Regular Payment</DialogTitle>
              </DialogHeader>
              <AddPaymentForm
                onCancel={handleCancelNew}
                value={newPayment}
                onChange={setNewPayment}
                hideActions
              />
              <DialogFooter>
                <Button
                  onClick={() =>
                    createMutation.mutate(newPayment, {
                      onSuccess: () => {
                        setNewPayment({ name: "", amount: 0 });
                        setIsAddingNew(false);
                      },
                    })
                  }
                  disabled={
                    createMutation.isPending ||
                    !newPayment.name.trim() ||
                    (newPayment.amount ?? 0) <= 0
                  }
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="font-semibold text-right">
          Total: ${totalAmount.toFixed(2)}
        </div>
      </CardFooter>
    </>
  );
}
