import { useMatch } from "@tanstack/react-router";
import { DEFAULT_THEME, type ThemeId } from "~/lib/themes";

/**
 * The theme saved in settings. It is loaded by the `/app` route so the server
 * renders the right `data-theme` on the first paint; outside `/app` (sign-in)
 * the default theme applies.
 */
export function useAppTheme(): ThemeId {
  const appMatch = useMatch({ from: "/app", shouldThrow: false });
  return appMatch?.loaderData?.theme ?? DEFAULT_THEME;
}

export function useIsInkTheme(): boolean {
  return useAppTheme() === "ink-and-seal";
}
