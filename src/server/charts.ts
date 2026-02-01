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

// Get unique comment values for autocomplete (normalized)
export const getUniqueComments = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return await ChartsService.getUniqueComments()
  })

// Get expenses by selected items
const expensesByItemsSchema = z.object({
  items: z.array(z.string()).min(1),
});

export const getExpensesByItems = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(expensesByItemsSchema)
  .handler(async ({ data: { items } }) => {
    return await ChartsService.getExpensesByItems(items)
  })