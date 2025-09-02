import { createServerFn } from '@tanstack/react-start'
import { CategoryService } from '~/services/category-service'

export const getCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  'use server'
  try {
    return await CategoryService.getCategories()
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})

export const getExpenseCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  'use server'
  try {
    return await CategoryService.getExpenseCategories()
  } catch (error) {
    throw new Error(`Failed to fetch expense categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})

export const getIncomeCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  'use server'
  try {
    return await CategoryService.getIncomeCategories()
  } catch (error) {
    throw new Error(`Failed to fetch income categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})