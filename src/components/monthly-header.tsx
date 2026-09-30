import { MonthYearPicker } from "~/components/month-year-picker";
import { useBalanceQuery } from "~/lib/queries";
import { cn, formatEUR } from "~/lib/utils";
import { useIsInkTheme } from "~/lib/hooks/use-app-theme";
import { kanjiMonth } from "~/lib/kanji";

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
  const isInk = useIsInkTheme();

  const balance = balanceData?.currentBalance ?? 0;
  const isPositiveBalance = balance >= 0;

  return (
    <header className="flex items-end justify-between gap-3 px-1">
      <div className="flex min-w-0 items-stretch gap-3">
        {isInk && (
          <div
            aria-hidden="true"
            className="border-l border-border pl-1.5 text-[28px] font-medium leading-none tracking-[0.3em] [writing-mode:vertical-rl]"
          >
            {kanjiMonth(month)}
          </div>
        )}
        <div className="min-w-0">
          <MonthYearPicker
            initialMonth={month}
            initialYear={year}
            className={cn(isInk && "text-lg font-medium")}
          />
          <ViewTypeToggle viewType={viewType} onToggle={onToggleViewType} />
        </div>
      </div>
      <div className="shrink-0 text-right">
        {!isLoading && balanceData && (
          <>
            <div className="eyebrow">{isInk ? "残高 balance" : "Balance"}</div>
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
  const isInk = useIsInkTheme();

  // Ink: plain labels, the active one underlined in seal red.
  if (isInk) {
    const inkSegment = (isActive: boolean) =>
      cn(
        "border-b-2 pb-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      );

    return (
      <div
        role="group"
        aria-label="Expenses or income"
        className="mt-2 flex gap-4 text-xs"
      >
        <button
          type="button"
          aria-pressed={isExpenses}
          onClick={() => !isExpenses && onToggle()}
          className={inkSegment(isExpenses)}
        >
          支出 expenses
        </button>
        <button
          type="button"
          aria-pressed={!isExpenses}
          onClick={() => isExpenses && onToggle()}
          className={inkSegment(!isExpenses)}
        >
          収入 income
        </button>
      </div>
    );
  }

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
