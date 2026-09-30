type BrushBarProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
};

/**
 * Recharts bar shape for the ink theme: one upward brush stroke with round
 * ends, leaning a touch, with two dry bristle streaks splitting off the top.
 * It stays inside the bar's own box so axes and labels line up as usual.
 */
export function InkBrushBar({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill,
}: BrushBarProps) {
  if (width <= 0 || height <= 0) return null;

  // Round caps add half the stroke width at each end, so a short bar gets a
  // thinner stroke rather than a blob spilling below the axis.
  const strokeWidth = Math.max(2, Math.min(width * 0.62, height));
  const cap = strokeWidth / 2;
  const centerX = x + width / 2;
  const top = y + cap;
  const bottom = Math.max(top + 0.01, y + height - cap);
  const lean = Math.min(1.5, width * 0.04);
  const hasBristles = height > strokeWidth * 1.5;

  return (
    <g>
      <path
        d={`M${centerX} ${bottom} L${centerX + lean} ${top}`}
        stroke={fill}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {hasBristles && <path
        d={`M${centerX - strokeWidth * 0.3} ${top} l${-lean} ${-cap * 1.1} M${
          centerX + strokeWidth * 0.32
        } ${top} l${lean * 1.5} ${-cap * 0.9}`}
        stroke={fill}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.6}
        fill="none"
      />}
    </g>
  );
}
