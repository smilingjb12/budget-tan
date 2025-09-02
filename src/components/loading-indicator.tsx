import { cn } from "~/lib/utils";
import { Loader2 } from "lucide-react";

export default function LoadingIndicator({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        className
      )}
    >
      <Loader2 className={`animate-spin text-primary`} size={48} />
    </div>
  );
}