import { db, records, categories } from "~/db";
import { sql, eq } from "drizzle-orm";

export type MonthlyTotalsDto = {
  monthDate: string; // Format: YYYY-MM
  total: number;
};

export type MonthlyExpensesVsIncomeDto = {
  monthDate: string; // Format: YYYY-MM
  expenses: number;
  income: number;
};

export type IncomeTrendsDto = {
  monthDate: string;
  categoryId: number;
  categoryName: string;
  total: number;
};

export const ChartsService = {
  async getMonthlyTotalsByCategory(
    categoryId: number
  ): Promise<MonthlyTotalsDto[]> {
    const result = await db
      .select({
        year: sql<number>`EXTRACT(YEAR FROM ${records.date})`,
        month: sql<number>`EXTRACT(MONTH FROM ${records.date})`,
        total: sql<number>`SUM(${records.value})`,
      })
      .from(records)
      .where(sql`${records.categoryId} = ${categoryId}`)
      .groupBy(
        sql`EXTRACT(YEAR FROM ${records.date})`,
        sql`EXTRACT(MONTH FROM ${records.date})`
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${records.date})`,
        sql`EXTRACT(MONTH FROM ${records.date})`
      );

    return result.map((item) => ({
      monthDate: `${item.year}-${item.month.toString().padStart(2, "0")}`,
      total: parseFloat(String(item.total)),
    }));
  },

  async getMonthlyExpensesVsIncome(): Promise<MonthlyExpensesVsIncomeDto[]> {
    const result = await db
      .select({
        year: sql<number>`EXTRACT(YEAR FROM ${records.date})`,
        month: sql<number>`EXTRACT(MONTH FROM ${records.date})`,
        isExpense: records.isExpense,
        total: sql<number>`SUM(${records.value})`,
      })
      .from(records)
      .groupBy(
        sql`EXTRACT(YEAR FROM ${records.date})`,
        sql`EXTRACT(MONTH FROM ${records.date})`,
        records.isExpense
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${records.date})`,
        sql`EXTRACT(MONTH FROM ${records.date})`
      );

    // Transform the result into the required format
    const monthlyData: Record<string, { expenses: number; income: number }> =
      {};

    result.forEach((item) => {
      const monthDate = `${item.year}-${item.month
        .toString()
        .padStart(2, "0")}`;

      if (!monthlyData[monthDate]) {
        monthlyData[monthDate] = { expenses: 0, income: 0 };
      }

      if (item.isExpense) {
        monthlyData[monthDate].expenses = parseFloat(String(item.total));
      } else {
        monthlyData[monthDate].income = parseFloat(String(item.total));
      }
    });

    return Object.entries(monthlyData).map(([monthDate, data]) => ({
      monthDate,
      expenses: data.expenses,
      income: data.income,
    }));
  },

  async getMonthlyIncomeByCategories(): Promise<
    {
      monthDate: string;
      categoryId: number;
      categoryName: string;
      total: number;
    }[]
  > {
    const result = await db
      .select({
        year: sql<number>`EXTRACT(YEAR FROM ${records.date})`,
        month: sql<number>`EXTRACT(MONTH FROM ${records.date})`,
        categoryId: records.categoryId,
        categoryName: categories.name,
        total: sql<number>`SUM(${records.value})`,
      })
      .from(records)
      .innerJoin(categories, eq(records.categoryId, categories.id))
      .where(eq(records.isExpense, false))
      .groupBy(
        sql`EXTRACT(YEAR FROM ${records.date})`,
        sql`EXTRACT(MONTH FROM ${records.date})`,
        records.categoryId,
        categories.name
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${records.date})`,
        sql`EXTRACT(MONTH FROM ${records.date})`,
        records.categoryId
      );

    return result.map((item) => ({
      monthDate: `${item.year}-${item.month.toString().padStart(2, "0")}`,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      total: parseFloat(String(item.total)),
    }));
  },
};