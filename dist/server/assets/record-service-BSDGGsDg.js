import { d as db, r as records, s as sql, i as ilike, e as eq, b as desc, c as categories } from "./auth-DKIui-sa.js";
import { o as objectType, b as booleanType, s as stringType, n as numberType } from "./types-C7HdlGsq.js";
const createOrUpdateRecordSchema = objectType({
  id: numberType().optional(),
  categoryId: numberType(),
  value: numberType(),
  comment: stringType().optional(),
  dateUtc: stringType(),
  // ISO string in UTC format
  isExpense: booleanType().default(true)
});
const RecordService = {
  async getMonthSummary(year, month) {
    const categorySummaries = await db.select({
      categoryName: categories.name,
      total: sql`SUM(${records.value})`,
      icon: categories.icon,
      isExpense: records.isExpense
    }).from(records).innerJoin(categories, sql`${records.categoryId} = ${categories.id}`).where(
      sql`EXTRACT(YEAR FROM ${records.date}) = ${year} AND EXTRACT(MONTH FROM ${records.date}) = ${month}`
    ).groupBy(categories.name, categories.icon, records.isExpense).orderBy(sql`SUM(${records.value}) DESC`);
    return {
      categorySummaries
    };
  },
  async getAllTimeSummary() {
    const [{ totalExpenses = 0 } = {}] = await db.select({
      totalExpenses: sql`SUM(${records.value})`
    }).from(records).where(sql`${records.isExpense} = true`);
    const [{ totalProfit = 0 } = {}] = await db.select({
      totalProfit: sql`SUM(${records.value})`
    }).from(records).where(sql`${records.isExpense} = false`);
    return {
      totalExpenses,
      totalProfit
    };
  },
  async getRecordById(id) {
    const result = await db.select({
      id: records.id,
      categoryId: records.categoryId,
      value: records.value,
      comment: records.comment,
      date: records.date,
      isExpense: records.isExpense
    }).from(records).where(eq(records.id, id)).limit(1);
    if (result.length === 0) {
      return null;
    }
    const record = result[0];
    return {
      id: record.id,
      categoryId: record.categoryId,
      value: parseFloat(record.value),
      comment: record.comment,
      dateUtc: record.date.toISOString(),
      isExpense: record.isExpense
    };
  },
  async getRecordsByMonth(year, month) {
    const result = await db.select({
      id: records.id,
      categoryId: records.categoryId,
      value: records.value,
      comment: records.comment,
      date: records.date,
      isExpense: records.isExpense
    }).from(records).where(
      sql`EXTRACT(YEAR FROM ${records.date}) = ${year} AND EXTRACT(MONTH FROM ${records.date}) = ${month}`
    ).orderBy(desc(records.date));
    return result.map((record) => ({
      id: record.id,
      categoryId: record.categoryId,
      value: parseFloat(record.value),
      comment: record.comment,
      dateUtc: record.date.toISOString(),
      isExpense: record.isExpense
    }));
  },
  async createRecord(request) {
    const date = new Date(request.dateUtc);
    const row = {
      categoryId: request.categoryId,
      date,
      value: String(request.value),
      comment: request.comment?.trim() || null,
      isExpense: request.isExpense
    };
    return await db.insert(records).values(row);
  },
  async updateRecord(request) {
    if (!request.id) {
      throw new Error("Record ID is required for update");
    }
    const row = {
      categoryId: request.categoryId,
      value: String(request.value),
      comment: request.comment?.trim() || null
    };
    return await db.update(records).set(row).where(eq(records.id, request.id));
  },
  async deleteRecord(id) {
    return await db.delete(records).where(eq(records.id, id));
  },
  async searchRecordComments(comment) {
    const result = await db.select({
      comment: records.comment
    }).from(records).where(ilike(records.comment, `%${comment}%`)).orderBy(records.comment);
    const uniqueComments = [
      ...new Set(
        result.map((record) => record.comment).filter((comment2) => comment2 !== null)
      )
    ];
    return uniqueComments;
  },
  async getExpensesVsIncome() {
    const result = await db.select({
      year: sql`EXTRACT(YEAR FROM ${records.date})`,
      month: sql`EXTRACT(MONTH FROM ${records.date})`,
      totalIncome: sql`SUM(CASE WHEN ${records.isExpense} = false THEN ${records.value} ELSE 0 END)`,
      totalExpenses: sql`SUM(CASE WHEN ${records.isExpense} = true THEN ${records.value} ELSE 0 END)`
    }).from(records).groupBy(sql`EXTRACT(YEAR FROM ${records.date}), EXTRACT(MONTH FROM ${records.date})`).orderBy(sql`EXTRACT(YEAR FROM ${records.date}) DESC, EXTRACT(MONTH FROM ${records.date}) DESC`);
    const monthlyData = result.map((row) => ({
      year: row.year,
      month: row.month,
      totalIncome: row.totalIncome || 0,
      totalExpenses: row.totalExpenses || 0
    }));
    return {
      monthlyData
    };
  }
};
export {
  RecordService as R,
  createOrUpdateRecordSchema as c
};
