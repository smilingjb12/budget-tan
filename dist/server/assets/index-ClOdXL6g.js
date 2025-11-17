import { d as useNavigate } from "./router-BgvrDMcr.js";
import { a as reactExports } from "../server.js";
import "./auth-C4SSSEjI.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
function Home() {
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    navigate({
      to: `/app/${year}/${month}`
    });
  }, [navigate]);
  return null;
}
export {
  Home as component
};
