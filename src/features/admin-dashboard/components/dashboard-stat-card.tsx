"use client";

import Link from "next/link";
import { ArrowUpRightIcon, type Icon } from "@phosphor-icons/react";

import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

export type DashboardStatTone =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "navy"
  | "amber";

const TONE_STYLES: Record<
  DashboardStatTone,
  {
    iconBg: string;
    iconColor: string;
    borderHover: string;
    badgeBg: string;
  }
> = {
  navy: {
    iconBg: "bg-[#262A56] text-[#E3CCAE]",
    iconColor: "text-[#E3CCAE]",
    borderHover: "hover:border-[#262A56]/60",
    badgeBg: "bg-[#262A56]/10 text-[#262A56]",
  },
  amber: {
    iconBg: "bg-[#B8621B] text-white",
    iconColor: "text-white",
    borderHover: "hover:border-[#B8621B]/60",
    badgeBg: "bg-[#B8621B]/10 text-[#B8621B]",
  },
  default: {
    iconBg: "bg-[#FAF8F5] text-[#262A56] border border-[#E6DCD0]",
    iconColor: "text-[#262A56]",
    borderHover: "hover:border-[#B8621B]/40",
    badgeBg: "bg-[#FAF8F5] text-[#5A5D70]",
  },
  success: {
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderHover: "hover:border-emerald-500/50",
    badgeBg: "bg-emerald-500/10 text-emerald-600",
  },
  warning: {
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderHover: "hover:border-amber-500/50",
    badgeBg: "bg-amber-500/10 text-amber-600",
  },
  danger: {
    iconBg: "bg-destructive/15 text-destructive",
    iconColor: "text-destructive",
    borderHover: "hover:border-destructive/50",
    badgeBg: "bg-destructive/10 text-destructive",
  },
  info: {
    iconBg: "bg-[#262A56] text-[#E3CCAE]",
    iconColor: "text-[#E3CCAE]",
    borderHover: "hover:border-[#262A56]/60",
    badgeBg: "bg-[#262A56]/10 text-[#262A56]",
  },
};

export interface DashboardStatCardProps {
  title: string;
  value: number | string;
  icon: Icon;
  hint?: string;
  trend?: string;
  tone?: DashboardStatTone;
  href?: string;
  subtitle?: string;
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  hint,
  trend,
  tone = "default",
  href,
  subtitle,
}: DashboardStatCardProps) {
  const styles = TONE_STYLES[tone] ?? TONE_STYLES.default;

  const cardContent = (
    <Card
      className={`relative overflow-hidden rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles.borderHover}`}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D9F]">
              {title}
            </p>
            <p className="font-heading text-2xl font-extrabold tracking-tight text-[#111322] tabular-nums sm:text-3xl">
              {value}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105 ${styles.iconBg}`}
            >
              <Icon className="size-5" />
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#E6DCD0]/60 pt-2.5 text-[11px]">
          {hint ? (
            <span className="font-medium text-[#5A5D70]">{hint}</span>
          ) : subtitle ? (
            <span className="text-[#8A8D9F]">{subtitle}</span>
          ) : (
            <span />
          )}

          {trend ? (
            <span
              className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-bold ${styles.badgeBg}`}
            >
              {trend}
            </span>
          ) : href ? (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-[#B8621B] group-hover:underline">
              <span>View</span>
              <ArrowUpRightIcon className="size-3" weight="bold" />
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  if (!href) return cardContent;

  return (
    <Link href={href} className="group block rounded-2xl focus-visible:outline-none">
      {cardContent}
    </Link>
  );
}

export function DashboardStatCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs">
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-24 rounded-md bg-[#FAF8F5]" />
            <Skeleton className="h-8 w-20 rounded-md bg-[#FAF8F5]" />
          </div>
          <Skeleton className="size-10 rounded-xl bg-[#FAF8F5]" />
        </div>
        <div className="mt-3 border-t border-[#E6DCD0]/60 pt-2.5">
          <Skeleton className="h-3 w-32 rounded-md bg-[#FAF8F5]" />
        </div>
      </CardContent>
    </Card>
  );
}
