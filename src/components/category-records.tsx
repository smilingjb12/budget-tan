import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useCategoryColors } from "~/lib/hooks/use-category-colors";
import { useIsInkTheme } from "~/lib/hooks/use-app-theme";
import { useMonthRecordsQuery } from "~/lib/queries";
import { Month } from "~/lib/routes";
import { cn, formatEUR } from "~/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarDays, ChevronDown, Euro } from "lucide-react";
import { useState } from "react";
import { AddRecordDialog } from "./add-record-dialog";
import { CategoryGlyph } from "./category-glyph";

// Define sort type
type SortType = "date" | "value";

interface CategoryRecordsProps {
  categoryName: string;
  categoryId: number;
  year: number;
  month: Month;
  totalExpenses: number;
  icon: string;
  difference?: {
    text: string;
    color: string;
    icon?: React.ReactNode;
  };
  isExpense?: boolean;
}

export function CategoryRecords({
  categoryName,
  categoryId,
  year,
  month,
  totalExpenses,
  icon,
  difference,
  isExpense = true,
}: CategoryRecordsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortType, setSortType] = useState<SortType>("date"); // Default sort by date
  const { getCategoryTileColor } = useCategoryColors();
  const isInk = useIsInkTheme();

  // Only fetch records when the category is expanded
  const { data: records, isLoading } = useMonthRecordsQuery(
    year,
    month,
    isExpanded
  );

  // Filter records by category and expense/income type
  const categoryRecords =
    records?.filter(
      (record) =>
        record.categoryId === categoryId && record.isExpense === isExpense
    ) || [];

  // Sort records based on selected sort type
  const sortedCategoryRecords = [...categoryRecords].sort((a, b) => {
    if (sortType === "date") {
      // Sort by date (newest first)
      return new Date(b.dateUtc).getTime() - new Date(a.dateUtc).getTime();
    } else {
      // Sort by value (highest first)
      return b.value - a.value;
    }
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={toggleExpand}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isExpanded && "bg-muted/50"
        )}
      >
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            isInk
              ? cn(
                  "border",
                  isExpanded
                    ? "border-primary text-accent-foreground"
                    : "border-border text-foreground"
                )
              : getCategoryTileColor(categoryName)
          )}
        >
          <CategoryGlyph icon={icon} className={isInk ? "size-5" : "size-4"} />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {categoryName}
        </span>
        {difference && (
          <span
            className={cn(
              "figures flex items-center text-xs",
              difference.color
            )}
          >
            {difference.text}
            {difference.icon}
          </span>
        )}
        <span className="figures text-[15px] font-semibold">
          {formatEUR(totalExpenses)}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-150",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="ml-6 mt-1 mb-1 space-y-1.5 border-l border-border pl-3 animate-in fade-in-0 slide-in-from-top-1 duration-150">
          {isLoading ? (
            <div className="py-2 text-sm text-muted-foreground">
              Loading records…
            </div>
          ) : categoryRecords.length === 0 ? (
            <div className="py-2 text-sm text-muted-foreground">
              No records found
            </div>
          ) : (
            <>
              {/* Sort toggle buttons */}
              <ToggleGroup
                type="single"
                value={sortType}
                onValueChange={(value) => {
                  if (value) setSortType(value as SortType);
                }}
                variant="outline"
                size="sm"
                className="grid w-full grid-cols-2"
              >
                <ToggleGroupItem value="date" aria-label="Sort by date">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Date
                </ToggleGroupItem>
                <ToggleGroupItem value="value" aria-label="Sort by value">
                  <Euro className="h-3.5 w-3.5" />
                  Value
                </ToggleGroupItem>
              </ToggleGroup>

              {sortedCategoryRecords.map((record) => (
                <AddRecordDialog
                  key={record.id}
                  recordId={record.id}
                  isIncome={!isExpense}
                  trigger={
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-card px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-muted/60">
                      <div className="min-w-0">
                        <div className="truncate">
                          {record.comment || (
                            <span className="text-muted-foreground">No note</span>
                          )}
                        </div>
                        <div className="figures mt-0.5 text-[11px] text-muted-foreground">
                          {format(
                            parseISO(record.dateUtc),
                            isInk ? "d'日' · HH:mm" : "MMM d, yyyy HH:mm"
                          )}
                        </div>
                      </div>
                      <span className="figures shrink-0 font-semibold">
                        {formatEUR(record.value)}
                      </span>
                    </div>
                  }
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
