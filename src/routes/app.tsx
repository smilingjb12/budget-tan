import { createFileRoute, Outlet } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { History, LineChart, Settings2 } from "lucide-react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { RouteMatchers, Routes, type Month } from "~/lib/routes";
import { requireAuth } from "~/server/auth";
import { getSettings } from "~/server/settings";
import { useIsInkTheme } from "~/lib/hooks/use-app-theme";
import { InkFilters } from "~/components/ink/ink-filters";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => await requireAuth(),
  // Settings only change through the theme picker, which invalidates the router.
  loader: async () => await getSettings(),
  staleTime: Infinity,
  component: AppLayout,
});

interface BottomNavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function BottomNavItem({ icon, label, isActive, onClick }: BottomNavItemProps) {
  return (
    <button
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-150",
          isActive && "bg-accent"
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function MobileBottomNav() {
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname;
  const isInk = useIsInkTheme();

  // Ink theme swaps the icons for single kanji: history, chart, settings.
  const kanjiIcon = (kanji: string) => (
    <span aria-hidden="true" className="text-xl font-medium leading-none">
      {kanji}
    </span>
  );

  const isHistory = RouteMatchers.isHistoryRoute(pathname);
  const isCharts = RouteMatchers.isChartsRoute(pathname);
  const isSettings = RouteMatchers.isSettingsRoute(pathname);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-safe supports-[backdrop-filter]:bg-background/85 supports-[backdrop-filter]:backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-xl items-center px-2">
        <BottomNavItem
          icon={isInk ? kanjiIcon("歴") : <History size={21} />}
          label="History"
          isActive={isHistory}
          onClick={() => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            router.navigate({ to: Routes.monthlyExpensesSummary(year, month as Month) });
          }}
        />
        <BottomNavItem
          icon={isInk ? kanjiIcon("図") : <LineChart size={21} />}
          label="Charts"
          isActive={isCharts}
          onClick={() => router.navigate({ to: Routes.charts() })}
        />
        <BottomNavItem
          icon={isInk ? kanjiIcon("設") : <Settings2 size={21} />}
          label="Settings"
          isActive={isSettings}
          onClick={() => router.navigate({ to: Routes.settings() })}
        />
      </nav>
    </div>
  );
}

function AppLayout() {
  const isInk = useIsInkTheme();

  return (
    <div className="min-h-screen pb-20">
      {isInk && <InkFilters />}
      <div className="mx-auto max-w-xl px-3 pt-5 pb-10">
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  );
}
