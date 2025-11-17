import { A as createServerRpc, y as createServerFn } from "../server.js";
import { C as ChartsService } from "./charts-service-w7qs1cxG.js";
import { a as authMiddleware } from "./auth-DKIui-sa.js";
import { o as objectType, n as numberType } from "./types-C7HdlGsq.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
import "events";
import "dns";
import "fs";
import "net";
import "tls";
import "path";
import "string_decoder";
import "./auth-C4SSSEjI.js";
const categoryIdSchema = objectType({
  categoryId: numberType().int().positive()
});
const getCategoryExpenses_createServerFn_handler = createServerRpc("0215b54d77610f98336026916980dd3b16f3fbe3b257328a14b54c6289766400", (opts, signal) => {
  return getCategoryExpenses.__executeServer(opts, signal);
});
const getCategoryExpenses = createServerFn({
  method: "GET"
}).inputValidator(categoryIdSchema).middleware([authMiddleware]).handler(getCategoryExpenses_createServerFn_handler, async ({
  data: {
    categoryId
  }
}) => {
  return await ChartsService.getMonthlyTotalsByCategory(categoryId);
});
const getMonthlyExpensesVsIncome_createServerFn_handler = createServerRpc("2347789889ec06728e3ef8046b5dfd461da523cbea8dde90f06e4ee1aad47f48", (opts, signal) => {
  return getMonthlyExpensesVsIncome.__executeServer(opts, signal);
});
const getMonthlyExpensesVsIncome = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getMonthlyExpensesVsIncome_createServerFn_handler, async () => {
  return await ChartsService.getMonthlyExpensesVsIncome();
});
const getIncomeTrends_createServerFn_handler = createServerRpc("760988999cce308f9007ff1a6aff1aac1a36de638498a28773dccb55218464c9", (opts, signal) => {
  return getIncomeTrends.__executeServer(opts, signal);
});
const getIncomeTrends = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getIncomeTrends_createServerFn_handler, async () => {
  return await ChartsService.getMonthlyIncomeByCategories();
});
export {
  getCategoryExpenses_createServerFn_handler,
  getIncomeTrends_createServerFn_handler,
  getMonthlyExpensesVsIncome_createServerFn_handler
};
