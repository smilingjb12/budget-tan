import { CategoryDto } from "~/services/category-service";
import {
  AllTimeSummaryDto,
  MonthSummaryDto,
  RecordDto,
  CreateOrUpdateRecordRequest,
  ExpensesVsIncomeDto,
} from "~/services/record-service";
import { Month } from "~/lib/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "./query-keys";
import { 
  getCategories, 
  getExpenseCategories, 
  getIncomeCategories 
} from "~/server/categories";
import { 
  getMonthSummary, 
  getAllTimeSummary, 
  getRecordsByMonth,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  searchRecordComments,
  getExpensesVsIncome
} from "~/server/records";
import { getExchangeRate } from "~/server/exchange-rate";
import { getRegularPayments, saveRegularPayments, RegularPaymentDto } from "~/server/regular-payments";
import { getCategoryExpenses, getMonthlyExpensesVsIncome, getIncomeTrends } from "~/server/charts";
import { MonthlyTotalsDto, MonthlyExpensesVsIncomeDto, IncomeTrendsDto } from "~/services/charts-service";

// Re-export types
export type { RegularPaymentDto } from "~/server/regular-payments";
export type { MonthlyTotalsDto, MonthlyExpensesVsIncomeDto, IncomeTrendsDto } from "~/services/charts-service";

// Categories queries
export function useCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.categories(),
    queryFn: async () => {
      try {
        const response = await getCategories({});
        console.log('Categories response:', response);
        return response || [];
      } catch (error) {
        console.error('Categories query error:', error);
        return [];
      }
    },
  });
}

export function useExpenseCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.expenseCategories(),
    queryFn: async () => {
      try {
        const response = await getExpenseCategories({});
        return response || [];
      } catch (error) {
        console.error('Expense categories query error:', error);
        return [];
      }
    },
  });
}

export function useIncomeCategoriesQuery() {
  return useQuery({
    queryKey: QueryKeys.incomeCategories(),
    queryFn: async () => {
      try {
        const response = await getIncomeCategories({});
        return response || [];
      } catch (error) {
        console.error('Income categories query error:', error);
        return [];
      }
    },
  });
}

// Month summary query
export function useMonthSummaryQuery(year: number, month: Month) {
  return useQuery<MonthSummaryDto>({
    queryKey: QueryKeys.monthSummary(year, month),
    queryFn: async () => {
      try {
        const response = await getMonthSummary({ data: { year, month } });
        console.log('Month summary response:', response, 'for', year, month);
        return response || { categorySummaries: [] };
      } catch (error) {
        console.error('Month summary query error:', error);
        return { categorySummaries: [] };
      }
    },
  });
}

// Month records query
export function useMonthRecordsQuery(
  year: number,
  month: Month,
  enabled: boolean = true
) {
  return useQuery<RecordDto[]>({
    queryKey: QueryKeys.monthRecords(year, month),
    queryFn: async () => {
      try {
        const response = await getRecordsByMonth({ data: { year, month } });
        console.log('Month records response:', response, 'for', year, month);
        return response || [];
      } catch (error) {
        console.error('Month records query error:', error);
        return [];
      }
    },
    enabled,
  });
}

// All time summary query
export function useAllTimeSummaryQuery() {
  return useQuery({
    queryKey: QueryKeys.allTimeSummary(),
    queryFn: async () => {
      try {
        const response = await getAllTimeSummary({});
        console.log('All time summary response:', response);
        return response || { totalExpenses: 0, totalProfit: 0 };
      } catch (error) {
        console.error('All time summary query error:', error);
        return { totalExpenses: 0, totalProfit: 0 };
      }
    },
  });
}

// Record queries
export function useRecordQuery(
  id: number | undefined,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: id ? QueryKeys.record(id) : ["record"],
    queryFn: async () => {
      if (!id) {
        throw new Error("Record ID is required");
      }

      try {
        const response = await getRecordById({ data: { id } });
        console.log('Record response:', response, 'for ID:', id);
        return response || null;
      } catch (error) {
        console.error('Record query error:', error, 'for ID:', id);
        return null;
      }
    },
    enabled,
  });
}

export function useRecordCommentsQuery(comment: string) {
  return useQuery({
    queryKey: QueryKeys.recordComments(comment),
    queryFn: async () => {
      if (!comment.trim()) {
        return [] as string[];
      }

      try {
        const response = await searchRecordComments({ data: { comment } });
        console.log('Record comments response:', response, 'for comment:', comment);
        return response || [];
      } catch (error) {
        console.error('Record comments query error:', error, 'for comment:', comment);
        return [];
      }
    },
    enabled: comment.trim().length > 0,
  });
}

// Record mutations
export function useCreateRecordMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateOrUpdateRecordRequest) => {
      try {
        console.log('Creating record:', data);
        const response = await createRecord({ data });
        console.log('Create record response:', response);
        return response;
      } catch (error) {
        console.error('Create record mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.allTimeSummary() });
    },
  });
}

export function useUpdateRecordMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateOrUpdateRecordRequest) => {
      try {
        console.log('Updating record:', data);
        const response = await updateRecord({ data });
        console.log('Update record response:', response);
        return response;
      } catch (error) {
        console.error('Update record mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.allTimeSummary() });
    },
  });
}

export function useDeleteRecordMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      try {
        console.log('Deleting record:', id);
        const response = await deleteRecord({ data: { id } });
        console.log('Delete record response:', response);
        return response;
      } catch (error) {
        console.error('Delete record mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.allTimeSummary() });
    },
  });
}

// Exchange rate query
export function useExchangeRateQuery() {
  return useQuery({
    queryKey: QueryKeys.exchangeRate(),
    queryFn: async () => {
      try {
        const response = await getExchangeRate({});
        console.log('Exchange rate response:', response);
        return response || { rate: 4.0, lastUpdatedAt: new Date().toISOString() };
      } catch (error) {
        console.error('Exchange rate query error:', error);
        return { rate: 4.0, lastUpdatedAt: new Date().toISOString() };
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchInterval: 1000 * 60 * 60, // 1 hour
  });
}

// Expenses vs income query
export function useExpensesVsIncomeQuery() {
  return useQuery<ExpensesVsIncomeDto>({
    queryKey: QueryKeys.expensesVsIncome(),
    queryFn: async () => {
      try {
        const response = await getExpensesVsIncome({});
        console.log('Expenses vs income response:', response);
        return response || { monthlyData: [] };
      } catch (error) {
        console.error('Expenses vs income query error:', error);
        return { monthlyData: [] };
      }
    },
  });
}

// Regular payments queries
export function useRegularPaymentsQuery() {
  return useQuery<RegularPaymentDto[]>({
    queryKey: QueryKeys.regularPayments(),
    queryFn: async () => {
      try {
        const response = await getRegularPayments({});
        console.log('Regular payments response:', response);
        return response || [];
      } catch (error) {
        console.error('Regular payments query error:', error);
        return [];
      }
    },
  });
}

export function useUpdateRegularPaymentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payments: RegularPaymentDto[]) => {
      try {
        console.log('Updating regular payments:', payments);
        const response = await saveRegularPayments({ data: payments });
        console.log('Update regular payments response:', response);
        return response;
      } catch (error) {
        console.error('Update regular payments mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate regular payments query
      queryClient.invalidateQueries({ queryKey: QueryKeys.regularPayments() });
    },
  });
}

// Chart queries
export function useCategoryExpensesQuery(categoryId: number) {
  return useQuery<MonthlyTotalsDto[]>({
    queryKey: ["category-expenses", categoryId],
    queryFn: async () => {
      try {
        const response = await getCategoryExpenses({ data: { categoryId } });
        console.log('Category expenses response:', response);
        // TanStack Start server functions wrap response in { result: data }
        return (response as any)?.result || response || [];
      } catch (error) {
        console.error('Category expenses query error:', error);
        return [];
      }
    },
    enabled: categoryId > 0,
  });
}

export function useMonthlyExpensesVsIncomeQuery() {
  return useQuery<MonthlyExpensesVsIncomeDto[]>({
    queryKey: ["monthly-expenses-vs-income"],
    queryFn: async () => {
      try {
        const response = await getMonthlyExpensesVsIncome({});
        console.log('Monthly expenses vs income response:', response);
        // TanStack Start server functions wrap response in { result: data }
        return (response as any)?.result || response || [];
      } catch (error) {
        console.error('Monthly expenses vs income query error:', error);
        return [];
      }
    },
  });
}

export function useIncomeTrendsQuery() {
  return useQuery<IncomeTrendsDto[]>({
    queryKey: ["income-trends"],
    queryFn: async () => {
      try {
        const response = await getIncomeTrends({});
        console.log('Income trends response:', response);
        // TanStack Start server functions wrap response in { result: data }
        return (response as any)?.result || response || [];
      } catch (error) {
        console.error('Income trends query error:', error);
        return [];
      }
    },
  });
}