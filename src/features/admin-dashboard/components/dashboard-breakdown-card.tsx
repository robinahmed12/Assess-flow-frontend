"use client";

import type { Icon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import type { AdminDashboardBreakdownRow } from "../types/admin-dashboard.dto";

export interface DashboardBreakdownCardProps {
  title: string;
  total: number;
  rows: AdminDashboardBreakdownRow[];
  icon?: Icon;
  subtitle?: string;
  badge?: string;
}

const ROW_BAR_COLORS = [
  "bg-[#262A56]", // Royal Navy
  "bg-[#B8621B]", // Warm Amber
  "bg-[#C88A4B]", // Sand Amber
  "bg-[#5A5D70]", // Muted Slate
  "bg-[#111322]", // Obsidian
] as const;

export function DashboardBreakdownCard({
  title,
  total,
  rows,
  icon: Icon,
  subtitle,
  badge,
}: DashboardBreakdownCardProps) {
  return (
    <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
        <div className="flex items-center gap-2">
          {Icon && (
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#262A56] ring-1 ring-[#E6DCD0]">
              <Icon className="size-4" />
            </span>
          )}
          <div>
            <CardTitle className="font-heading text-sm font-bold text-[#111322] sm:text-base">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="mt-0.5 text-xs text-[#5A5D70]">{subtitle}</p>
            )}
          </div>
        </div>

        {badge ? (
          <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[11px] font-bold text-[#262A56] ring-1 ring-[#E6DCD0]">
            {badge}
          </span>
        ) : (
          <span className="font-mono text-xs font-bold text-[#8A8D9F]">
            {total} Total
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-3.5 p-0 pt-4">
        {rows.map((row, index) => {
          const percent = total > 0 ? Math.round((row.value / total) * 100) : 0;
          const barColor = ROW_BAR_COLORS[index % ROW_BAR_COLORS.length];

          return (
            <div key={row.label} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-medium text-[#111322]">{row.label}</span>
                <span className="font-mono font-bold text-[#111322] tabular-nums">
                  {row.value}
                  <span className="ml-1.5 text-[10px] font-semibold text-[#8A8D9F]">
                    ({percent}%)
                  </span>
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF8F5] ring-1 ring-[#E6DCD0]/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{
                    width: `${Math.max(percent, row.value > 0 ? 3 : 0)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
