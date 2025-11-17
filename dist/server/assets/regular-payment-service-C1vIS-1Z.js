import { d as db, f as regularPayments, e as eq } from "./auth-DKIui-sa.js";
const RegularPaymentService = {
  async getRegularPayments() {
    const result = await db.select({
      id: regularPayments.id,
      name: regularPayments.name,
      amount: regularPayments.amount,
      lastModified: regularPayments.lastModified
    }).from(regularPayments).orderBy(regularPayments.name);
    return result.map((payment) => ({
      id: payment.id,
      name: payment.name,
      amount: Number(payment.amount),
      lastModified: payment.lastModified.toISOString()
    }));
  },
  async createRegularPayment(payment) {
    await db.insert(regularPayments).values({
      name: payment.name,
      amount: payment.amount.toString(),
      lastModified: /* @__PURE__ */ new Date()
      // Always set explicitly
    });
    return { success: true };
  },
  async updateRegularPayment(payment) {
    if (!payment.id) {
      throw new Error("Payment ID is required for updates");
    }
    const current = await db.select({
      name: regularPayments.name,
      amount: regularPayments.amount
    }).from(regularPayments).where(eq(regularPayments.id, payment.id)).limit(1);
    if (current.length === 0) {
      throw new Error("Payment not found");
    }
    const currentPayment = current[0];
    const hasChanged = currentPayment.name !== payment.name || Number(currentPayment.amount) !== payment.amount;
    if (!hasChanged) {
      return { success: true };
    }
    await db.update(regularPayments).set({
      name: payment.name,
      amount: payment.amount.toString(),
      lastModified: /* @__PURE__ */ new Date()
      // Only update when values actually changed
    }).where(eq(regularPayments.id, payment.id));
    return { success: true };
  },
  async deleteRegularPayment(id) {
    await db.delete(regularPayments).where(eq(regularPayments.id, id));
    return { success: true };
  }
};
export {
  RegularPaymentService as R
};
