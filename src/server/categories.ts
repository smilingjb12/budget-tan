import { createServerFn } from '@tanstack/react-start'
import { CategoryService } from '~/services/category-service'

export const getCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await CategoryService.getCategories()
})

export const getExpenseCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await CategoryService.getExpenseCategories()
})

export const getIncomeCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await CategoryService.getIncomeCategories()
})