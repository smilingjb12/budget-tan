import { MonthYearPicker } from "~/components/month-year-picker";
import { Button } from "~/components/ui/button";
import { useBalanceQuery } from "~/lib/queries";
import { cn, formatEUR } from "~/lib/utils";

// Define view type for toggling between expenses and income
export type ViewType = "expenses" | "income";

type MonthlyHeaderProps = {
  viewType: ViewType;
  onToggleViewType: () => void;
  month: number;
  year: number;
};

export function MonthlyHeader({
  viewType,
  onToggleViewType,
  month,
  year,
}: MonthlyHeaderProps) {
  const { data: balanceData, isLoading } = useBalanceQuery();

  const balance = balanceData?.currentBalance ?? 0;
  const isPositiveBalance = balance >= 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <MonthYearPicker initialMonth={month} initialYear={year} />
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-[40px] transition-all duration-200",
            viewType === "expenses"
              ? "border-expense/40 text-expense hover:bg-expense-muted"
              : "border-income/40 text-income hover:bg-income-muted"
          )}
          onClick={onToggleViewType}
        >
          {viewType === "expenses" ? "E" : "I"}
        </Button>
      </div>
      <div className="flex-shrink-0">
        {!isLoading && balanceData && (
          <div
            className={`font-semibold text-xl ${
              isPositiveBalance ? "text-income" : "text-expense"
            }`}
          >
            <span>{formatEUR(balance)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
