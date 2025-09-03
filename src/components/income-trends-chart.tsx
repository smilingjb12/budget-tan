"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useIncomeTrendsQuery, IncomeTrendsDto } from "~/lib/queries";
import { formatCurrency } from "~/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Generate a color palette for the categories
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

interface IncomeDataPoint {
  name: string;
  yearMonth: string;
  year: string;
  total: number;
  isFirstMonthOfYear: boolean;
  [categoryName: string]: string | number | boolean;
}

// Transform income trends data for chart display
function transformIncomeTrendsForChart(data: IncomeTrendsDto[]) {
  if (!data || !Array.isArray(data)) {
    return { data: [], categories: [] };
  }

  // Group data by month
  const monthlyData: Record<string, {
    monthDate: string;
    total: number;
    categories: Record<string, number>;
  }> = {};

  const categories = new Set<string>();

  // Group by monthDate and collect categories
  data.forEach((item) => {
    if (!item || !item.monthDate || !item.categoryName || typeof item.total !== 'number') {
      return;
    }
    
    if (!monthlyData[item.monthDate]) {
      monthlyData[item.monthDate] = {
        monthDate: item.monthDate,
        total: 0,
        categories: {},
      };
    }

    monthlyData[item.monthDate].total += item.total;
    monthlyData[item.monthDate].categories[item.categoryName] = 
      (monthlyData[item.monthDate].categories[item.categoryName] || 0) + item.total;
    categories.add(item.categoryName);
  });

  // Convert to chart format
  const chartData = Object.values(monthlyData).map((item) => {
    const [year, month] = item.monthDate.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];
    
    const result: IncomeDataPoint = {
      name: monthName,
      yearMonth: item.monthDate,
      year,
      total: item.total,
      isFirstMonthOfYear: month === '01',
    };

    // Add each category as a separate key
    Array.from(categories).forEach((category) => {
      result[category] = item.categories[category] || 0;
    });

    return result;
  });

  // Sort by date
  chartData.sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));

  return {
    data: chartData,
    categories: Array.from(categories).sort(),
  };
}

export function IncomeTrendsChart() {
  const { data: rawIncomeTrendsData, isLoading } = useIncomeTrendsQuery();
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [, setVisibleData] = useState<IncomeDataPoint[]>([]);
  const [, setVisibleRange] = useState({ start: 0, end: 0 });
  const [, setCurrentYear] = useState<string | null>(null);

  // Transform data (memoized to avoid recalculation)
  const incomeTrendsData = rawIncomeTrendsData ? transformIncomeTrendsForChart(rawIncomeTrendsData) : { data: [], categories: [] };

  // Calculate visible bars based on scroll position
  const updateVisibleData = useCallback(() => {
    if (!chartContainerRef.current || !incomeTrendsData.data?.length) return;

    const container = chartContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const totalWidth = container.scrollWidth;

    // Calculate approximate visible range
    const barWidth = totalWidth / incomeTrendsData.data.length;
    const startIndex = Math.max(0, Math.floor(scrollLeft / barWidth));
    const visibleCount = Math.ceil(containerWidth / barWidth);
    const endIndex = Math.min(
      incomeTrendsData.data.length - 1,
      startIndex + visibleCount
    );

    // Update visible range
    setVisibleRange({ start: startIndex, end: endIndex });

    // Update visible data
    const newVisibleData = incomeTrendsData.data.slice(startIndex, endIndex + 1);
    setVisibleData(newVisibleData);

    // Update current year (use the middle item's year for context)
    if (newVisibleData.length > 0) {
      const middleIndex = Math.floor(newVisibleData.length / 2);
      setCurrentYear(newVisibleData[middleIndex]?.year || null);
    }
  }, [incomeTrendsData]);

  // Scroll to the right (most recent data) only on initial load
  useEffect(() => {
    if (
      chartContainerRef.current &&
      incomeTrendsData.data?.length &&
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
  }, [incomeTrendsData, isLoading, updateVisibleData, hasInitiallyScrolled]);

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
  }, [incomeTrendsData, updateVisibleData]);

  // Extra safety checks
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rawIncomeTrendsData || !Array.isArray(rawIncomeTrendsData) || rawIncomeTrendsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No income data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Additional safety check after transformation
  if (!incomeTrendsData.data || incomeTrendsData.data.length === 0 || !incomeTrendsData.categories || incomeTrendsData.categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Unable to process income data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate minimum width based on number of data points
  const minChartWidth = incomeTrendsData.data?.length
    ? Math.max(incomeTrendsData.data.length * 60, 300)
    : 300;

  // Custom tooltip for the stacked bar chart
  const CustomTooltip = (props: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; payload: IncomeDataPoint }>; label?: string }) => {
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
        <CardTitle>Income Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={chartContainerRef}
          className="h-[300px] overflow-x-auto"
          onScroll={updateVisibleData}
        >
          <div style={{ width: `${minChartWidth}px`, height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeTrendsData.data}
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

                {/* Create a stacked bar for each category */}
                {incomeTrendsData.categories.map((category, index) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="income"
                    fill={COLORS[index % COLORS.length]}
                    maxBarSize={40}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}