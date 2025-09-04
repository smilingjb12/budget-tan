import { createServerFn } from '@tanstack/react-start'
import { CategoryService } from '~/services/category-service'
import { authMiddleware } from '~/middleware/auth'

export const getCategories = createServerFn({
  method: 'GET',
}).middleware([authMiddleware]).handler(async () => {
  return await CategoryService.getCategories()
})

export const getExpenseCategories = createServerFn({
  method: 'GET',
}).middleware([authMiddleware]).handler(async () => {
  return await CategoryService.getExpenseCategories()
})

export const getIncomeCategories = createServerFn({
  method: 'GET',
}).middleware([authMiddleware]).handler(async () => {
  return await CategoryService.getIncomeCategories()
})