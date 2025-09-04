"use client";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  useRegularPaymentsQuery,
  useCreateRegularPaymentMutation,
  useUpdateRegularPaymentMutation,
  useDeleteRegularPaymentMutation,
  RegularPaymentDto,
} from "~/lib/queries";
import { Edit, Plus, Trash2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingIndicator from "./loading-indicator";

export function RegularPaymentsList() {
  const { data: regularPayments, isLoading, error } = useRegularPaymentsQuery();
  const createMutation = useCreateRegularPaymentMutation();
  const updateMutation = useUpdateRegularPaymentMutation();
  const deleteMutation = useDeleteRegularPaymentMutation();

  const [payments, setPayments] = useState<RegularPaymentDto[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editingIds, setEditingIds] = useState<Set<number>>(new Set());
  const [editingPayments, setEditingPayments] = useState<
    Map<number, RegularPaymentDto>
  >(new Map());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPayment, setNewPayment] = useState<RegularPaymentDto>({
    name: "",
    amount: 0,
  });

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

  const isPaymentStale = (lastModified?: string) => {
    if (!lastModified) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastModified) < thirtyDaysAgo;
  };

  const getTextColor = (value: number, data: RegularPaymentDto[]) => {
    if (!data || data.length === 0) return "hsl(var(--primary))";

    const values = data.map((item: RegularPaymentDto) => item.amount);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    // Normalize the value to a 0-1 scale
    const normalizedValue = range === 0 ? 0.5 : (value - minValue) / range;

    // Define color stops for the gradient
    const colorStops = [
      { point: 0, color: { h: 142, s: 76, l: 36 } }, // Green (low)
      { point: 0.5, color: { h: 35, s: 92, l: 58 } }, // Yellow/Orange (middle)
      { point: 1, color: { h: 0, s: 84, l: 60 } }, // Red (high)
    ];

    // Find the two color stops to interpolate between
    let lowerStop = colorStops[0];
    let upperStop = colorStops[colorStops.length - 1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (
        normalizedValue >= colorStops[i].point &&
        normalizedValue <= colorStops[i + 1].point
      ) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    // Calculate how far between the two stops the value is (0 to 1)
    const stopRange = upperStop.point - lowerStop.point;
    const stopFraction =
      stopRange === 0 ? 0 : (normalizedValue - lowerStop.point) / stopRange;

    // Interpolate between the two colors
    const h = Math.round(
      lowerStop.color.h + stopFraction * (upperStop.color.h - lowerStop.color.h)
    );
    const s = Math.round(
      lowerStop.color.s + stopFraction * (upperStop.color.s - lowerStop.color.s)
    );
    const l = Math.round(
      lowerStop.color.l + stopFraction * (upperStop.color.l - lowerStop.color.l)
    );

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const handleEditPayment = (payment: RegularPaymentDto) => {
    if (!payment.id) return;
    setEditingIds((prev) => new Set([...prev, payment.id!]));
    setEditingPayments((prev) =>
      new Map(prev).set(payment.id!, { ...payment })
    );
  };

  const handleCancelEdit = (paymentId: number) => {
    setEditingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(paymentId);
      return newSet;
    });
    setEditingPayments((prev) => {
      const newMap = new Map(prev);
      newMap.delete(paymentId);
      return newMap;
    });
  };

  const handleSaveEdit = (paymentId: number) => {
    const editedPayment = editingPayments.get(paymentId);
    if (!editedPayment) return;

    updateMutation.mutate(editedPayment, {
      onSuccess: () => {
        setEditingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(paymentId);
          return newSet;
        });
        setEditingPayments((prev) => {
          const newMap = new Map(prev);
          newMap.delete(paymentId);
          return newMap;
        });
      },
    });
  };

  const handleEditingChange = (
    paymentId: number,
    field: "name" | "amount",
    value: string
  ) => {
    setEditingPayments((prev) => {
      const newMap = new Map(prev);
      const payment = newMap.get(paymentId);
      if (payment) {
        newMap.set(paymentId, {
          ...payment,
          [field]: field === "amount" ? parseFloat(value) || 0 : value,
        });
      }
      return newMap;
    });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = () => {
    createMutation.mutate(newPayment, {
      onSuccess: () => {
        setIsAddingNew(false);
        setNewPayment({
          name: "",
          amount: 0,
        });
      },
    });
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewPayment({
      name: "",
      amount: 0,
    });
  };

  const handleDeletePayment = (paymentId: number) => {
    deleteMutation.mutate(paymentId);
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
          {payments.map((payment: RegularPaymentDto) => {
            const isEditing = payment.id && editingIds.has(payment.id);
            const editingData = payment.id
              ? editingPayments.get(payment.id)
              : null;
            const displayPayment =
              isEditing && editingData ? editingData : payment;
            const isStale = isPaymentStale(payment.lastModified);

            return (
              <div
                key={payment.id || "new"}
                className={`flex space-x-2 ${isEditing ? "items-start" : "items-center"}`}
              >
                {isEditing ? (
                  <>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Name"
                        value={displayPayment.name}
                        onChange={(e) =>
                          handleEditingChange(
                            payment.id!,
                            "name",
                            e.target.value
                          )
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
                          value={displayPayment.amount}
                          onChange={(e) =>
                            handleEditingChange(
                              payment.id!,
                              "amount",
                              e.target.value
                            )
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
                        onClick={() => handleSaveEdit(payment.id!)}
                        disabled={updateMutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancelEdit(payment.id!)}
                      >
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPayment(payment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePayment(payment.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {isAddingNew && (
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
                  onClick={handleSaveNew}
                  disabled={createMutation.isPending}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancelNew}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
