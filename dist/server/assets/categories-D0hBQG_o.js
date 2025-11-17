import { A as createServerRpc, y as createServerFn } from "../server.js";
import { C as CategoryService } from "./category-service-C0JJXc5T.js";
import { a as authMiddleware } from "./auth-DKIui-sa.js";
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
const getCategories_createServerFn_handler = createServerRpc("daf9d66291c04c68d1989c5630fa1f89dcb8b803954bc1d4599b4435736ff571", (opts, signal) => {
  return getCategories.__executeServer(opts, signal);
});
const getCategories = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getCategories_createServerFn_handler, async () => {
  return await CategoryService.getCategories();
});
const getExpenseCategories_createServerFn_handler = createServerRpc("9230c7098a1554de5c3f08f11ef966dfbeae398dcd2f44007266c5876ac5a781", (opts, signal) => {
  return getExpenseCategories.__executeServer(opts, signal);
});
const getExpenseCategories = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getExpenseCategories_createServerFn_handler, async () => {
  return await CategoryService.getExpenseCategories();
});
const getIncomeCategories_createServerFn_handler = createServerRpc("ac42c97681fd92b6236a38f20e7c127f10e883aa26809576cf1741ca1bb6d47f", (opts, signal) => {
  return getIncomeCategories.__executeServer(opts, signal);
});
const getIncomeCategories = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getIncomeCategories_createServerFn_handler, async () => {
  return await CategoryService.getIncomeCategories();
});
export {
  getCategories_createServerFn_handler,
  getExpenseCategories_createServerFn_handler,
  getIncomeCategories_createServerFn_handler
};
