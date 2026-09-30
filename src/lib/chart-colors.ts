/** Stacked-series colours, resolved from the active theme's `--series-*` tokens. */
export const SERIES_COLORS = Array.from(
  { length: 10 },
  (_, index) => `hsl(var(--series-${index + 1}))`
);
