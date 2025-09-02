import { createServerFn } from '@tanstack/react-start'
import { ExchangeRateService } from '~/services/exchange-rate-service'

export const getExchangeRate = createServerFn({
  method: 'GET',
}).handler(async () => {
  'use server'
  try {
    return await ExchangeRateService.getExchangeRate()
  } catch (error) {
    throw new Error(`Failed to fetch exchange rate: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})