import { A as createServerRpc, y as createServerFn } from "../server.js";
import { E as ExchangeRateService } from "./exchange-rate-service-CkHVYlz5.js";
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
const getExchangeRate_createServerFn_handler = createServerRpc("1b27b29c1a5cc7b8dad525f626675e256cd143e020b1c7c275c253aed33f18ce", (opts, signal) => {
  return getExchangeRate.__executeServer(opts, signal);
});
const getExchangeRate = createServerFn({
  method: "GET"
}).middleware([authMiddleware]).handler(getExchangeRate_createServerFn_handler, async () => {
  return await ExchangeRateService.getExchangeRate();
});
export {
  getExchangeRate_createServerFn_handler
};
