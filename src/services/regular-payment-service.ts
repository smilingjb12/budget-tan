import { db } from '~/db'
import { regularPayments } from '~/db/schema/schema'
import { eq } from 'drizzle-orm'

export interface RegularPaymentDto {
  id?: number
  name: string
  amount: number
  lastModified?: string
}

export const RegularPaymentService = {
  async getRegularPayments(): Promise<RegularPaymentDto[]> {
    const result = await db
      .select({
        id: regularPayments.id,
        name: regularPayments.name,
        amount: regularPayments.amount,
        lastModified: regularPayments.lastModified,
      })
      .from(regularPayments)
      .orderBy(regularPayments.name)

    return result.map((payment) => ({
      id: payment.id,
      name: payment.name,
      amount: Number(payment.amount),
      lastModified: payment.lastModified.toISOString(),
    }))
  },

  async createRegularPayment(payment: RegularPaymentDto): Promise<{ success: boolean }> {
    await db
      .insert(regularPayments)
      .values({
        name: payment.name,
        amount: payment.amount.toString(),
        lastModified: new Date(), // Always set explicitly
      })

    return { success: true }
  },

  async updateRegularPayment(payment: RegularPaymentDto): Promise<{ success: boolean }> {
    if (!payment.id) {
      throw new Error('Payment ID is required for updates')
    }

    // Get the current payment to check if values actually changed
    const current = await db
      .select({
        name: regularPayments.name,
        amount: regularPayments.amount,
      })
      .from(regularPayments)
      .where(eq(regularPayments.id, payment.id))
      .limit(1)

    if (current.length === 0) {
      throw new Error('Payment not found')
    }

    const currentPayment = current[0]
    const hasChanged = 
      currentPayment.name !== payment.name || 
      Number(currentPayment.amount) !== payment.amount

    if (!hasChanged) {
      // No changes, don't update lastModified
      return { success: true }
    }

    await db
      .update(regularPayments)
      .set({
        name: payment.name,
        amount: payment.amount.toString(),
        lastModified: new Date(), // Only update when values actually changed
      })
      .where(eq(regularPayments.id, payment.id))

    return { success: true }
  },

  async deleteRegularPayment(id: number): Promise<{ success: boolean }> {
    await db
      .delete(regularPayments)
      .where(eq(regularPayments.id, id))

    return { success: true }
  },
}