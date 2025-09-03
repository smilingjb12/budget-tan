import { createFileRoute, Outlet } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { History, LineChart, Settings2 } from "lucide-react";
import { useRouter, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
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
        "flex flex-1 flex-col items-center justify-center py-2",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
      )}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function MobileBottomNav() {
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname;

  const isHistory =
    pathname.includes("/app/") &&
    !pathname.includes("/app/charts") &&
    !pathname.includes("/app/settings") &&
    !pathname.includes("/app/import");

  const isCharts = pathname.includes("/app/charts");
  const isSettings = pathname.includes("/app/settings");

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <nav className="flex h-16 items-center justify-around px-4">
        <BottomNavItem
          icon={<History size={24} />}
          label="History"
          isActive={isHistory}
          onClick={() => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            router.navigate({ to: `/app/${year}/${month}` });
          }}
        />
        <BottomNavItem
          icon={<LineChart size={24} />}
          label="Charts"
          isActive={isCharts}
          onClick={() => router.navigate({ to: "/app/charts" })}
        />
        <BottomNavItem
          icon={<Settings2 size={24} />}
          label="Settings"
          isActive={isSettings}
          onClick={() => router.navigate({ to: "/app/settings" })}
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
