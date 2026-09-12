import type { ReactNode } from "react";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import type { DashboardRole } from "./dashboard-nav";

export function DashboardLayout({
  children,
  role,
}: {
  children: ReactNode;
  role: DashboardRole;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:block">
        <DashboardSidebar role={role} />
      </aside>

      <div className="flex flex-1 flex-col">
        <DashboardHeader role={role} />

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}