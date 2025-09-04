import { createServerFn } from '@tanstack/react-start'
import { ChartsService } from '~/services/charts-service'
import { z } from 'zod'
import { authMiddleware } from '~/middleware/auth'

// Get expenses by category over time
const categoryIdSchema = z.object({
  categoryId: z.number().int().positive(),
});

export const getCategoryExpenses = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(categoryIdSchema)
  .handler(async ({ data: { categoryId } }) => {
    return await ChartsService.getMonthlyTotalsByCategory(categoryId)
  })

// Get monthly expenses vs income data
export const getMonthlyExpensesVsIncome = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return await ChartsService.getMonthlyExpensesVsIncome()
  })

// Get income trends by categories
export const getIncomeTrends = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return await ChartsService.getMonthlyIncomeByCategories()
  })