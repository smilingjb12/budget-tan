export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const QueryKeys = {
  categories: () => ["categories"] as const,
  expenseCategories: () => ["expense-categories"] as const,
  incomeCategories: () => ["income-categories"] as const,
  monthSummary: (year: number, month: Month) => ["month-summary", year, month] as const,
  monthRecords: (year: number, month: Month) => ["month-records", year, month] as const,
  allTimeSummary: () => ["all-time-summary"] as const,
  record: (id: number) => ["record", id] as const,
  recordComments: (comment: string) => ["record-comments", comment] as const,
  regularPayments: () => ["regular-payments"] as const,
  exchangeRate: () => ["exchange-rate"] as const,
  expensesVsIncome: () => ["expenses-vs-income"] as const,
} as const;