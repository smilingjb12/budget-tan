import { createServerFn } from '@tanstack/react-start'
import { RecordService, CreateOrUpdateRecordRequest } from '~/services/record-service'
import { Month } from '~/lib/routes'

export const getMonthSummary = createServerFn({
  method: 'GET',
})
  .validator(({ year, month }: { year: number, month: Month }) => ({ year, month }))
  .handler(async ({ data: { year, month } }) => {
    'use server'
    try {
      return await RecordService.getMonthSummary(year, month)
    } catch (error) {
      throw new Error(`Failed to fetch month summary: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

export const getAllTimeSummary = createServerFn({
  method: 'GET',
}).handler(async () => {
  'use server'
  try {
    return await RecordService.getAllTimeSummary()
  } catch (error) {
    throw new Error(`Failed to fetch all time summary: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})

export const getRecordsByMonth = createServerFn({
  method: 'GET',
})
  .validator(({ year, month }: { year: number, month: Month }) => ({ year, month }))
  .handler(async ({ data: { year, month } }) => {
    'use server'
    try {
      return await RecordService.getRecordsByMonth(year, month)
    } catch (error) {
      throw new Error(`Failed to fetch records: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

export const getRecordById = createServerFn({
  method: 'GET',
})
  .validator(({ id }: { id: number }) => ({ id }))
  .handler(async ({ data: { id } }) => {
    'use server'
    try {
      return await RecordService.getRecordById(id)
    } catch (error) {
      throw new Error(`Failed to fetch record: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

export const createRecord = createServerFn({
  method: 'POST',
})
  .validator((data: CreateOrUpdateRecordRequest) => data)
  .handler(async ({ data }) => {
    'use server'
    try {
      return await RecordService.createRecord(data)
    } catch (error) {
      throw new Error(`Failed to create record: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

export const updateRecord = createServerFn({
  method: 'POST',
})
  .validator((data: CreateOrUpdateRecordRequest) => data)
  .handler(async ({ data }) => {
    'use server'
    try {
      return await RecordService.updateRecord(data)
    } catch (error) {
      throw new Error(`Failed to update record: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

export const deleteRecord = createServerFn({
  method: 'POST',
})
  .validator(({ id }: { id: number }) => ({ id }))
  .handler(async ({ data: { id } }) => {
    'use server'
    try {
      return await RecordService.deleteRecord(id)
    } catch (error) {
      throw new Error(`Failed to delete record: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

export const searchRecordComments = createServerFn({
  method: 'GET',
})
  .validator(({ comment }: { comment: string }) => ({ comment }))
  .handler(async ({ data: { comment } }) => {
    'use server'
    try {
      return await RecordService.searchRecordComments(comment)
    } catch (error) {
      throw new Error(`Failed to search comments: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

export const getExpensesVsIncome = createServerFn({
  method: 'GET',
}).handler(async () => {
  'use server'
  try {
    return await RecordService.getExpensesVsIncome()
  } catch (error) {
    throw new Error(`Failed to fetch expenses vs income data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})