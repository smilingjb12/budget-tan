import { createServerFn } from '@tanstack/react-start'
import { ChartsService } from '~/services/charts-service'

// Get expenses by category over time
export const getCategoryExpenses = createServerFn({ method: 'GET' })
  .validator(({ categoryId }: { categoryId: number }) => ({ categoryId }))
  .handler(async ({ data: { categoryId } }) => {
    'use server'
    return await ChartsService.getMonthlyTotalsByCategory(categoryId)
  })

// Get monthly expenses vs income data
export const getMonthlyExpensesVsIncome = createServerFn({ method: 'GET' }).handler(
  async () => {
    'use server'
    return await ChartsService.getMonthlyExpensesVsIncome()
  }
)

// Get income trends by categories
export const getIncomeTrends = createServerFn({ method: 'GET' }).handler(
  async () => {
    'use server'
    return await ChartsService.getMonthlyIncomeByCategories()
  }
)