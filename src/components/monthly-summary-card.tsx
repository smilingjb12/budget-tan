import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useMonthNavigation } from "~/lib/hooks/use-month-navigation";
import { useMonthSummaryQuery, useCategoriesQuery } from "~/lib/queries";
import { Month, Routes } from "~/lib/routes";
import { formatEUR } from "~/lib/utils";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useParams } from "@tanstack/react-router";
import { CategoryProgressSection } from "./category-progress-section";
import { CategoryRecords } from "./category-records";
import { ViewType } from "./monthly-header";
import LoadingIndicator from "./loading-indicator";
import { useIsInkTheme } from "~/lib/hooks/use-app-theme";

export function MonthlySummaryCard({ viewType }: { viewType: ViewType }) {
  const params = useParams({ from: '/app/$year/$month' });
  const month = Number(params.month) as Month;
  const year = Number(params.year);
  const router = useRouter();
  const isInk = useIsInkTheme();

  const { prevMonth, prevYear, nextMonth, nextYear } = useMonthNavigation(
    month,
    year
  );

  // Check if next month is in the future
  const currentDate = new Date();
  const nextMonthDate = new Date(nextYear, nextMonth - 1);
  const currentMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const isNextMonthInFuture = nextMonthDate > currentMonthDate;

  const date = new Date(year, month - 1); // Adjust for 0-indexed months in JS
  const monthName = format(date, "MMMM");
  const yearString = format(date, "yyyy");

  // Fetch data for both expenses and income
  const { data, error, isLoading } = useMonthSummaryQuery(year, month);

  // Fetch previous month data
  const { data: prevMonthData } = useMonthSummaryQuery(prevYear, prevMonth);

  // Fetch category data
  const { data: categories } = useCategoriesQuery();

  const handlePreviousMonth = () => {
    router.navigate({ 
      to: Routes.monthlyExpensesSummary(prevYear, prevMonth)
    });
  };

  const handleNextMonth = () => {
    router.navigate({ 
      to: Routes.monthlyExpensesSummary(nextYear, nextMonth)
    });
  };

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Error loading data: {error.message}
      </div>
    );
  }

  // Filter categories based on the selected view type
  const filteredCategories =
    data?.categorySummaries?.filter(
      (category) =>
        (viewType === "expenses" && category.isExpense) ||
        (viewType === "income" && !category.isExpense)
    ) || [];

  // Create a map of previous month expenses by category name
  const prevMonthExpensesByCategory = new Map<string, number>();
  prevMonthData?.categorySummaries?.forEach((category) => {
    if (
      (viewType === "expenses" && category.isExpense) ||
      (viewType === "income" && !category.isExpense)
    ) {
      prevMonthExpensesByCategory.set(
        category.categoryName,
        Number(category.total)
      );
    }
  });

  // Enhance current month data with previous month comparison
  const enhancedCategories = filteredCategories.map((category) => {
    const previousMonthExpenses =
      prevMonthExpensesByCategory.get(category.categoryName) || 0;
    const difference = Number(category.total) - previousMonthExpenses;

    return {
      ...category,
      previousMonthExpenses,
      difference,
      totalValue: Number(category.total),
    };
  });

  // Calculate total spending or income for all categories
  const totalMonthlyAmount =
    enhancedCategories.reduce(
      (sum, category) => sum + Number(category.total),
      0
    ) || 0;

  // Calculate total for previous month
  const totalPreviousMonthAmount =
    prevMonthData?.categorySummaries
      ?.filter(
        (category) =>
          (viewType === "expenses" && category.isExpense) ||
          (viewType === "income" && !category.isExpense)
      )
      .reduce((sum, category) => sum + Number(category.total), 0) || 0;

  // Calculate the difference between current and previous month totals
  const totalMonthDifference = totalMonthlyAmount - totalPreviousMonthAmount;

  // Sort categories by value for better visualization
  const sortedCategories = [...enhancedCategories].sort(
    (a, b) => b.total - a.total
  );

  // Ensure we have valid data for the progress bar
  const hasValidData = totalMonthlyAmount > 0 && sortedCategories.length > 0;

  // Helper function to format the difference
  const formatDifference = (
    difference: number | undefined,
    previousMonthExpenses: number | undefined
  ) => {
    // Only show difference if there were expenses in the previous month
    if (
      difference === undefined ||
      previousMonthExpenses === undefined ||
      previousMonthExpenses === 0
    ) {
      return null;
    }

    const isMore = difference > 0;
    const absValue = Math.abs(difference);

    return {
      text: `€${absValue.toFixed(2)}`,
      icon: isMore ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : (
        <ArrowDown className="h-3.5 w-3.5" />
      ),
      color: isMore ? "text-expense" : "text-income",
    };
  };

  const monthDiff = formatDifference(
    totalMonthDifference,
    totalPreviousMonthAmount
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-3 pt-3 pb-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <CardTitle className="flex flex-col items-center justify-center gap-1.5">
          <span className="flex items-center gap-2.5">
            <span className="figures text-3xl font-semibold tracking-tight">
              {formatEUR(totalMonthlyAmount)}
            </span>
            {isInk && (
              <span aria-hidden="true" className="hanko h-9 w-9 text-[13px]">
                {viewType === "expenses" ? "支出" : "収入"}
              </span>
            )}
          </span>
          {monthDiff ? (
            <span
              className={`figures inline-flex items-center gap-0.5 text-xs ${monthDiff.color}`}
            >
              {monthDiff.text}
              {monthDiff.icon}
            </span>
          ) : (
            <span className="figures invisible inline-flex items-center gap-0.5 text-xs">
              €0.00
              <ArrowDown className="h-3.5 w-3.5" />
            </span>
          )}
        </CardTitle>
        {!isNextMonthInFuture ? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10 h-10"></div> // Empty div to maintain layout
        )}
      </CardHeader>
      <CardContent className="px-3 pb-3">
        {isLoading ? (
          <div className="py-10">
            <LoadingIndicator className="h-12" />
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Loading {viewType} for {monthName} {yearString}…
            </p>
          </div>
        ) : (
          <>
            {hasValidData && (
              <CategoryProgressSection
                sortedCategories={sortedCategories}
                totalMonthlyAmount={totalMonthlyAmount}
              />
            )}

            {filteredCategories.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No {viewType} logged for {monthName} {yearString}.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-0.5">
                {sortedCategories.map((category) => {
                  const diff = formatDifference(
                    category.difference,
                    category.previousMonthExpenses
                  );

                  const categoryData = categories?.find(
                    (c) => c.name === category.categoryName
                  );

                  return (
                    <CategoryRecords
                      key={category.categoryName}
                      categoryName={category.categoryName}
                      categoryId={categoryData?.id || 0}
                      year={year}
                      month={month}
                      totalExpenses={Number(category.total)}
                      icon={category.icon}
                      difference={diff || undefined}
                      isExpense={category.isExpense}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
