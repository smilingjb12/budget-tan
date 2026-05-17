import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { RegularPaymentsList } from "~/components/regular-payments-list";
import { BalanceSettingsCard } from "~/components/balance-settings-card";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-4">
      <BalanceSettingsCard />
      <Card>
        <CardHeader>
          <CardTitle>Regular Payments</CardTitle>
        </CardHeader>
        <RegularPaymentsList />
      </Card>
    </div>
  );
}
