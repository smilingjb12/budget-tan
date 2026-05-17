"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useBalanceQuery, useSetBalanceMutation } from "~/lib/queries";
import { formatEUR } from "~/lib/utils";
import LoadingIndicator from "./loading-indicator";

export function BalanceSettingsCard() {
  const { data: balance, isLoading } = useBalanceQuery();
  const setBalance = useSetBalanceMutation();

  const [input, setInput] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const parsed = parseFloat(input);
  const isValid = input.trim() !== "" && !Number.isNaN(parsed);

  const handleReplace = () => {
    setBalance.mutate(parsed, {
      onSuccess: () => {
        setInput("");
        setConfirmOpen(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !balance ? (
          <LoadingIndicator className="pb-4" />
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Current balance:{" "}
              <span className="font-semibold text-foreground">
                {formatEUR(balance.currentBalance)}
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance-input">New value (EUR)</Label>
              <div className="flex gap-2">
                <Input
                  id="balance-input"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0.00"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button
                  disabled={!isValid || setBalance.isPending}
                  onClick={() => setConfirmOpen(true)}
                >
                  Save
                </Button>
              </div>
            </div>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Replace current balance?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Replace {formatEUR(balance.currentBalance)} with{" "}
                    {isValid ? formatEUR(parsed) : "—"}. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={setBalance.isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={!isValid || setBalance.isPending}
                    onClick={handleReplace}
                  >
                    Replace
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
