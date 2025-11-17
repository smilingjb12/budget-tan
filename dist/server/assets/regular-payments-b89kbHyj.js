import { A as createServerRpc, y as createServerFn } from "../server.js";
import { R as RegularPaymentService } from "./regular-payment-service-C1vIS-1Z.js";
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
const regularPaymentSchema = objectType({
  id: numberType().optional(),
  name: stringType().min(1),
  amount: numberType(),
  lastModified: stringType().optional()
});
const getRegularPayments_createServerFn_handler = createServerRpc("88a3a8aa5a3b330490d0d963a32ade7e23090abcf810cf96ca3e3899b1352362", (opts, signal) => {
  return getRegularPayments.__executeServer(opts, signal);
});
const getRegularPayments = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getRegularPayments_createServerFn_handler, async () => {
  return await RegularPaymentService.getRegularPayments();
});
const createRegularPayment_createServerFn_handler = createServerRpc("66aefdb769c4c6db9c14fb37bfd2e8706de532e6472ae8159f2cc0f791b08c1b", (opts, signal) => {
  return createRegularPayment.__executeServer(opts, signal);
});
const createRegularPayment = createServerFn({
  method: "POST"
}).inputValidator(regularPaymentSchema).middleware([authMiddleware]).handler(createRegularPayment_createServerFn_handler, async ({
  data: payment
}) => {
  return await RegularPaymentService.createRegularPayment(payment);
});
const updateRegularPayment_createServerFn_handler = createServerRpc("00adc43574abfd506a683b09094720676323340c5eaab11b4438ed4c76a048cd", (opts, signal) => {
  return updateRegularPayment.__executeServer(opts, signal);
});
const updateRegularPayment = createServerFn({
  method: "POST"
}).inputValidator(regularPaymentSchema).middleware([authMiddleware]).handler(updateRegularPayment_createServerFn_handler, async ({
  data: payment
}) => {
  return await RegularPaymentService.updateRegularPayment(payment);
});
const deleteRegularPayment_createServerFn_handler = createServerRpc("de1ade75204fba40ccaf628d455a200e6a0104753da9238112897d7a9207dd43", (opts, signal) => {
  return deleteRegularPayment.__executeServer(opts, signal);
});
const deleteRegularPayment = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: numberType()
})).middleware([authMiddleware]).handler(deleteRegularPayment_createServerFn_handler, async ({
  data
}) => {
  return await RegularPaymentService.deleteRegularPayment(data.id);
});
export {
  createRegularPayment_createServerFn_handler,
  deleteRegularPayment_createServerFn_handler,
  getRegularPayments_createServerFn_handler,
  updateRegularPayment_createServerFn_handler
};
