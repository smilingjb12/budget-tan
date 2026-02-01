import { db, records, categories } from "~/db";
import { sql, eq, isNotNull, ne, and } from "drizzle-orm";
import { normalizeItemName } from "~/lib/utils";

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

export type ExpenseByItemDto = {
  monthDate: string;
  items: Array<{ item: string; total: number }>;
  monthlyTotal: number;
};

export type ExpenseByItemResponseDto = {
  data: ExpenseByItemDto[];
  grandTotal: number;
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

  async getUniqueComments(): Promise<string[]> {
    const result = await db
      .selectDistinct({
        comment: records.comment,
      })
      .from(records)
      .where(
        and(
          isNotNull(records.comment),
          ne(records.comment, ""),
          eq(records.isExpense, true)
        )
      )
      .orderBy(records.comment);

    // Normalize and deduplicate
    const normalizedSet = new Set<string>();
    result.forEach((r) => {
      if (r.comment) {
        normalizedSet.add(normalizeItemName(r.comment));
      }
    });

    return Array.from(normalizedSet).sort();
  },

  async getExpensesByItems(items: string[]): Promise<ExpenseByItemResponseDto> {
    if (items.length === 0) {
      return { data: [], grandTotal: 0 };
    }

    // Fetch all expense records with non-empty comments
    const result = await db
      .select({
        year: sql<number>`EXTRACT(YEAR FROM ${records.date})`,
        month: sql<number>`EXTRACT(MONTH FROM ${records.date})`,
        comment: records.comment,
        value: records.value,
      })
      .from(records)
      .where(
        and(
          eq(records.isExpense, true),
          isNotNull(records.comment),
          ne(records.comment, "")
        )
      );

    // Normalize items for comparison
    const normalizedItems = new Set(items.map((item) => normalizeItemName(item)));

    // Group by month and normalized comment
    const monthlyData: Record<
      string,
      {
        items: Record<string, number>;
        monthlyTotal: number;
      }
    > = {};
    let grandTotal = 0;

    result.forEach((row) => {
      if (!row.comment) return;

      const normalizedComment = normalizeItemName(row.comment);
      if (!normalizedItems.has(normalizedComment)) return;

      const monthDate = `${row.year}-${row.month.toString().padStart(2, "0")}`;
      const value = parseFloat(String(row.value));

      if (!monthlyData[monthDate]) {
        monthlyData[monthDate] = { items: {}, monthlyTotal: 0 };
      }

      monthlyData[monthDate].items[normalizedComment] =
        (monthlyData[monthDate].items[normalizedComment] || 0) + value;
      monthlyData[monthDate].monthlyTotal += value;
      grandTotal += value;
    });

    // Transform to ExpenseByItemDto format
    const data: ExpenseByItemDto[] = Object.entries(monthlyData)
      .map(([monthDate, { items, monthlyTotal }]) => ({
        monthDate,
        items: Object.entries(items).map(([item, total]) => ({ item, total })),
        monthlyTotal,
      }))
      .sort((a, b) => a.monthDate.localeCompare(b.monthDate));

    return { data, grandTotal };
  },
};