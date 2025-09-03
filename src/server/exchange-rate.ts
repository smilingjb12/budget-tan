import { createServerFn } from '@tanstack/react-start'
import { ExchangeRateService } from '~/services/exchange-rate-service'

export const getExchangeRate = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await ExchangeRateService.getExchangeRate()
})