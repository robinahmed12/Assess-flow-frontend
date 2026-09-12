"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartLineUpIcon } from "@phosphor-icons/react";

import { cn } from "@/src/shared/utils";
import { dashboardMenus, ROLE_LABELS, type DashboardRole } from "./dashboard-nav";

type DashboardSidebarProps = {
  role: DashboardRole;
  /** Called after a nav item is clicked — used to close the mobile sheet. */
  onNavigate?: () => void;
};

export function DashboardSidebar({ role, onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = dashboardMenus[role];

  return (
    <div className="flex h-full min-h-screen w-64 flex-col border-r bg-background">
      <Link href="/" className="flex h-16 items-center gap-2 border-b px-6">
        <span className="flex size-6 items-center justify-center rounded-none bg-primary">
          <ChartLineUpIcon className="size-3.5 text-primary-foreground" weight="bold" />
        </span>
        <span className="font-heading text-base font-semibold tracking-tight text-foreground">
          AssessFlow
        </span>
      </Link>

      <div className="px-6 pt-5 pb-1">
        <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          {ROLE_LABELS[role]} workspace
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-3">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-none px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <item.icon className="size-4 shrink-0" weight={isActive ? "fill" : "regular"} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-6 py-4">
        <p className="text-[11px] text-muted-foreground">AssessFlow &middot; v1.0</p>
      </div>
    </div>
  );
}