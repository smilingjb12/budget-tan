import { A as createServerRpc, y as createServerFn } from "../server.js";
import { R as RecordService, c as createOrUpdateRecordSchema } from "./record-service-BSDGGsDg.js";
import { a as authMiddleware } from "./auth-DKIui-sa.js";
import { o as objectType, n as numberType, s as stringType } from "./types-C7HdlGsq.js";
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
const monthSummarySchema = objectType({
  year: numberType().int().min(1900).max(3e3),
  month: numberType().int().min(1).max(12)
});
const getMonthSummary_createServerFn_handler = createServerRpc("8b245d1deb7b3177fc1442a8715758b127fefff6a05b6761b0568398cae874b1", (opts, signal) => {
  return getMonthSummary.__executeServer(opts, signal);
});
const getMonthSummary = createServerFn({
  method: "GET"
}).inputValidator(monthSummarySchema).middleware([authMiddleware]).handler(getMonthSummary_createServerFn_handler, async ({
  data: {
    year,
    month
  }
}) => {
  return await RecordService.getMonthSummary(year, month);
});
const getAllTimeSummary_createServerFn_handler = createServerRpc("1e9b83c58381421ed964efd769002837ea10c15f6a1dbf963f69c8bd123a035f", (opts, signal) => {
  return getAllTimeSummary.__executeServer(opts, signal);
});
const getAllTimeSummary = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getAllTimeSummary_createServerFn_handler, async () => {
  return await RecordService.getAllTimeSummary();
});
const getRecordsByMonth_createServerFn_handler = createServerRpc("dacda1687e55d3889ba0c6d071a73f70f667e1121642734dd5f144a3fce5136a", (opts, signal) => {
  return getRecordsByMonth.__executeServer(opts, signal);
});
const getRecordsByMonth = createServerFn({
  method: "GET"
}).inputValidator(monthSummarySchema).middleware([authMiddleware]).handler(getRecordsByMonth_createServerFn_handler, async ({
  data: {
    year,
    month
  }
}) => {
  return await RecordService.getRecordsByMonth(year, month);
});
const recordIdSchema = objectType({
  id: numberType().int().positive()
});
const getRecordById_createServerFn_handler = createServerRpc("bd62707f9efab268140150889acd48d865c57c6b0bc3281d34d98f664695b778", (opts, signal) => {
  return getRecordById.__executeServer(opts, signal);
});
const getRecordById = createServerFn({
  method: "GET"
}).inputValidator(recordIdSchema).middleware([authMiddleware]).handler(getRecordById_createServerFn_handler, async ({
  data: {
    id
  }
}) => {
  return await RecordService.getRecordById(id);
});
const createRecord_createServerFn_handler = createServerRpc("d33cd85c509e4640fdd6382524baad26375d1e1fe2609bb5840734128d1a1e8e", (opts, signal) => {
  return createRecord.__executeServer(opts, signal);
});
const createRecord = createServerFn({
  method: "POST"
}).inputValidator(createOrUpdateRecordSchema).middleware([authMiddleware]).handler(createRecord_createServerFn_handler, async ({
  data
}) => {
  return await RecordService.createRecord(data);
});
const updateRecord_createServerFn_handler = createServerRpc("a566b09bb6e13ccb55891c207c89fa9cc73314ccb8c1832a9f45e086468463c0", (opts, signal) => {
  return updateRecord.__executeServer(opts, signal);
});
const updateRecord = createServerFn({
  method: "POST"
}).inputValidator(createOrUpdateRecordSchema).middleware([authMiddleware]).handler(updateRecord_createServerFn_handler, async ({
  data
}) => {
  return await RecordService.updateRecord(data);
});
const deleteRecord_createServerFn_handler = createServerRpc("5dafb09dcbecd175379fca1488ed82f50b06e0913ff9aa4e948e4ce3d782f700", (opts, signal) => {
  return deleteRecord.__executeServer(opts, signal);
});
const deleteRecord = createServerFn({
  method: "POST"
}).inputValidator(recordIdSchema).middleware([authMiddleware]).handler(deleteRecord_createServerFn_handler, async ({
  data: {
    id
  }
}) => {
  return await RecordService.deleteRecord(id);
});
const searchCommentSchema = objectType({
  comment: stringType().min(1)
});
const searchRecordComments_createServerFn_handler = createServerRpc("e2f99c76b8006eac447de5404da4881540600038e134dd95e915df0817c64ebc", (opts, signal) => {
  return searchRecordComments.__executeServer(opts, signal);
});
const searchRecordComments = createServerFn({
  method: "GET"
}).inputValidator(searchCommentSchema).middleware([authMiddleware]).handler(searchRecordComments_createServerFn_handler, async ({
  data: {
    comment
  }
}) => {
  return await RecordService.searchRecordComments(comment);
});
const getExpensesVsIncome_createServerFn_handler = createServerRpc("3a794225f4beb5dc25e68994373a49cf5f356bc291a676f78c5104e129d2855b", (opts, signal) => {
  return getExpensesVsIncome.__executeServer(opts, signal);
});
const getExpensesVsIncome = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getExpensesVsIncome_createServerFn_handler, async () => {
  const result = await RecordService.getExpensesVsIncome();
  return result;
});
export {
  createRecord_createServerFn_handler,
  deleteRecord_createServerFn_handler,
  getAllTimeSummary_createServerFn_handler,
  getExpensesVsIncome_createServerFn_handler,
  getMonthSummary_createServerFn_handler,
  getRecordById_createServerFn_handler,
  getRecordsByMonth_createServerFn_handler,
  searchRecordComments_createServerFn_handler,
  updateRecord_createServerFn_handler
};
