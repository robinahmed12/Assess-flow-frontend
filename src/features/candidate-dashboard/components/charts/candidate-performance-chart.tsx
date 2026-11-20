"use client";

import { useId, useMemo, useState } from "react";
import { ChartLineUpIcon, CheckCircleIcon, SparkleIcon, XCircleIcon } from "@phosphor-icons/react";
import type { CandidatePerformancePoint } from "../../types/candidate-dashboard.dto";

interface CandidatePerformanceChartProps {
  performanceTrend: CandidatePerformancePoint[];
  averagePercentage: number;
}

export function CandidatePerformanceChart({
  performanceTrend,
  averagePercentage,
}: CandidatePerformanceChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const id = useId();

  // If performanceTrend is empty, provide a clean fallback baseline point
  const points = useMemo(() => {
    if (performanceTrend.length === 0) {
      return [
        {
          attemptId: "sample-1",
          assessment: { id: "1", title: "Diagnostic Coding Challenge" },
          score: 30,
          percentage: averagePercentage > 0 ? averagePercentage : 50,
          passed: true,
          submittedAt: new Date().toISOString(),
        },
      ];
    }
    return performanceTrend;
  }, [performanceTrend, averagePercentage]);

  const width = 640;
  const height = 220;
  const padding = { top: 25, right: 25, bottom: 35, left: 40 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = 100; // Percentages go from 0 to 100

  const coords = useMemo(() => {
    return points.map((p, i) => {
      const divisor = Math.max(points.length - 1, 1);
      const x =
        points.length === 1
          ? padding.left + graphWidth / 2
          : padding.left + (i / divisor) * graphWidth;
      const y = padding.top + graphHeight - (Math.min(100, Math.max(0, p.percentage)) / maxVal) * graphHeight;
      return { x, y, point: p };
    });
  }, [points, graphWidth, graphHeight, padding.left, padding.top]);

  // Generate smooth SVG curve and area fill
  const { pathString, areaString } = useMemo(() => {
    if (coords.length === 0) return { pathString: "", areaString: "" };

    if (coords.length === 1) {
      const c = coords[0]!;
      const baseline = padding.top + graphHeight;
      return {
        pathString: `M ${padding.left},${c.y} L ${width - padding.right},${c.y}`,
        areaString: `M ${padding.left},${c.y} L ${width - padding.right},${c.y} L ${width - padding.right},${baseline} L ${padding.left},${baseline} Z`,
      };
    }

    const pStr = coords.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x},${curr.y}`;
      const prev = arr[idx - 1]!;
      const cpx1 = prev.x + (curr.x - prev.x) / 2;
      const cpy1 = prev.y;
      const cpx2 = prev.x + (curr.x - prev.x) / 2;
      const cpy2 = curr.y;
      return `${acc} C ${cpx1},${cpy1} ${cpx2},${cpy2} ${curr.x},${curr.y}`;
    }, "");

    const baseline = padding.top + graphHeight;
    const firstX = coords[0]!.x;
    const lastX = coords[coords.length - 1]!.x;
    const aStr = `${pStr} L ${lastX},${baseline} L ${firstX},${baseline} Z`;

    return { pathString: pStr, areaString: aStr };
  }, [coords, graphHeight, padding.left, padding.top, padding.right, width]);

  const activeCoord = hoverIndex !== null ? coords[hoverIndex] : null;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6DCD0]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#262A56] text-[#E3CCAE] shadow-xs">
              <ChartLineUpIcon className="size-4" weight="bold" />
            </span>
            <h3 className="font-heading text-sm font-bold text-[#111322] sm:text-base">
              Score Performance Progression
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#5A5D70]">
            Evaluation score % and qualification trend across completed tests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#FAF8F5] border border-[#E6DCD0] px-2.5 py-1 text-[11px] font-bold text-[#B8621B]">
            {averagePercentage.toFixed(1)}% Average Score
          </span>
        </div>
      </div>

      {/* SVG Curve Surface */}
      <div className="relative mt-4 w-full select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            let closestIdx = 0;
            let minDist = Infinity;
            coords.forEach((c, idx) => {
              const d = Math.abs(c.x - relX);
              if (d < minDist) {
                minDist = d;
                closestIdx = idx;
              }
            });
            setHoverIndex(closestIdx);
          }}
        >
          <defs>
            <linearGradient id={`candGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B8621B" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#B8621B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines at 25%, 50%, 75%, 100% */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = padding.top + graphHeight * (1 - val / 100);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#E6DCD0"
                  strokeDasharray={val === 50 ? "4 4" : "2 2"}
                  strokeWidth={val === 50 ? "1.2" : "1"}
                  strokeOpacity={val === 50 ? "1" : "0.6"}
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="monospace"
                  fill={val === 50 ? "#B8621B" : "#8A8D9F"}
                  fontWeight={val === 50 ? "bold" : "normal"}
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Passing reference label */}
          <text
            x={width - padding.right}
            y={padding.top + graphHeight * 0.5 - 5}
            textAnchor="end"
            fontSize="9"
            fill="#B8621B"
            fontWeight="600"
          >
            Passing Threshold (50%)
          </text>

          {/* Area Fill */}
          <path d={areaString} fill={`url(#candGrad-${id})`} />

          {/* Curve Stroke */}
          <path
            d={pathString}
            fill="none"
            stroke="#B8621B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {coords.map((c, idx) => {
            const isHovered = hoverIndex === idx;
            const passed = c.point.passed;

            return (
              <circle
                key={idx}
                cx={c.x}
                cy={c.y}
                r={isHovered ? 6 : 4.5}
                fill={passed ? "#B8621B" : "#262A56"}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer drop-shadow-sm"
              />
            );
          })}

          {/* X Axis Labels */}
          {coords.map((c, idx) => {
            const dateStr = new Date(c.point.submittedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <text
                key={idx}
                x={c.x}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#8A8D9F"
                fontWeight="500"
              >
                {dateStr}
              </text>
            );
          })}

          {/* Active Hover Guide */}
          {activeCoord && (
            <g>
              <line
                x1={activeCoord.x}
                y1={padding.top}
                x2={activeCoord.x}
                y2={padding.top + graphHeight}
                stroke="#262A56"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeCoord && (
          <div
            className="pointer-events-none absolute top-2 z-20 flex -translate-x-1/2 flex-col rounded-xl border border-[#E6DCD0] bg-white/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md"
            style={{
              left: `${(activeCoord.x / width) * 100}%`,
            }}
          >
            <div className="flex items-center gap-1.5 font-bold text-[#111322]">
              <SparkleIcon weight="fill" className="size-3 text-[#B8621B]" />
              <span className="truncate max-w-[180px]">
                {activeCoord.point.assessment.title}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between gap-3 text-[11px]">
              <span className="text-[#5A5D70]">Score:</span>
              <span className="font-mono font-bold text-[#B8621B]">
                {activeCoord.point.percentage.toFixed(1)}% ({activeCoord.point.score} pts)
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold">
              {activeCoord.point.passed ? (
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircleIcon className="size-3" weight="bold" />
                  Passed Threshold
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-700">
                  <XCircleIcon className="size-3" weight="bold" />
                  Below Passing
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Insight */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E6DCD0]/60 pt-3 text-[11px] text-[#5A5D70]">
        <span className="flex items-center gap-1 font-medium text-emerald-700">
          <CheckCircleIcon className="size-3.5" weight="bold" />
          Verified scoring rubrics applied
        </span>
        <span className="font-mono text-[#262A56] font-semibold">
          {points.length} evaluations recorded
        </span>
      </div>
    </div>
  );
}
