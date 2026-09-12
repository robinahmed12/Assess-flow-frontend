import { DashboardLayout } from "@/src/shared/components/dashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="recruiter">{children}</DashboardLayout>;
}