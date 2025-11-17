import { createServerFn } from '@tanstack/react-start'
import { RegularPaymentService, RegularPaymentDto } from '~/services/regular-payment-service'
import { z } from 'zod'
import { authMiddleware } from '~/middleware/auth'

// Export the type for use in other files
export type { RegularPaymentDto }

// Zod schema for RegularPaymentDto
const regularPaymentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  amount: z.number(),
  lastModified: z.string().optional(),
})

// Get all regular payments
export const getRegularPayments = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return await RegularPaymentService.getRegularPayments()
  })

// Create a new regular payment
export const createRegularPayment = createServerFn({ method: 'POST' })
  .inputValidator(regularPaymentSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: payment }) => {
    return await RegularPaymentService.createRegularPayment(payment)
  })

// Update a single regular payment
export const updateRegularPayment = createServerFn({ method: 'POST' })
  .inputValidator(regularPaymentSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: payment }) => {
    return await RegularPaymentService.updateRegularPayment(payment)
  })

// Delete a regular payment
export const deleteRegularPayment = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    return await RegularPaymentService.deleteRegularPayment(data.id)
  })