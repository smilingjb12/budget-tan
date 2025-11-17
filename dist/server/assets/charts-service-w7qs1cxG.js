import { d as db, c as categories, r as records, s as sql, e as eq } from "./auth-DKIui-sa.js";
const ChartsService = {
  async getMonthlyTotalsByCategory(categoryId) {
    const result = await db.select({
      year: sql`EXTRACT(YEAR FROM ${records.date})`,
      month: sql`EXTRACT(MONTH FROM ${records.date})`,
      total: sql`SUM(${records.value})`
    }).from(records).where(sql`${records.categoryId} = ${categoryId}`).groupBy(
      sql`EXTRACT(YEAR FROM ${records.date})`,
      sql`EXTRACT(MONTH FROM ${records.date})`
    ).orderBy(
      sql`EXTRACT(YEAR FROM ${records.date})`,
      sql`EXTRACT(MONTH FROM ${records.date})`
    );
    return result.map((item) => ({
      monthDate: `${item.year}-${item.month.toString().padStart(2, "0")}`,
      total: parseFloat(String(item.total))
    }));
  },
  async getMonthlyExpensesVsIncome() {
    const result = await db.select({
      year: sql`EXTRACT(YEAR FROM ${records.date})`,
      month: sql`EXTRACT(MONTH FROM ${records.date})`,
      isExpense: records.isExpense,
      total: sql`SUM(${records.value})`
    }).from(records).groupBy(
      sql`EXTRACT(YEAR FROM ${records.date})`,
      sql`EXTRACT(MONTH FROM ${records.date})`,
      records.isExpense
    ).orderBy(
      sql`EXTRACT(YEAR FROM ${records.date})`,
      sql`EXTRACT(MONTH FROM ${records.date})`
    );
    const monthlyData = {};
    result.forEach((item) => {
      const monthDate = `${item.year}-${item.month.toString().padStart(2, "0")}`;
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
      income: data.income
    }));
  },
  async getMonthlyIncomeByCategories() {
    const result = await db.select({
      year: sql`EXTRACT(YEAR FROM ${records.date})`,
      month: sql`EXTRACT(MONTH FROM ${records.date})`,
      categoryId: records.categoryId,
      categoryName: categories.name,
      total: sql`SUM(${records.value})`
    }).from(records).innerJoin(categories, eq(records.categoryId, categories.id)).where(eq(records.isExpense, false)).groupBy(
      sql`EXTRACT(YEAR FROM ${records.date})`,
      sql`EXTRACT(MONTH FROM ${records.date})`,
      records.categoryId,
      categories.name
    ).orderBy(
      sql`EXTRACT(YEAR FROM ${records.date})`,
      sql`EXTRACT(MONTH FROM ${records.date})`,
      records.categoryId
    );
    return result.map((item) => ({
      monthDate: `${item.year}-${item.month.toString().padStart(2, "0")}`,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      total: parseFloat(String(item.total))
    }));
  }
};
export {
  ChartsService as C
};
