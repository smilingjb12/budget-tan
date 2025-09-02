import { AllTimeSummaryDto } from "~/services/record-service";
import { MonthYearPicker } from "~/components/month-year-picker";
import { Button } from "~/components/ui/button";
import { useAllTimeSummaryQuery } from "~/lib/queries";
import { formatUSD } from "~/lib/utils";
import { AddRecordDialog } from "~/components/add-record-dialog";

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
  const { data: allTimeSummary, isLoading: isLoadingAllTime } =
    useAllTimeSummaryQuery();

  // Calculate balance (profit - expenses)
  const balance = allTimeSummary
    ? allTimeSummary.totalProfit - allTimeSummary.totalExpenses
    : 0;
  const isPositiveBalance = balance >= 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <MonthYearPicker initialMonth={month} initialYear={year} />
        <Button
          variant="outline"
          size="sm"
          className="w-[40px]"
          onClick={onToggleViewType}
        >
          {viewType === "expenses" ? "E" : "I"}
        </Button>
      </div>
      <div className="flex-shrink-0">
        {!isLoadingAllTime && allTimeSummary && (
          <AddRecordDialog
            isIncome={viewType === "income"}
            trigger={
              <div
                className={`font-semibold text-xl ${
                  isPositiveBalance ? "text-green-400" : "text-red-400"
                } cursor-pointer hover:underline`}
              >
                <span>{formatUSD(balance)}</span>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}