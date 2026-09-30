import { InkCategoryIcon } from "~/components/ink/ink-category-icons";
import { useIsInkTheme } from "~/lib/hooks/use-app-theme";
import { useCategoryIcon } from "~/lib/hooks/use-category-icon";

/**
 * A category's icon: the Lucide icon, or its Japanese ink motif in the ink
 * theme. Pass `onFill` when it sits on a seal-red (primary) background.
 */
export function CategoryGlyph({
  icon,
  className,
  onFill,
}: {
  icon: string;
  className?: string;
  onFill?: boolean;
}) {
  const isInk = useIsInkTheme();
  const { getCategoryIcon } = useCategoryIcon();

  if (isInk) {
    return <InkCategoryIcon icon={icon} className={className} onFill={onFill} />;
  }

  const IconComponent = getCategoryIcon(icon);
  return <IconComponent className={className} />;
}
