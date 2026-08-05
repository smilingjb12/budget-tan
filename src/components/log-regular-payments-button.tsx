"use client";

import { Button } from "~/components/ui/button";
import { useRegularPaymentsQuery, RegularPaymentDto } from "~/lib/queries";
import { Receipt } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

/** Category the regular payments total is booked against. */
export const REGULAR_PAYMENTS_CATEGORY_NAME = "Rent & Bills";
/** Note pre-filled on the created record. */
export const REGULAR_PAYMENTS_NOTE = "Regular payments";

/**
 * Sends the user to the current month's history view with the add-expense
 * dialog open and pre-filled with the regular payments total, so the record
 * is only created after an explicit confirmation.
 */
export function LogRegularPaymentsButton() {
  const router = useRouter();
  const { data: regularPayments = [], isLoading } = useRegularPaymentsQuery();

  const total = regularPayments.reduce(
    (sum: number, payment: RegularPaymentDto) => sum + payment.amount,
    0
  );

  const handleClick = () => {
    const now = new Date();
    void router.navigate({
      to: "/app/$year/$month",
      params: {
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString(),
      },
      search: {
        addExpense: true,
        amount: Number(total.toFixed(2)),
        category: REGULAR_PAYMENTS_CATEGORY_NAME,
        note: REGULAR_PAYMENTS_NOTE,
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading || total <= 0}
      title={`Log €${total.toFixed(2)} as an expense`}
    >
      <Receipt className="h-4 w-4 mr-2" />
      Log expense
    </Button>
  );
}
