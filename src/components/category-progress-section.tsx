import { SegmentedProgress } from "~/components/ui/segmented-progress";
import { useCategoryColors } from "~/lib/hooks/use-category-colors";
import { useIsInkTheme } from "~/lib/hooks/use-app-theme";
import { CategoryGlyph } from "~/components/category-glyph";
import { formatEUR } from "~/lib/utils";

type Category = {
  categoryName: string;
  totalValue: number;
  icon: string;
};

type CategoryProgressSectionProps = {
  sortedCategories: Category[];
  totalMonthlyAmount: number;
};

export function CategoryProgressSection({
  sortedCategories,
  totalMonthlyAmount,
}: CategoryProgressSectionProps) {
  const { getCategoryColor } = useCategoryColors();
  const isInk = useIsInkTheme();

  return (
    <div className="mb-3 px-1">
      <SegmentedProgress
        height={22}
        variant={isInk ? "brush" : "solid"}
        segments={sortedCategories.map((category, index) => {
          return {
            value: Number(category.totalValue),
            color: getCategoryColor(category.categoryName),
            // Ink washes from heaviest to lightest, with the smallest in red.
            strokeColor:
              index === sortedCategories.length - 1 && index > 0
                ? "hsl(var(--brush-5))"
                : `hsl(var(--brush-${Math.min(index + 1, 4)}))`,
            tooltip: (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <CategoryGlyph icon={category.icon} className="size-4" />
                  <span>{category.categoryName}</span>
                </div>
                <div className="text-xs mt-1">
                  {formatEUR(Number(category.totalValue))} (
                  {(
                    (Number(category.totalValue) / totalMonthlyAmount) *
                    100
                  ).toFixed(1)}
                  %)
                </div>
              </div>
            ),
            icon: <CategoryGlyph icon={category.icon} className="size-4" />,
          };
        })}
      />
    </div>
  );
}