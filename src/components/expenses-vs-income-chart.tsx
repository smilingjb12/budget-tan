"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useMonthlyExpensesVsIncomeQuery, MonthlyExpensesVsIncomeDto } from "~/lib/queries";
import { formatCurrency } from "~/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ExpenseIncomeDataPoint {
  name: string;
  yearMonth: string;
  year: string;
  expenses: number;
  income: number;
  difference: number;
  isFirstMonthOfYear: boolean;
  absoluteDifference: number;
}

// Transform monthly data for chart display
function transformMonthlyExpensesVsIncomeForChart(data: MonthlyExpensesVsIncomeDto[]) {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  return data.map((item) => {
    const [year, month] = item.monthDate.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];
    
    return {
      name: monthName,
      yearMonth: item.monthDate,
      year,
      expenses: item.expenses,
      income: item.income,
      difference: item.income - item.expenses,
      isFirstMonthOfYear: month === '01',
      absoluteDifference: Math.abs(item.income - item.expenses),
    };
  });
}

export function ExpensesVsIncomeChart() {
  const { data: rawExpensesVsIncome, isLoading } = useMonthlyExpensesVsIncomeQuery();
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);

  // Add difference calculation to the data
  const expensesVsIncome = rawExpensesVsIncome && Array.isArray(rawExpensesVsIncome) ? transformMonthlyExpensesVsIncomeForChart(rawExpensesVsIncome) : [];

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [, setVisibleData] = useState<typeof expensesVsIncome>([]);
  const [, setVisibleRange] = useState({ start: 0, end: 0 });
  const [, setCurrentYear] = useState<string | null>(null);

  // Calculate minimum width based on number of data points
  const minChartWidth = expensesVsIncome?.length
    ? Math.max(expensesVsIncome.length * 60, 300)
    : 300;

  // Calculate visible bars based on scroll position
  const updateVisibleData = useCallback(() => {
    if (!chartContainerRef.current || !expensesVsIncome?.length) return;

    const container = chartContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const totalWidth = container.scrollWidth;

    // Calculate approximate visible range
    const barWidth = totalWidth / expensesVsIncome.length;
    const startIndex = Math.max(0, Math.floor(scrollLeft / barWidth));
    const visibleCount = Math.ceil(containerWidth / barWidth);
    const endIndex = Math.min(
      expensesVsIncome.length - 1,
      startIndex + visibleCount
    );

    // Update visible range
    setVisibleRange({ start: startIndex, end: endIndex });

    // Update visible data
    const newVisibleData = expensesVsIncome.slice(startIndex, endIndex + 1);
    setVisibleData(newVisibleData);

    // Update current year (use the middle item's year for context)
    if (newVisibleData.length > 0) {
      const middleIndex = Math.floor(newVisibleData.length / 2);
      setCurrentYear(newVisibleData[middleIndex]?.year || null);
    }
  }, [expensesVsIncome]);

  // Scroll to the right (most recent data) only on initial load
  useEffect(() => {
    if (
      chartContainerRef.current &&
      expensesVsIncome?.length &&
      !isLoading &&
      !hasInitiallyScrolled
    ) {
      // Small delay to ensure the chart is rendered
      setTimeout(() => {
        if (chartContainerRef.current) {
          chartContainerRef.current.scrollLeft =
            chartContainerRef.current.scrollWidth;
          updateVisibleData();
          setHasInitiallyScrolled(true);
        }
      }, 100);
    }
  }, [expensesVsIncome, isLoading, updateVisibleData, hasInitiallyScrolled]);

  // Update visible data when scrolling
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateVisibleData();
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [expensesVsIncome, updateVisibleData]);

  // Get year dividers for the chart
  const getYearDividers = () => {
    if (!expensesVsIncome?.length) return [];

    // Find indices where the year changes
    return expensesVsIncome
      .filter((item) => item.isFirstMonthOfYear)
      .map((item) => ({
        yearMonth: item.yearMonth,
        year: item.year,
      }));
  };

  const yearDividers = getYearDividers();

  // Custom tooltip to show the difference and its components
  const CustomTooltip = (props: { active?: boolean; payload?: Array<{ payload: ExpenseIncomeDataPoint }>; label?: string }) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length > 0) {
      const dataPoint = payload[0].payload as ExpenseIncomeDataPoint;
      const differenceValue = dataPoint.difference;
      const expenseValue = dataPoint.expenses;
      const incomeValue = dataPoint.income;
      const year = dataPoint.year;

      return (
        <div className="glass-strong p-2 rounded-lg text-xs">
          <p className="font-medium">{`${label} ${year}`}</p>
          <p className="text-expense">{`Expenses: ${formatCurrency(
            expenseValue || 0
          )}`}</p>
          <p className="text-income">{`Income: ${formatCurrency(
            incomeValue || 0
          )}`}</p>
          <p
            className={`font-medium ${
              differenceValue >= 0 ? "text-income" : "text-expense"
            }`}
          >
            {`Balance: ${formatCurrency(differenceValue || 0)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={chartContainerRef}
          className="h-[300px] overflow-x-auto"
          onScroll={updateVisibleData}
        >
          {isLoading || !expensesVsIncome ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          ) : expensesVsIncome && expensesVsIncome.length > 0 ? (
            <div style={{ width: `${minChartWidth}px`, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expensesVsIncome}
                  margin={{ top: 20, right: 5, left: 5, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(var(--muted-foreground), 0.1)"
                    strokeOpacity={0.2}
                  />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => formatCurrency(value)}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0, 0, 0, 0.2)" }}
                  />
                  <Legend />

                  {/* Year dividers */}
                  {yearDividers && yearDividers.map((divider) => (
                    <ReferenceLine
                      key={divider.yearMonth}
                      x={expensesVsIncome.findIndex(
                        (item) => item.yearMonth === divider.yearMonth
                      )}
                      stroke="hsl(var(--primary))"
                      strokeOpacity={0.5}
                      strokeWidth={1}
                      label={{
                        value: divider.year,
                        position: "insideTopRight",
                        fill: "hsl(var(--primary))",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    />
                  ))}

                  <Bar
                    name="Balance"
                    dataKey="absoluteDifference"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  >
                    {expensesVsIncome && expensesVsIncome.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.difference >= 0
                            ? "hsl(152, 60%, 52%)"
                            : "hsl(16, 80%, 60%)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                No income vs expenses data available
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}