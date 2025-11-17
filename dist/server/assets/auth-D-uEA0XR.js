import { A as createServerRpc, y as createServerFn, z as redirect } from "../server.js";
import { a as auth } from "./auth-C4SSSEjI.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
const getCurrentUserId_createServerFn_handler = createServerRpc("02d4e0d369ee6e047078895e1e6707154ea1c61aa1eca6c7bbba7970cc9515cd", (opts, signal) => {
  return getCurrentUserId.__executeServer(opts, signal);
});
const getCurrentUserId = createServerFn({
  method: "GET"
}).handler(getCurrentUserId_createServerFn_handler, async () => {
  const {
    userId
  } = await auth();
  return {
    userId
  };
});
const requireAuth_createServerFn_handler = createServerRpc("3146bd6714827956aab3e0f942d30f69b428f9bd636354a233bbb5fcc7675467", (opts, signal) => {
  return requireAuth.__executeServer(opts, signal);
});
const requireAuth = createServerFn({
  method: "GET"
}).handler(requireAuth_createServerFn_handler, async () => {
  const {
    userId
  } = await auth();
  if (!userId) {
    throw redirect({
      to: "/sign-in"
    });
  }
  return {
    userId
  };
});
export {
  getCurrentUserId_createServerFn_handler,
  requireAuth_createServerFn_handler
};
