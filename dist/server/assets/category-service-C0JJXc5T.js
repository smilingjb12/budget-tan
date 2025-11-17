import { d as db, c as categories, e as eq } from "./auth-DKIui-sa.js";
const CategoryService = {
  async getCategories() {
    const result = await db.select({
      id: categories.id,
      name: categories.name,
      icon: categories.icon,
      isExpense: categories.isExpense
    }).from(categories).orderBy(categories.order);
    return result;
  },
  async getExpenseCategories() {
    const result = await db.select({
      id: categories.id,
      name: categories.name,
      icon: categories.icon,
      isExpense: categories.isExpense
    }).from(categories).where(eq(categories.isExpense, true)).orderBy(categories.order);
    return result;
  },
  async getIncomeCategories() {
    const result = await db.select({
      id: categories.id,
      name: categories.name,
      icon: categories.icon,
      isExpense: categories.isExpense
    }).from(categories).where(eq(categories.isExpense, false)).orderBy(categories.order);
    return result;
  }
};
export {
  CategoryService as C
};
