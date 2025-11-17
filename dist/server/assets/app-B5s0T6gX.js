import { o as jsxRuntimeExports, O as Outlet, b as useRouter } from "../server.js";
import { c as useLocation } from "./router-BgvrDMcr.js";
import { c as cn } from "./utils-yaVLMgP5.js";
import { R as RouteMatchers, a as Routes } from "./routes-C1QcsY7N.js";
import { c as createLucideIcon } from "./createLucideIcon-BH4JToHI.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
import "./auth-C4SSSEjI.js";
import "./clsx-DgYk2OaC.js";
const __iconNode$2 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "m19 9-5 5-4-4-3 3", key: "2osh9i" }]
];
const ChartLine = createLucideIcon("chart-line", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode$1);
const __iconNode = [
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["path", { d: "M19 7h-9", key: "6i9tg" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode);
function BottomNavItem({
  icon,
  label,
  isActive,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: cn("flex flex-1 flex-col items-center justify-center py-2", isActive ? "text-primary" : "text-muted-foreground hover:text-primary"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: label })
  ] });
}
function MobileBottomNav() {
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname;
  const isHistory = RouteMatchers.isHistoryRoute(pathname);
  const isCharts = RouteMatchers.isChartsRoute(pathname);
  const isSettings = RouteMatchers.isSettingsRoute(pathname);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 border-t bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex h-16 items-center justify-around px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNavItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 24 }), label: "History", isActive: isHistory, onClick: () => {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      router.navigate({
        to: Routes.monthlyExpensesSummary(year, month)
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNavItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartLine, { size: 24 }), label: "Charts", isActive: isCharts, onClick: () => router.navigate({
      to: Routes.charts()
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNavItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { size: 24 }), label: "Settings", isActive: isSettings, onClick: () => router.navigate({
      to: Routes.settings()
    }) })
  ] }) });
}
function AppLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-16 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6 pb-12 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileBottomNav, {})
  ] });
}
export {
  AppLayout as component
};
