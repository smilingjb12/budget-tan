export const APP_SEGMENT = "app";
export const CHARTS_SEGMENT = "charts";
export const SETTINGS_SEGMENT = "settings";
export const IMPORT_SEGMENT = "import";

export const ROUTE_PATTERNS = {
  app: `/${APP_SEGMENT}`,
  charts: `/${APP_SEGMENT}/${CHARTS_SEGMENT}`,
  settings: `/${APP_SEGMENT}/${SETTINGS_SEGMENT}`,
  import: `/${APP_SEGMENT}/${IMPORT_SEGMENT}`,
} as const;

export const RouteMatchers = {
  isHistoryRoute: (pathname: string): boolean => {
    // Matches /app/{year}/{month} where year and month are numbers
    const historyRoutePattern = new RegExp(`^/${APP_SEGMENT}/\\d{4}/\\d{1,2}$`);
    return historyRoutePattern.test(pathname);
  },
  isChartsRoute: (pathname: string): boolean => {
    return pathname === ROUTE_PATTERNS.charts;
  },
  isSettingsRoute: (pathname: string): boolean => {
    return pathname === ROUTE_PATTERNS.settings;
  },
} as const;

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const ApiRoutes = {
  monthlyExpensesSummary: (year: number, month: Month) =>
    `/api/records/calendar/${year}/${month}`,
  recordById: (id: number) => `/api/records/${id}`,
  records: () => `/api/records`,
  allRecordsByMonth: (year: number, month: Month) =>
    `/api/records/calendar/${year}/${month}/records`,
  categories: () => `/api/categories`,
  expenseCategories: () => `/api/categories/expense`,
  incomeCategories: () => `/api/categories/income`,
  allTimeSummary: () => `/api/records/summary`,
  expensesByCategory: (categoryId: number) =>
    `/api/charts/expenses-by-category/${categoryId}`,
  expensesVsIncome: () => `/api/charts/expenses-vs-income`,
  incomeTrends: () => `/api/charts/income-trends`,
  exchangeRate: () => `/api/exchange-rate`,
  recordComments: (comment: string) =>
    `/api/records/comments?comment=${encodeURIComponent(comment)}`,
  regularPayments: () => `/api/regular-payments`,
  importRecords: () => `/api/import`,
  clearRecords: () => `/api/records/clear`,
} as const;

export const Routes = {
  monthlyExpensesSummary: (year: number, month: Month) =>
    `/${APP_SEGMENT}/${year}/${month}`,
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
  },
} as const;