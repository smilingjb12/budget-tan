"use client";

import { cn } from "~/lib/utils";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export interface SegmentProps {
  value: number;
  color?: string;
  /** CSS colour for the brush variant's stroke. */
  strokeColor?: string;
  tooltip?: React.ReactNode;
  icon?: React.ReactNode;
}

interface SegmentedProgressProps {
  segments: SegmentProps[];
  className?: string;
  height?: number;
  /** "brush" draws each segment as a tapering ink stroke (ink theme). */
  variant?: "solid" | "brush";
}

export function SegmentedProgress({
  segments,
  className,
  height = 24,
  variant = "solid",
}: SegmentedProgressProps) {
  const isBrush = variant === "brush";

  // Calculate total value to determine segment widths
  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);

  // Default colors if none provided
  const defaultColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-primary",
  ];

  // Filter out segments with zero value
  const validSegments = segments.filter((segment) => segment.value > 0);

  // If no valid segments, show empty bar
  if (validSegments.length === 0 || totalValue <= 0) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-md border border-border bg-muted",
          className
        )}
        style={{ height: `${height}px` }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        !isBrush && "rounded-md border border-border bg-muted",
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div className={cn("flex h-full w-full", isBrush ? "gap-1" : "gap-px")}>
        {validSegments.map((segment, index) => {
          const width = (segment.value / totalValue) * 100;
          const color =
            segment.color || defaultColors[index % defaultColors.length];

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isBrush ? (
                    <div
                      className="h-full transition-[width] duration-300"
                      style={{
                        width: `${width}%`,
                        minWidth: "12px",
                        color: segment.strokeColor,
                      }}
                    >
                      <BrushStroke
                        index={index}
                        weight={Math.max(3, height * 0.6 - index)}
                      />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-full items-center justify-center transition-[width] duration-300",
                        color
                      )}
                      style={{
                        width: `${width}%`,
                        minWidth: width > 0 ? "12px" : "0", // Ensure very small segments are still visible
                      }}
                    >
                      {segment.icon && width >= 5 && (
                        <div className="text-white/90">{segment.icon}</div>
                      )}
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {segment.tooltip || `${segment.value} (${width.toFixed(1)}%)`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}

/**
 * One horizontal ink stroke filling its box. The curve alternates per index so
 * neighbouring strokes don't look stamped out of the same mould; the stroke
 * width stays in pixels however wide the segment is.
 */
function BrushStroke({ index, weight }: { index: number; weight: number }) {
  const wave = index % 2 === 0 ? [-3, 3] : [3, -2];
  return (
    <svg
      className="h-full w-full overflow-visible"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={`M4 10 C30 ${10 + wave[0]}, 70 ${10 + wave[1]}, 96 10`}
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
