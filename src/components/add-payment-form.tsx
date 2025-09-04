"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  RegularPaymentDto,
  useCreateRegularPaymentMutation,
} from "~/lib/queries";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface AddPaymentFormProps {
  onCancel: () => void;
}

export function AddPaymentForm({ onCancel }: AddPaymentFormProps) {
  const createMutation = useCreateRegularPaymentMutation();

  const [newPayment, setNewPayment] = useState<RegularPaymentDto>({
    name: "",
    amount: 0,
  });

  const handleSave = () => {
    createMutation.mutate(newPayment, {
      onSuccess: () => {
        setNewPayment({
          name: "",
          amount: 0,
        });
        onCancel();
      },
    });
  };

  const handleCancel = () => {
    setNewPayment({
      name: "",
      amount: 0,
    });
    onCancel();
  };

  return (
    <div className="flex items-start space-x-2">
      <div className="flex-1 space-y-2">
        <Input
          placeholder="Name"
          value={newPayment.name}
          onChange={(e) =>
            setNewPayment({ ...newPayment, name: e.target.value })
          }
          className="w-full"
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            $
          </span>
          <Input
            type="number"
            placeholder="0.00"
            value={newPayment.amount}
            onChange={(e) =>
              setNewPayment({
                ...newPayment,
                amount: parseFloat(e.target.value) || 0,
              })
            }
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
          onClick={handleSave}
          disabled={createMutation.isPending}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}