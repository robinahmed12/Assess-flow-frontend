import {
  BuildingsIcon,
  FileTextIcon,
  GaugeIcon,
  ListChecksIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  UsersIcon,
  type Icon,
} from "@phosphor-icons/react";

export type DashboardRole = "candidate" | "recruiter" | "admin";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: Icon;
};

export const ROLE_LABELS: Record<DashboardRole, string> = {
  candidate: "Candidate",
  recruiter: "Recruiter",
  admin: "Admin",
};

export const dashboardMenus: Record<DashboardRole, DashboardNavItem[]> = {
  candidate: [
    { title: "Dashboard", href: "/candidate/dashboard", icon: GaugeIcon },
    { title: "Assessments", href: "/candidate/assessments", icon: ListChecksIcon },
    { title: "Attempts", href: "/candidate/attempts", icon: FileTextIcon },
  ],

  recruiter: [
    { title: "Dashboard", href: "/recruiter/dashboard", icon: GaugeIcon },
    { title: "Problems", href: "/recruiter/problems", icon: FileTextIcon },
    { title: "Assessments", href: "/recruiter/assessments", icon: ListChecksIcon },
    { title: "Company", href: "/recruiter/company", icon: BuildingsIcon },
    { title: "Billing", href: "/recruiter/billing", icon: ReceiptIcon },
  ],

  admin: [
    { title: "Dashboard", href: "/admin/dashboard", icon: GaugeIcon },
    { title: "Users", href: "/admin/users", icon: UsersIcon },
    { title: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheckIcon },
    { title: "Payments", href: "/admin/payments", icon: ReceiptIcon },
  ],
};

/** Finds the nav item whose href best matches the current pathname (longest-prefix match). */
export function findActiveNavItem(role: DashboardRole, pathname: string): DashboardNavItem | undefined {
  return dashboardMenus[role]
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}