import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Month, Routes } from "~/lib/routes";
import { cn, formatCurrency } from "~/lib/utils";
import { format } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useExpensesVsIncomeQuery } from "~/lib/queries";

const months = [
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

interface MonthYearPickerProps {
  initialMonth?: number; // 1-12
  initialYear?: number;
  className?: string;
}

export function MonthYearPicker({
  initialMonth,
  initialYear,
  className,
}: MonthYearPickerProps) {
  const router = useRouter();
  const currentDate = new Date();

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialMonth && initialYear
      ? new Date(initialYear, initialMonth - 1) // Convert 1-indexed month to 0-indexed
      : new Date(currentDate.getFullYear(), currentDate.getMonth())
  );

  const [viewDate, setViewDate] = useState(
    initialMonth && initialYear
      ? new Date(initialYear, initialMonth - 1)
      : new Date(currentDate.getFullYear(), currentDate.getMonth())
  );

  const [open, setOpen] = useState(false);

  // Update state when props change (when navigating between months)
  useEffect(() => {
    if (initialMonth && initialYear) {
      const newDate = new Date(initialYear, initialMonth - 1);
      setSelectedDate(newDate);
      setViewDate(newDate);
    }
  }, [initialMonth, initialYear]);

  const { data: expensesVsIncomeData } = useExpensesVsIncomeQuery();

  // Helper function to get profit (income - expenses) for a specific month
  const getProfitForMonth = (year: number, monthIndex: number) => {
    if (!expensesVsIncomeData?.monthlyData) return 0;

    const monthData = expensesVsIncomeData.monthlyData.find(
      (data) => Number(data.year) === year && Number(data.month) === monthIndex + 1 // Convert to 1-indexed month
    );

    if (!monthData) return 0;

    return (Number(monthData.totalIncome) || 0) - (Number(monthData.totalExpenses) || 0);
  };

  const handlePreviousYear = () => {
    setViewDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth()));
  };

  const handleNextYear = () => {
    setViewDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth()));
  };

  const handleSelectMonth = (monthIndex: number) => {
    const newDate = new Date(viewDate.getFullYear(), monthIndex);
    setSelectedDate(newDate);
    setOpen(false);

    // Navigate to the selected year and month page (1-indexed month)
    const year = viewDate.getFullYear();
    const monthNumber = (monthIndex + 1) as Month;
    router.navigate({ to: Routes.monthlyExpensesSummary(year, monthNumber) });
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "Select month and year";
    return format(selectedDate, "MMMM yyyy");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "-ml-2 h-auto gap-1.5 px-2 py-1 text-2xl font-semibold tracking-tight",
            className
          )}
        >
          {formatSelectedDate()}
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="ink-paper w-[320px] p-3" align="start">
        <div className="mb-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePreviousYear}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous year</span>
          </Button>
          <div className="figures text-sm font-semibold">{viewDate.getFullYear()}</div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextYear}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next year</span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {months.map((monthName, index) => {
            const isSelected =
              selectedDate &&
              selectedDate.getMonth() === index &&
              selectedDate.getFullYear() === viewDate.getFullYear();

            const isCurrentMonth =
              currentDate.getMonth() === index &&
              currentDate.getFullYear() === viewDate.getFullYear();

            const profit = getProfitForMonth(viewDate.getFullYear(), index);

            return (
              <Button
                key={monthName}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "h-14 flex-col justify-center gap-0.5 py-1",
                  isCurrentMonth && !isSelected && "border-primary/60"
                )}
                onClick={() => handleSelectMonth(index)}
              >
                <span className="text-sm font-semibold leading-none">
                  {monthName}
                  {isCurrentMonth && !isSelected && (
                    <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
                  )}
                </span>
                <span
                  className={cn(
                    "figures text-[11px] leading-none",
                    isSelected
                      ? "text-primary-foreground/80"
                      : profit > 0
                      ? "text-income"
                      : profit < 0
                      ? "text-expense"
                      : "text-muted-foreground"
                  )}
                >
                  {profit !== 0 ? formatCurrency(Math.round(Math.abs(profit))) : "–"}
                </span>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
