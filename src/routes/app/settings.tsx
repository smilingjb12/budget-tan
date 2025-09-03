import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle } from "~/components/ui/card"
import { RegularPaymentsList } from "~/components/regular-payments-list"

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Regular Payments</CardTitle>
        </CardHeader>
        <RegularPaymentsList />
      </Card>
    </div>
  )
}