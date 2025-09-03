import { createServerFn } from '@tanstack/react-start'
import { ChartsService } from '~/services/charts-service'

// Get expenses by category over time
export const getCategoryExpenses = createServerFn({ method: 'GET' })
  .validator(({ categoryId }: { categoryId: number }) => ({ categoryId }))
  .handler(async ({ data: { categoryId } }) => {
    return await ChartsService.getMonthlyTotalsByCategory(categoryId)
  })

// Get monthly expenses vs income data
export const getMonthlyExpensesVsIncome = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await ChartsService.getMonthlyExpensesVsIncome()
  }
)

// Get income trends by categories
export const getIncomeTrends = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await ChartsService.getMonthlyIncomeByCategories()
  }
)