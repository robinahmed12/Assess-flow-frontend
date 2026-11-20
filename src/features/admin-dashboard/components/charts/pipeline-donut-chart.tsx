"use client";

import { useMemo, useState } from "react";
import { CheckCircleIcon, SparkleIcon } from "@phosphor-icons/react";

interface PipelineDonutChartProps {
  inProgress: number;
  submitted: number;
  evaluated: number;
  expired: number;
  total: number;
}

interface Segment {
  key: string;
  label: string;
  value: number;
  color: string;
  hoverColor: string;
  bgLight: string;
}

export function PipelineDonutChart({
  inProgress,
  submitted,
  evaluated,
  expired,
  total,
}: PipelineDonutChartProps) {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const segments: Segment[] = useMemo(() => {
    return [
      {
        key: "evaluated",
        label: "Evaluated & Graded",
        value: evaluated,
        color: "#B8621B", // Warm Amber
        hoverColor: "#9B5115",
        bgLight: "bg-[#B8621B]/15 text-[#B8621B]",
      },
      {
        key: "submitted",
        label: "Submitted (Pending)",
        value: submitted,
        color: "#C88A4B", // Sand Amber
        hoverColor: "#A36D33",
        bgLight: "bg-[#C88A4B]/15 text-[#C88A4B]",
      },
      {
        key: "inProgress",
        label: "Active In-Progress",
        value: inProgress,
        color: "#262A56", // Royal Navy
        hoverColor: "#181B38",
        bgLight: "bg-[#262A56]/15 text-[#262A56]",
      },
      {
        key: "expired",
        label: "Timed Out / Expired",
        value: expired,
        color: "#8A8D9F", // Muted Slate
        hoverColor: "#6B6E80",
        bgLight: "bg-[#8A8D9F]/15 text-[#8A8D9F]",
      },
    ];
  }, [inProgress, submitted, evaluated, expired]);

  const effectiveTotal = Math.max(total, 1);
  const completionRate = Math.round(
    ((evaluated + submitted) / effectiveTotal) * 100,
  );

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute offsets for each segment
  const calculatedSegments = useMemo(() => {
    let accumulatedPercent = 0;
    return segments.map((seg) => {
      const percent = total > 0 ? seg.value / total : 0;
      const strokeDasharray = `${percent * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedPercent * circumference;
      accumulatedPercent += percent;

      return {
        ...seg,
        percent: Math.round(percent * 100),
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [segments, total, circumference]);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E6DCD0]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#B8621B] text-[#FAF8F5] shadow-xs">
              <SparkleIcon className="size-4" weight="fill" />
            </span>
            <h3 className="font-heading text-sm font-bold text-[#111322] sm:text-base">
              Candidate Attempt Pipeline
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#5A5D70]">
            Lifecycle distribution of all test sessions
          </p>
        </div>

        <span className="rounded-full bg-[#FAF8F5] border border-[#E6DCD0] px-2.5 py-1 text-[11px] font-bold text-[#262A56]">
          {completionRate}% Turnout
        </span>
      </div>

      {/* Donut and Legend Grid */}
      <div className="my-auto flex flex-col items-center justify-center gap-6 py-4 sm:flex-row">
        {/* SVG Donut */}
        <div className="relative flex shrink-0 items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 transform"
          >
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#F3ECE2"
              strokeWidth={strokeWidth}
            />

            {/* Segment Arcs */}
            {calculatedSegments.map((seg) => {
              if (seg.value === 0) return null;
              const isHovered = activeSegment === seg.key;

              return (
                <circle
                  key={seg.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={isHovered ? seg.hoverColor : seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveSegment(seg.key)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              );
            })}
          </svg>

          {/* Central Metric */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold tracking-tight text-[#111322] font-mono">
              {total}
            </span>
            <span className="text-[10px] font-semibold text-[#8A8D9F] uppercase tracking-wider">
              Total Sessions
            </span>
          </div>
        </div>

        {/* Interactive Legend List */}
        <div className="w-full space-y-2">
          {calculatedSegments.map((seg) => {
            const isHovered = activeSegment === seg.key;

            return (
              <div
                key={seg.key}
                onMouseEnter={() => setActiveSegment(seg.key)}
                onMouseLeave={() => setActiveSegment(null)}
                className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 transition-colors cursor-pointer ${
                  isHovered ? "bg-[#FAF8F5] ring-1 ring-[#E6DCD0]" : "hover:bg-[#FAF8F5]/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="size-2.5 shrink-0 rounded-full transition-transform"
                    style={{
                      backgroundColor: seg.color,
                      transform: isHovered ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                  <span className="truncate text-xs font-medium text-[#111322]">
                    {seg.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-bold text-[#111322]">
                    {seg.value}
                  </span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${seg.bgLight}`}
                  >
                    {seg.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="flex items-center justify-between border-t border-[#E6DCD0]/60 pt-3 text-[11px] text-[#5A5D70]">
        <span className="flex items-center gap-1 font-medium text-emerald-700">
          <CheckCircleIcon className="size-3.5" weight="bold" />
          {evaluated} evaluated with auto-scoring
        </span>
        <span className="font-mono font-semibold text-[#262A56]">
          {inProgress} currently live
        </span>
      </div>
    </div>
  );
}
