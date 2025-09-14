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
  value?: RegularPaymentDto;
  onChange?: (payment: RegularPaymentDto) => void;
  hideActions?: boolean;
}

export function AddPaymentForm({
  onCancel,
  value,
  onChange,
  hideActions,
}: AddPaymentFormProps) {
  const createMutation = useCreateRegularPaymentMutation();

  const [internalPayment, setInternalPayment] = useState<RegularPaymentDto>({
    name: "",
    amount: 0,
  });

  const payment = value ?? internalPayment;

  const updatePayment = (next: RegularPaymentDto) => {
    if (onChange) {
      onChange(next);
    } else {
      setInternalPayment(next);
    }
  };

  const handleSave = () => {
    createMutation.mutate(payment, {
      onSuccess: () => {
        if (!onChange) {
          setInternalPayment({ name: "", amount: 0 });
        }
        onCancel();
      },
    });
  };

  const handleCancel = () => {
    if (!onChange) {
      setInternalPayment({ name: "", amount: 0 });
    }
    onCancel();
  };

  return (
    <div className="flex items-start space-x-2">
      <div className="flex-1 space-y-2">
        <Input
          placeholder="Name"
          value={payment.name}
          onChange={(e) => updatePayment({ ...payment, name: e.target.value })}
          className="w-full"
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            $
          </span>
          <Input
            type="number"
            placeholder="0.00"
            value={payment.amount}
            onChange={(e) =>
              updatePayment({
                ...payment,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            className="pl-7 w-full"
            step="0.01"
            min="0"
          />
        </div>
      </div>
      {!hideActions && (
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
      )}
    </div>
  );
}
