import { createServerFn } from '@tanstack/react-start'
import { RegularPaymentService, RegularPaymentDto } from '~/services/regular-payment-service'
import { z } from 'zod'

// Export the type for use in other files
export type { RegularPaymentDto }

// Zod schema for RegularPaymentDto
const regularPaymentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  amount: z.number(),
  date: z.string(),
})

// Get all regular payments
export const getRegularPayments = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await RegularPaymentService.getRegularPayments()
  }
)

// Save regular payments (replaces all existing payments)
export const saveRegularPayments = createServerFn({ method: 'POST' })
  .validator(z.array(regularPaymentSchema))
  .handler(async ({ data: payments }) => {
    return await RegularPaymentService.saveRegularPayments(payments)
  })