"use client";

import {
  AlertTriangle,
  Building2,
  CircleDollarSign,
  ClipboardList,
  FileQuestion,
  RefreshCw,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/src/shared/components/ui/alert";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import {
  DashboardStatCard,
  DashboardStatCardSkeleton,
  type DashboardStatTone,
} from "./dashboard-stat-card";
import { DashboardBreakdownCard } from "./dashboard-breakdown-card";
import { useAdminDashboard } from "../hooks/use-admin-dashboard";
import type { AdminDashboardDto } from "../types/admin-dashboard.dto";

const countFormatter = new Intl.NumberFormat("en-US");

function formatCount(value: number): string {
  return countFormatter.format(value);
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface PrimaryStat {
  title: string;
  value: number;
  icon: typeof Users;
  tone: DashboardStatTone;
  hint?: string;
  href?: string;
}

function buildPrimaryStats(data: AdminDashboardDto): PrimaryStat[] {
  const activeShare =
    data.users.total > 0 ? Math.round((data.users.active / data.users.total) * 100) : 0;

  return [
    {
      title: "Total users",
      value: data.users.total,
      icon: Users,
      tone: "info",
      hint: `${activeShare}% active`,
      href: "/admin/users",
    },
    {
      title: "Candidates",
      value: data.users.byRole.candidate,
      icon: Send,
      tone: "default",
    },
    {
      title: "Recruiters",
      value: data.users.byRole.recruiter,
      icon: ShieldCheck,
      tone: "default",
    },
    {
      title: "Companies",
      value: data.companies.total,
      icon: Building2,
      tone: "default",
    },
    {
      title: "Problems",
      value: data.problems.total,
      icon: FileQuestion,
      tone: "default",
    },
    {
      title: "Assessments",
      value: data.assessments.total,
      icon: ClipboardList,
      tone: "default",
      hint: `${data.assessments.published} published`,
    },
  ];
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <DashboardStatCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-52 animate-pulse rounded-xl border bg-muted/30" />
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data, isPending, isError, error, isFetching, refetch } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform-wide activity across users, content, assessments and payments.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
          Refresh
        </Button>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Could not load dashboard stats</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "An unexpected error occurred."}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => void refetch()}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : isPending || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {buildPrimaryStats(data).map((stat) => (
              <DashboardStatCard
                key={stat.title}
                title={stat.title}
                value={formatCount(stat.value)}
                icon={stat.icon}
                tone={stat.tone}
                hint={stat.hint}
                href={stat.href}
              />
            ))}
          </section>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payments overview</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total payments</p>
                <p className="text-2xl font-bold tabular-nums">
                  {formatCount(data.payments.total)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Captured amount</p>
                <p className="text-2xl font-bold tabular-nums">
                  {formatAmount(data.payments.successfulAmount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  USD and BDT combined, not a single currency total
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Credits purchased</p>
                <p className="flex items-center gap-2 text-2xl font-bold tabular-nums">
                  <CircleDollarSign className="size-5 text-muted-foreground" />
                  {formatCount(data.payments.creditsPurchased)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Failed payments</p>
                <p className="text-2xl font-bold tabular-nums">
                  {formatCount(data.payments.failed)}
                </p>
              </div>
            </CardContent>
          </Card>

          <section className="grid gap-4 lg:grid-cols-2">
            <DashboardBreakdownCard
              title="Assessment status"
              total={data.assessments.total}
              rows={[
                { label: "Draft", value: data.assessments.draft },
                { label: "Published", value: data.assessments.published },
                { label: "Closed", value: data.assessments.closed },
                { label: "Archived", value: data.assessments.archived },
              ]}
            />

            <DashboardBreakdownCard
              title="Invitation status"
              total={data.invitations.total}
              rows={[
                { label: "Pending", value: data.invitations.pending },
                { label: "Accepted", value: data.invitations.accepted },
                { label: "Revoked", value: data.invitations.revoked },
              ]}
            />

            <DashboardBreakdownCard
              title="Attempt status"
              total={data.attempts.total}
              rows={[
                { label: "In progress", value: data.attempts.inProgress },
                { label: "Submitted", value: data.attempts.submitted },
                { label: "Evaluated", value: data.attempts.evaluated },
                { label: "Expired", value: data.attempts.expired },
              ]}
            />

            <DashboardBreakdownCard
              title="Payment status"
              total={data.payments.total}
              rows={[
                { label: "Succeeded", value: data.payments.succeeded },
                { label: "Pending", value: data.payments.pending },
                { label: "Failed", value: data.payments.failed },
              ]}
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <DashboardBreakdownCard
              title="User accounts"
              total={data.users.total}
              rows={[
                { label: "Active", value: data.users.active },
                { label: "Suspended", value: data.users.suspended },
              ]}
            />

            <DashboardBreakdownCard
              title="Users by role"
              total={data.users.total}
              rows={[
                { label: "Candidates", value: data.users.byRole.candidate },
                { label: "Recruiters", value: data.users.byRole.recruiter },
                { label: "Admins", value: data.users.byRole.admin },
              ]}
            />
          </section>
        </div>
      )}
    </div>
  );
}
