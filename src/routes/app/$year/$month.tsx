import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MonthlyHeader, ViewType } from '~/components/monthly-header'
import { MonthlySummaryCard } from '~/components/monthly-summary-card'
import { AddRecordDialog } from '~/components/add-record-dialog'
import { ErrorBoundary } from '~/components/error-boundary'
import { Month } from '~/lib/routes'

export const Route = createFileRoute('/app/$year/$month')({
  component: MonthlyBudgetPage,
})

function MonthlyBudgetPage() {
  const { year, month } = Route.useParams()
  const [viewType, setViewType] = useState<ViewType>("expenses")

  const monthNumber = Number(month) as Month
  const yearNumber = Number(year)

  const handleToggleViewType = () => {
    setViewType((prev) => (prev === "expenses" ? "income" : "expenses"))
  }

  return (
    <ErrorBoundary>
      <div className="pt-6 pb-12 px-2 space-y-4 relative">
        <MonthlyHeader
          viewType={viewType}
          onToggleViewType={handleToggleViewType}
          month={monthNumber}
          year={yearNumber}
        />

        <MonthlySummaryCard viewType={viewType} />

        <div className="fixed bottom-20 right-10 z-50">
          <AddRecordDialog isIncome={viewType === "income"} />
        </div>
      </div>
    </ErrorBoundary>
  )
}