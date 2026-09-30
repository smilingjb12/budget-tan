import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useAppTheme } from "~/lib/hooks/use-app-theme";
import { useSetThemeMutation } from "~/lib/queries";
import { THEMES, type ThemeId } from "~/lib/themes";
import { cn } from "~/lib/utils";

export function ThemeSettingsCard() {
  const currentTheme = useAppTheme();
  const setTheme = useSetThemeMutation();

  // Show the pick straight away while it saves and the router reloads.
  const selectedTheme = setTheme.isPending ? setTheme.variables : currentTheme;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          role="radiogroup"
          aria-label="Theme"
          className="grid grid-cols-2 gap-3"
        >
          {THEMES.map((theme) => {
            const isSelected = theme.id === selectedTheme;

            return (
              <button
                key={theme.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={theme.name}
                disabled={setTheme.isPending}
                onClick={() => !isSelected && setTheme.mutate(theme.id)}
                className={cn(
                  "rounded-lg border p-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait",
                  isSelected
                    ? "border-primary ring-1 ring-primary"
                    : "border-border hover:bg-muted/60"
                )}
              >
                <ThemePreview themeId={theme.id} />
                <div className="mt-2 text-sm font-semibold">{theme.name}</div>
                <div className="text-xs text-muted-foreground">
                  {theme.description}
                </div>
              </button>
            );
          })}
        </div>
        {setTheme.isError && (
          <p className="mt-3 text-sm text-expense">
            Couldn't save the theme. Try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * A thumbnail of each theme's month view. Colours are literal rather than
 * tokens because each preview must look like its own theme, not the active one.
 */
function ThemePreview({ themeId }: { themeId: ThemeId }) {
  if (themeId === "ink-and-seal") {
    return (
      <div
        aria-hidden="true"
        className="flex h-20 gap-2 overflow-hidden rounded-md p-2"
        style={{
          background: "#0F0E0C",
          color: "#E8E2D6",
          fontFamily: '"Zen Old Mincho", serif',
        }}
      >
        <div
          className="pl-1 text-sm leading-none tracking-[0.2em] [writing-mode:vertical-rl]"
          style={{ borderLeft: "1px solid #3A342C" }}
        >
          九月
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-base">2,184</span>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-[3px] text-[9px]"
              style={{ background: "#C8322A", color: "#F4E6D8", rotate: "-6deg" }}
            >
              支出
            </span>
          </div>
          <svg viewBox="0 0 100 10" className="h-2.5 w-full" preserveAspectRatio="none">
            <path d="M3 5 C20 3, 40 7, 55 5" stroke="#E8E2D6" strokeWidth="4" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M62 5 C72 4, 80 6, 86 5" stroke="#8F877A" strokeWidth="3" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M92 5 L97 5" stroke="#C8322A" strokeWidth="2" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="flex justify-between text-[9px]" style={{ color: "#8F877A" }}>
            <span>食 Food</span>
            <span>812</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-20 flex-col justify-between overflow-hidden rounded-md p-2"
      style={{ background: "#111318", color: "#EEECE7" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-semibold"
          style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
        >
          September
        </span>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#F6AE31" }} />
      </div>
      <span
        className="text-base font-semibold"
        style={{ fontFamily: '"Inter Tight", sans-serif' }}
      >
        €2,184
      </span>
      <div className="flex h-2 gap-px overflow-hidden rounded-sm">
        <span className="flex-[5]" style={{ background: "#34C28A" }} />
        <span className="flex-[3]" style={{ background: "#A06CE0" }} />
        <span className="flex-[2]" style={{ background: "#4C8EF0" }} />
        <span className="flex-1" style={{ background: "#F6AE31" }} />
      </div>
    </div>
  );
}
