import { cn } from "~/lib/utils";

/**
 * A drop of sumi ink standing in for a coloured status dot. `weight` (0–1)
 * sets how much ink: a small pale wash at 0, a large dark drop near 1, and a
 * vermilion blot with a fleck of spatter at the very top of the range.
 */
export function InkDrop({
  weight,
  className,
}: {
  weight: number;
  className?: string;
}) {
  const clamped = Math.min(1, Math.max(0, weight));
  const isHeaviest = clamped >= 0.85;
  const size = 7 + clamped * 9;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("ink-icon shrink-0", className)}
      // Solid tones rather than opacity: the ink filter's alpha threshold would
      // erase a faint, translucent drop entirely.
      style={{
        color: isHeaviest
          ? "hsl(var(--primary))"
          : `hsl(40 ${Math.round(8 + 22 * clamped)}% ${Math.round(34 + 53 * clamped)}%)`,
      }}
    >
      <path
        fill="currentColor"
        d="M12 3.8c3.6-.2 7.6 2.6 7.8 7 .2 4.8-3 8.5-7.4 8.6-4.6.2-8.3-2.9-8.3-7.7 0-4.4 3.8-7.7 7.9-7.9z"
      />
      {isHeaviest && <circle cx="20.6" cy="19.4" r="1.4" fill="currentColor" />}
    </svg>
  );
}
