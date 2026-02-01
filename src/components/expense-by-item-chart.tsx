"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  useUniqueCommentsGroupedQuery,
  useExpensesByItemsQuery,
  ExpenseByItemResponseDto,
} from "~/lib/queries";
import { formatCurrency } from "~/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GroupedMultiSelectCombobox } from "~/components/ui/grouped-multi-select-combobox";

// Color palette for items
const COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff8042", // Orange
  "#0088fe", // Blue
  "#00C49F", // Teal
  "#FFBB28", // Gold
  "#a4de6c", // Light Green
  "#d0ed57", // Lime
  "#FF6B6B", // Red
];

interface ExpenseByItemDataPoint {
  name: string;
  yearMonth: string;
  year: string;
  total: number;
  isFirstMonthOfYear: boolean;
  [item: string]: string | number | boolean;
}

// Transform expense by item data for chart display
function transformExpenseByItemForChart(
  data: ExpenseByItemResponseDto["data"],
  selectedItems: string[]
) {
  if (!data || !Array.isArray(data) || selectedItems.length === 0) {
    return { data: [], items: [] };
  }

  const chartData: ExpenseByItemDataPoint[] = data.map((monthData) => {
    const [year, month] = monthData.monthDate.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];

    const result: ExpenseByItemDataPoint = {
      name: monthName,
      yearMonth: monthData.monthDate,
      year,
      total: monthData.monthlyTotal,
      isFirstMonthOfYear: month === "01",
    };

    // Initialize all selected items to 0
    selectedItems.forEach((item) => {
      result[item] = 0;
    });

    // Fill in actual values
    monthData.items.forEach((itemData) => {
      if (selectedItems.includes(itemData.item)) {
        result[itemData.item] = itemData.total;
      }
    });

    return result;
  });

  return {
    data: chartData,
    items: selectedItems,
  };
}

export function ExpenseByItemChart() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Fetch unique comments grouped by category
  const { data: groupedComments, isLoading: isCommentsLoading } =
    useUniqueCommentsGroupedQuery();

  // Fetch expense data for selected items
  const { data: expenseData, isLoading: isExpensesLoading } =
    useExpensesByItemsQuery(selectedItems);

  // Transform data for chart
  const chartData = useMemo(
    () =>
      transformExpenseByItemForChart(expenseData?.data || [], selectedItems),
    [expenseData, selectedItems]
  );

  // Calculate minimum width based on number of data points
  const minChartWidth = chartData.data?.length
    ? Math.max(chartData.data.length * 60, 300)
    : 300;

  // Get year dividers for the chart
  const getYearDividers = () => {
    if (!chartData.data?.length) return [];

    return chartData.data
      .filter((item) => item.isFirstMonthOfYear)
      .map((item) => ({
        yearMonth: item.yearMonth,
        year: item.year,
      }));
  };

  const yearDividers = getYearDividers();

  // Update visible data callback (for scroll tracking)
  const updateVisibleData = useCallback(() => {
    // This is used for potential future enhancements
  }, []);

  // Scroll to the right (most recent data) when items are selected
  useEffect(() => {
    if (
      chartContainerRef.current &&
      chartData.data?.length &&
      !isExpensesLoading &&
      selectedItems.length > 0 &&
      !hasInitiallyScrolled
    ) {
      setTimeout(() => {
        if (chartContainerRef.current) {
          chartContainerRef.current.scrollLeft =
            chartContainerRef.current.scrollWidth;
          setHasInitiallyScrolled(true);
        }
      }, 100);
    }
  }, [chartData, isExpensesLoading, selectedItems, hasInitiallyScrolled]);

  // Reset scroll flag when items change
  useEffect(() => {
    setHasInitiallyScrolled(false);
  }, [selectedItems]);

  // Custom tooltip for the stacked bar chart
  const CustomTooltip = (props: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
      payload: ExpenseByItemDataPoint;
    }>;
    label?: string;
  }) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length > 0) {
      const dataPoint = payload[0].payload;

      return (
        <div className="bg-background/90 p-2 border border-border rounded-md shadow-md text-xs">
          <p className="font-medium">{`${label} ${dataPoint.year}`}</p>
          <p className="font-semibold text-primary mb-1">{`Total: ${formatCurrency(dataPoint.total)}`}</p>
          <div className="space-y-1">
            {payload
              .filter((entry) => entry.value > 0)
              .map((entry, index) => (
                <div key={`item-${index}`} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>
                    {entry.name}: {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense by Item</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Total Amount Display */}
        {selectedItems.length > 0 && expenseData && (
          <div className="mb-4 text-2xl font-bold">
            Total: {formatCurrency(expenseData.grandTotal)}
          </div>
        )}

        {/* Multi-Select for Items */}
        <div className="mb-6">
          <GroupedMultiSelectCombobox
            value={selectedItems}
            onChange={setSelectedItems}
            groupedOptions={groupedComments || []}
            placeholder="Select items to track..."
            searchPlaceholder="Search items..."
            emptyMessage={
              isCommentsLoading ? "Loading items..." : "No items found."
            }
          />
        </div>

        {/* Chart Container */}
        <div
          ref={chartContainerRef}
          className="h-[300px] overflow-x-auto"
          onScroll={updateVisibleData}
        >
          {selectedItems.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                Select items to view expense trends
              </p>
            </div>
          ) : isExpensesLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          ) : chartData.data.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                No expense data for selected items
              </p>
            </div>
          ) : (
            <div style={{ width: `${minChartWidth}px`, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.data}
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
                  {yearDividers.map((divider) => (
                    <ReferenceLine
                      key={divider.yearMonth}
                      x={chartData.data.findIndex(
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

                  {/* Create a stacked bar for each selected item */}
                  {chartData.items.map((item, index) => (
                    <Bar
                      key={item}
                      dataKey={item}
                      stackId="expenses"
                      fill={COLORS[index % COLORS.length]}
                      maxBarSize={40}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
