import type { ComponentType } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

export type DashboardStatTone = "default" | "success" | "warning" | "danger" | "info";

const TONE_ICON_STYLES: Record<DashboardStatTone, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export interface DashboardStatCardProps {
  title: string;
  value: number | string;
  icon: ComponentType<{ className?: string }>;
  hint?: string;
  tone?: DashboardStatTone;
  href?: string;
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  hint,
  tone = "default",
  href,
}: DashboardStatCardProps) {
  const body = (
    <Card
      className={
        href
          ? "transition-colors hover:border-foreground/25 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          : undefined
      }
    >
      <CardContent className="flex items-start gap-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${TONE_ICON_STYLES[tone]}`}
        >
          <Icon className="size-5" />
        </span>

        <div className="min-w-0 space-y-0.5">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );

  if (!href) return body;

  return (
    <Link href={href} className="block rounded-xl focus-visible:outline-none">
      {body}
    </Link>
  );
}

export function DashboardStatCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
