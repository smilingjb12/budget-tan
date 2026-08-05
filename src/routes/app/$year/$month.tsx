import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { MonthlyHeader, ViewType } from '~/components/monthly-header'
import { MonthlySummaryCard } from '~/components/monthly-summary-card'
import { AddRecordDialog } from '~/components/add-record-dialog'
import { ErrorBoundary } from '~/components/error-boundary'
import { Month } from '~/lib/routes'

// Optional search params used to deep-link into a pre-filled "Add Expense" dialog
// (e.g. from the regular payments card in settings).
const monthSearchSchema = z.object({
  addExpense: z.boolean().optional(),
  amount: z.number().optional(),
  category: z.string().optional(),
  note: z.string().optional(),
})

type MonthSearch = z.infer<typeof monthSearchSchema>

export const Route = createFileRoute('/app/$year/$month')({
  validateSearch: (search: Record<string, unknown>): MonthSearch => {
    const result = monthSearchSchema.safeParse(search)
    return result.success ? result.data : {}
  },
  component: MonthlyBudgetPage,
})

function MonthlyBudgetPage() {
  const { year, month } = Route.useParams()
  const search = Route.useSearch()
  const router = useRouter()
  const [viewType, setViewType] = useState<ViewType>("expenses")

  const monthNumber = Number(month) as Month
  const yearNumber = Number(year)

  const handleToggleViewType = () => {
    setViewType((prev) => (prev === "expenses" ? "income" : "expenses"))
  }

  const prefill = useMemo(() => {
    if (!search.addExpense) return null
    return {
      amountEur: search.amount,
      categoryName: search.category,
      comment: search.note,
    }
  }, [search.addExpense, search.amount, search.category, search.note])

  // Drop the deep-link params once the dialog has been dealt with, so the
  // pre-filled dialog does not reappear on a refresh or back navigation.
  const handlePrefillConsumed = () => {
    if (!search.addExpense) return
    void router.navigate({
      to: '/app/$year/$month',
      params: { year, month },
      search: {},
      replace: true,
    })
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4 relative">
        <MonthlyHeader
          viewType={viewType}
          onToggleViewType={handleToggleViewType}
          month={monthNumber}
          year={yearNumber}
        />

        <MonthlySummaryCard viewType={viewType} />

        <div className="fixed bottom-20 right-10 z-50">
          <AddRecordDialog
            isIncome={viewType === "income"}
            prefill={prefill}
            onPrefillConsumed={handlePrefillConsumed}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
