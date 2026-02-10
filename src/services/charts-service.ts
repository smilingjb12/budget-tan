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

export type GroupedCommentsDto = {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  items: string[];
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

  async getUniqueCommentsGroupedByCategory(): Promise<GroupedCommentsDto[]> {
    // Fetch all expense records with comments, including category info
    const result = await db
      .select({
        comment: records.comment,
        categoryId: records.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryOrder: categories.order,
      })
      .from(records)
      .innerJoin(categories, eq(records.categoryId, categories.id))
      .where(
        and(
          isNotNull(records.comment),
          ne(records.comment, ""),
          eq(records.isExpense, true)
        )
      );

    // Count occurrences of each normalized comment per category
    const commentCategoryCounts: Record<
      string,
      Record<number, { count: number; name: string; icon: string; order: number }>
    > = {};

    result.forEach((r) => {
      if (!r.comment) return;
      const normalized = normalizeItemName(r.comment);

      if (!commentCategoryCounts[normalized]) {
        commentCategoryCounts[normalized] = {};
      }

      if (!commentCategoryCounts[normalized][r.categoryId]) {
        commentCategoryCounts[normalized][r.categoryId] = {
          count: 0,
          name: r.categoryName,
          icon: r.categoryIcon,
          order: r.categoryOrder,
        };
      }

      commentCategoryCounts[normalized][r.categoryId].count++;
    });

    // Assign each comment to its most frequently used category
    const categoryItems: Record<
      number,
      { name: string; icon: string; order: number; items: Set<string> }
    > = {};

    Object.entries(commentCategoryCounts).forEach(([comment, categoryCounts]) => {
      // Find the category with the highest count for this comment
      let maxCount = 0;
      let primaryCategoryId = 0;
      let primaryCategory = { name: "", icon: "", order: 0 };

      Object.entries(categoryCounts).forEach(([catIdStr, catData]) => {
        const catId = parseInt(catIdStr, 10);
        if (catData.count > maxCount) {
          maxCount = catData.count;
          primaryCategoryId = catId;
          primaryCategory = {
            name: catData.name,
            icon: catData.icon,
            order: catData.order,
          };
        }
      });

      // Add comment to its primary category
      if (!categoryItems[primaryCategoryId]) {
        categoryItems[primaryCategoryId] = {
          ...primaryCategory,
          items: new Set(),
        };
      }
      categoryItems[primaryCategoryId].items.add(comment);
    });

    // Convert to array and sort by category order, then items alphabetically
    return Object.entries(categoryItems)
      .map(([catIdStr, catData]) => ({
        categoryId: parseInt(catIdStr, 10),
        categoryName: catData.name,
        categoryIcon: catData.icon,
        order: catData.order,
        items: Array.from(catData.items).sort(),
      }))
      .sort((a, b) => a.order - b.order)
      .map(({ order: _, ...rest }) => rest);
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