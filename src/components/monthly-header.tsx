import { MonthYearPicker } from "~/components/month-year-picker";
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
    <header className="flex items-end justify-between gap-3 px-1">
      <div className="min-w-0">
        <MonthYearPicker initialMonth={month} initialYear={year} />
        <ViewTypeToggle viewType={viewType} onToggle={onToggleViewType} />
      </div>
      <div className="shrink-0 text-right">
        {!isLoading && balanceData && (
          <>
            <div className="eyebrow">Balance</div>
            <div
              className={cn(
                "figures text-xl font-semibold leading-tight",
                isPositiveBalance ? "text-income" : "text-expense"
              )}
            >
              {formatEUR(balance)}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

/**
 * Two-segment switch between the expense and income views. Either segment
 * flips the view, so it behaves like the single toggle it replaces.
 */
function ViewTypeToggle({
  viewType,
  onToggle,
}: {
  viewType: ViewType;
  onToggle: () => void;
}) {
  const isExpenses = viewType === "expenses";

  return (
    <div
      role="group"
      aria-label="Expenses or income"
      className="mt-2 inline-flex rounded-md border border-border bg-muted/60 p-0.5 text-xs font-semibold"
    >
      <button
        type="button"
        aria-pressed={isExpenses}
        onClick={() => !isExpenses && onToggle()}
        className={cn(
          "rounded-sm px-2.5 py-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isExpenses
            ? "bg-card text-expense shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Expenses
      </button>
      <button
        type="button"
        aria-pressed={!isExpenses}
        onClick={() => isExpenses && onToggle()}
        className={cn(
          "rounded-sm px-2.5 py-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !isExpenses
            ? "bg-card text-income shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Income
      </button>
    </div>
  );
}
