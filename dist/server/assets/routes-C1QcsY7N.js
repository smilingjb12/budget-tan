const APP_SEGMENT = "app";
const CHARTS_SEGMENT = "charts";
const SETTINGS_SEGMENT = "settings";
const IMPORT_SEGMENT = "import";
const ROUTE_PATTERNS = {
  charts: `/${APP_SEGMENT}/${CHARTS_SEGMENT}`,
  settings: `/${APP_SEGMENT}/${SETTINGS_SEGMENT}`
};
const RouteMatchers = {
  isHistoryRoute: (pathname) => {
    const historyRoutePattern = new RegExp(`^/${APP_SEGMENT}/\\d{4}/\\d{1,2}$`);
    return historyRoutePattern.test(pathname);
  },
  isChartsRoute: (pathname) => {
    return pathname === ROUTE_PATTERNS.charts;
  },
  isSettingsRoute: (pathname) => {
    return pathname === ROUTE_PATTERNS.settings;
  }
};
const Routes = {
  monthlyExpensesSummary: (year, month) => `/${APP_SEGMENT}/${year}/${month}`,
  signIn() {
    return "/sign-in";
  },
  charts() {
    return `/${APP_SEGMENT}/${CHARTS_SEGMENT}`;
  },
  settings() {
    return `/${APP_SEGMENT}/${SETTINGS_SEGMENT}`;
  },
  import() {
    return `/${APP_SEGMENT}/${IMPORT_SEGMENT}`;
  }
};
export {
  RouteMatchers as R,
  Routes as a
};
