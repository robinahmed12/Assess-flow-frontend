"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import type { AdminDashboardBreakdownRow } from "../types/admin-dashboard.dto";

export interface DashboardBreakdownCardProps {
  title: string;
  total: number;
  rows: AdminDashboardBreakdownRow[];
}

const ROW_TONES = [
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-destructive",
  "bg-muted-foreground/50",
] as const;

export function DashboardBreakdownCard({
  title,
  total,
  rows,
}: DashboardBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {rows.map((row, index) => {
          const percent = total > 0 ? Math.round((row.value / total) * 100) : 0;

          return (
            <div key={row.label} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium tabular-nums">
                  {row.value}
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {percent}%</span>
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${ROW_TONES[index % ROW_TONES.length]}`}
                  style={{ width: `${Math.max(percent, row.value > 0 ? 2 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
