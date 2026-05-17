import { sql } from "drizzle-orm";
import { balance, db, type DbTx } from "~/db";

export type BalanceDto = {
  currentBalance: number;
};

export const BalanceService = {
  async get(): Promise<BalanceDto> {
    const rows = await db
      .select({ currentBalance: balance.currentBalance })
      .from(balance)
      .limit(1);

    const row = rows[0];
    return {
      currentBalance: row ? parseFloat(row.currentBalance) : 0,
    };
  },

  async overwrite(value: number): Promise<void> {
    await db.update(balance).set({
      currentBalance: value.toString(),
      updatedAt: new Date(),
    });
  },

  async adjust(delta: number, tx: DbTx): Promise<void> {
    if (delta === 0) return;
    await tx.update(balance).set({
      currentBalance: sql`${balance.currentBalance} + ${delta.toString()}::numeric`,
      updatedAt: new Date(),
    });
  },

  contributionFor({
    value,
    isExpense,
  }: {
    value: number;
    isExpense: boolean;
  }): number {
    return isExpense ? -value : value;
  },
};
