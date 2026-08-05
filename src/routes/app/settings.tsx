import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { RegularPaymentsList } from "~/components/regular-payments-list";
import { BalanceSettingsCard } from "~/components/balance-settings-card";
import { LogRegularPaymentsButton } from "~/components/log-regular-payments-button";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-4">
      <BalanceSettingsCard />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Regular Payments</CardTitle>
          <LogRegularPaymentsButton />
        </CardHeader>
        <RegularPaymentsList />
      </Card>
    </div>
  );
}
