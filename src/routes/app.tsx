import { createFileRoute, Outlet } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { History, LineChart, Settings2 } from "lucide-react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { RouteMatchers, Routes, type Month } from "~/lib/routes";
import { requireAuth } from "~/server/auth";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => await requireAuth(),
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
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center py-2 transition-colors duration-200",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
      )}
    >
      {isActive && (
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary transition-all duration-300" />
      )}
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function MobileBottomNav() {
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname;

  const isHistory = RouteMatchers.isHistoryRoute(pathname);
  const isCharts = RouteMatchers.isChartsRoute(pathname);
  const isSettings = RouteMatchers.isSettingsRoute(pathname);

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-[hsl(var(--glass-border)/0.15)]">
      <nav className="flex h-16 items-center justify-around px-4 relative">
        <BottomNavItem
          icon={<History size={24} />}
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
          icon={<LineChart size={24} />}
          label="Charts"
          isActive={isCharts}
          onClick={() => router.navigate({ to: Routes.charts() })}
        />
        <BottomNavItem
          icon={<Settings2 size={24} />}
          label="Settings"
          isActive={isSettings}
          onClick={() => router.navigate({ to: Routes.settings() })}
        />
      </nav>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <div className="pt-6 pb-12 px-2">
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  );
}
