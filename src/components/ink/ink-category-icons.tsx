import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

/*
 * Category icons for the ink theme: each Lucide category reimagined as a
 * Japanese motif on the same 24×24 grid, drawn in strokes of currentColor
 * with one vermilion accent (`ink-accent`), and roughened by the
 * `#ink-brush` filter from <InkFilters />.
 */
const ACCENT = "ink-accent";
const ACCENT_FILL = "ink-accent-fill";

const ICONS: Record<string, ReactNode> = {
  // Food: rice bowl with lacquered chopsticks.
  utensils: (
    <>
      <path d="M4 12h16c0 4.5-3.6 7.5-8 7.5S4 16.5 4 12z" />
      <path d="M9.5 19.5 9 21h6l-.5-1.5" />
      <path d="M6.8 12c.9-2.3 2.8-3.4 5.2-3.4s4.3 1.1 5.2 3.4" />
      <path className={ACCENT} d="M13.5 10 20.5 3.5M15.5 11 21.5 5.5" />
    </>
  ),
  // Transportation: car with a taxi roof lantern.
  "car-taxi-front": (
    <>
      <path d="M3.5 15.5v-3l2.3-4h12.4l2.3 4v3z" />
      <path d="M6.5 12.2h11" />
      <circle cx="7.5" cy="17" r="1.7" />
      <circle cx="16.5" cy="17" r="1.7" />
      <path className={ACCENT} d="M10 8.5V6.2h4v2.3" />
    </>
  ),
  // Rent & Bills: house with flared eaves and a shoji door.
  house: (
    <>
      <path d="M2.5 11.2c3.6-.5 6.6-3.4 9.5-7.2 2.9 3.8 5.9 6.7 9.5 7.2" />
      <path d="M5.2 10.3V20h13.6v-9.7" />
      <path d="M10 20v-5.5h4V20M12 14.5V20" />
    </>
  ),
  // Shopping: woven kago basket.
  "shopping-cart": (
    <>
      <path d="M4 10h16l-1.6 9.5H5.6z" />
      <path d="M4.9 13.4h14.2M5.4 16.5h13.2M9.2 10l.4 9.5M14.8 10l-.4 9.5" />
      <path className={ACCENT} d="M8 10c0-4.6 8-4.6 8 0" />
    </>
  ),
  // Travel: torii gate.
  plane: (
    <>
      <path d="M2.5 5.5c4.5 1.4 14.5 1.4 19 0" />
      <path
        className={ACCENT}
        d="M4.5 8.6h15M5.5 12h13M7 7.2 6.4 21M17 7.2l.6 13.8M12 8.6V12"
      />
    </>
  ),
  // Leisure: Noh mask.
  drama: (
    <>
      <path d="M12 3C7.6 3 5 6.6 5 11.2 5 16.8 8 21 12 21s7-4.2 7-9.8C19 6.6 16.4 3 12 3z" />
      <path d="M8 10.8c.8-.8 1.8-.8 2.5 0M13.5 10.8c.7-.8 1.7-.8 2.5 0" />
      <path d="M12 3c-1.3 1.6-2.9 2.3-4.6 2.6M12 3c1.3 1.6 2.9 2.3 4.6 2.6" />
      <path className={ACCENT} d="M10.2 16.2c1.2.7 2.4.7 3.6 0" />
      <circle cx="8.7" cy="7.8" r=".6" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="7.8" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  // Education: hanging scroll with a seal.
  "graduation-cap": (
    <>
      <path d="M3.5 5h17M3.5 19h17" />
      <path d="M5.5 5v14M18.5 5v14" />
      <path d="M15 8.5v7M12 8.5v4.5M9 8.5v5" />
      <rect className={ACCENT_FILL} x="8" y="15.2" width="2.2" height="2.2" rx=".3" />
    </>
  ),
  // Wellness and Beauty: onsen bath with rising steam.
  "heart-pulse": (
    <>
      <path d="M4 13.5c0 4.2 3.6 7 8 7s8-2.8 8-7" />
      <path d="M3.5 13.5h17" />
      <path
        className={ACCENT}
        d="M8 11c-1.1-1.6 1.1-2.6 0-4.3-.6-.9-.2-1.9.4-2.4M12 11c-1.1-1.6 1.1-2.6 0-4.3-.6-.9-.2-1.9.4-2.4M16 11c-1.1-1.6 1.1-2.6 0-4.3-.6-.9-.2-1.9.4-2.4"
      />
    </>
  ),
  // Other: paper slip with a seal.
  "receipt-text": (
    <>
      <path d="M7 3h10v18H7z" />
      <path d="M10 6.5v8M14 6.5v5" />
      <rect className={ACCENT_FILL} x="12.4" y="15.5" width="2.6" height="2.6" rx=".3" />
    </>
  ),
  // Gifts: wrapped box tied with a mizuhiki knot.
  gift: (
    <>
      <path d="M4.5 10.5h15V20h-15z" />
      <path d="M3.5 7.5h17v3h-17z" />
      <path d="M12 7.5V20" />
      <path
        className={ACCENT}
        d="M12 7.5c-1.8-2.8-4.6-2.8-4.2-.7.3 1.2 2.6.9 4.2.7 1.6.2 3.9.5 4.2-.7.4-2.1-2.4-2.1-4.2.7"
      />
    </>
  ),
  // Paycheck: mon coins.
  "hand-coins": (
    <>
      <circle cx="10" cy="13.5" r="6.5" />
      <path d="M8.5 12h3v3h-3z" />
      <path className={ACCENT} d="M13.6 7.6a6.5 6.5 0 0 1 5.9 9.5" />
    </>
  ),
};

export function InkCategoryIcon({
  icon,
  className,
  onFill = false,
}: {
  icon: string;
  className?: string;
  /** The icon sits on a filled seal-red tile: draw accents in the icon colour. */
  onFill?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("ink-icon", onFill && "ink-icon-on-fill", className)}
    >
      {ICONS[icon] ?? ICONS["receipt-text"]}
    </svg>
  );
}
