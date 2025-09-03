import { createServerFn } from '@tanstack/react-start'
import { RegularPaymentService, RegularPaymentDto } from '~/services/regular-payment-service'

// Export the type for use in other files
export type { RegularPaymentDto }

// Get all regular payments
export const getRegularPayments = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await RegularPaymentService.getRegularPayments()
  }
)

// Save regular payments (replaces all existing payments)
export const saveRegularPayments = createServerFn({ method: 'POST' })
  .validator((payments: RegularPaymentDto[]) => payments)
  .handler(async ({ data: payments }) => {
    return await RegularPaymentService.saveRegularPayments(payments)
  })