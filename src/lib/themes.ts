/**
 * Visual themes the user can pick in settings. The id is stored in the
 * database and rendered as `data-theme` on <html>, where `app.css` swaps the
 * design tokens; components that draw theme-specific ornaments read it via
 * `useAppTheme()`.
 */
export const THEMES = [
  {
    id: "night-ledger",
    name: "Night ledger",
    description: "Graphite, saffron accent, clean figures.",
  },
  {
    id: "ink-and-seal",
    name: "Ink and seal",
    description: "Sumi ink on black paper, red hanko stamps.",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const THEME_IDS = THEMES.map((theme) => theme.id) as [
  ThemeId,
  ...ThemeId[],
];

export const DEFAULT_THEME: ThemeId = "night-ledger";

export function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as string[]).includes(value);
}
