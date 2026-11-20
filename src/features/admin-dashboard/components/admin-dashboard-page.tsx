"use client";

import Link from "next/link";
import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  ClipboardTextIcon,
  CreditCardIcon,
  LightningIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  SparkleIcon,
  UsersIcon,
  WarningIcon,
} from "@phosphor-icons/react";

import { Alert, AlertDescription, AlertTitle } from "@/src/shared/components/ui/alert";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import {
  DashboardStatCard,
  DashboardStatCardSkeleton,
} from "./dashboard-stat-card";
import { DashboardBreakdownCard } from "./dashboard-breakdown-card";
import { ActivityAreaChart } from "./charts/activity-area-chart";
import { PipelineDonutChart } from "./charts/pipeline-donut-chart";
import { useAdminDashboard } from "../hooks/use-admin-dashboard";

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

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <DashboardStatCardSkeleton key={index} />
        ))}
      </div>

      {/* Chart Skeletons */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="h-80 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white lg:col-span-7" />
        <div className="h-80 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white lg:col-span-5" />
      </div>

      {/* Breakdown Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white"
          />
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data, isPending, isError, error, isFetching, refetch } =
    useAdminDashboard();

  const activeShare =
    data && data.users.total > 0
      ? Math.round((data.users.active / data.users.total) * 100)
      : 0;

  const paymentSuccessRate =
    data && data.payments.total > 0
      ? Math.round((data.payments.succeeded / data.payments.total) * 100)
      : 0;

  return (
    <div className="space-y-7 pb-10">
      {/* ================= 1. EXECUTIVE HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E6DCD0]/70 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#B8621B]">
              AssessFlow Executive Console
            </span>
          </div>
          <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-[#111322] sm:text-3xl">
            Admin Command Center
          </h1>
          <p className="mt-0.5 text-xs text-[#5A5D70] sm:text-sm">
            Unified telemetry across active users, testing pipelines, problem repositories &amp; transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-semibold text-[#8A8D9F] uppercase">
              System Telemetry
            </span>
            <span className="font-mono text-xs font-bold text-emerald-600">
              All Systems Operational
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="border-[#E6DCD0] bg-white text-xs font-semibold text-[#262A56] hover:bg-[#FAF8F5] hover:text-[#B8621B] shadow-xs"
          >
            <ArrowsClockwiseIcon
              className={isFetching ? "size-3.5 animate-spin text-[#B8621B]" : "size-3.5"}
              weight="bold"
            />
            <span>{isFetching ? "Refreshing..." : "Refresh Stats"}</span>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <Alert variant="destructive" className="rounded-2xl">
          <WarningIcon className="size-5" />
          <AlertTitle>Could not load live dashboard telemetry</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "An unexpected server error occurred."}
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                className="text-xs"
              >
                Retry connection
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isPending || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-7">
          {/* ================= 2. 4-METRIC EXECUTIVE KPI RIBBON ================= */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStatCard
              title="Platform Users"
              value={formatCount(data.users.total)}
              icon={UsersIcon}
              tone="navy"
              hint={`${activeShare}% active accounts`}
              trend={`${data.users.byRole.candidate} cand / ${data.users.byRole.recruiter} rec`}
              href="/admin/users"
            />

            <DashboardStatCard
              title="Financial Volume"
              value={`$${formatAmount(data.payments.successfulAmount)}`}
              icon={CreditCardIcon}
              tone="amber"
              hint={`${formatCount(data.payments.creditsPurchased)} credits purchased`}
              trend={`${paymentSuccessRate}% success rate`}
              href="/admin/payments"
            />

            <DashboardStatCard
              title="Assessments"
              value={formatCount(data.assessments.total)}
              icon={ClipboardTextIcon}
              tone="default"
              hint={`${data.assessments.published} published & live`}
              trend={`${data.problems.total} problem bank`}
            />

            <DashboardStatCard
              title="Test Attempts"
              value={formatCount(data.attempts.total)}
              icon={SparkleIcon}
              tone="amber"
              hint={`${data.attempts.inProgress} active sessions`}
              trend={`${data.attempts.evaluated} auto-scored`}
            />
          </section>

          {/* ================= 3. PRIMARY ANALYTICS & VISUAL CHARTS ================= */}
          <section className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ActivityAreaChart
                totalAssessments={data.assessments.total}
                totalAttempts={data.attempts.total}
              />
            </div>

            <div className="lg:col-span-5">
              <PipelineDonutChart
                inProgress={data.attempts.inProgress}
                submitted={data.attempts.submitted}
                evaluated={data.attempts.evaluated}
                expired={data.attempts.expired}
                total={data.attempts.total}
              />
            </div>
          </section>

          {/* ================= 4. BREAKDOWN FUNNELS & DEMOGRAPHICS ================= */}
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardBreakdownCard
              title="Assessment Lifecycle"
              subtitle="Current operational status of tests"
              total={data.assessments.total}
              icon={ClipboardTextIcon}
              rows={[
                { label: "Published & Active", value: data.assessments.published },
                { label: "Draft (In Preparation)", value: data.assessments.draft },
                { label: "Closed Sessions", value: data.assessments.closed },
                { label: "Archived Tests", value: data.assessments.archived },
              ]}
            />

            <DashboardBreakdownCard
              title="User Demographics"
              subtitle="Registered accounts by access role"
              total={data.users.total}
              icon={UsersIcon}
              rows={[
                { label: "Candidates", value: data.users.byRole.candidate },
                { label: "Recruiters & Evaluators", value: data.users.byRole.recruiter },
                { label: "System Administrators", value: data.users.byRole.admin },
                { label: "Active Status", value: data.users.active },
              ]}
            />

            <DashboardBreakdownCard
              title="Invitations & Pipeline"
              subtitle="Candidate test invitations dispatch"
              total={data.invitations.total}
              icon={SparkleIcon}
              rows={[
                { label: "Accepted & Started", value: data.invitations.accepted },
                { label: "Pending Invitations", value: data.invitations.pending },
                { label: "Revoked / Expired", value: data.invitations.revoked },
              ]}
            />
          </section>

          {/* ================= 5. MONETIZATION & PAYMENT HEALTH ================= */}
          <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-6 shadow-xs">
            <CardHeader className="p-0 pb-4 border-b border-[#E6DCD0]/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-[#B8621B] text-white shadow-xs">
                    <ReceiptIcon className="size-4.5" weight="bold" />
                  </span>
                  <div>
                    <CardTitle className="font-heading text-base font-bold text-[#111322]">
                      Monetization &amp; Credit Velocity
                    </CardTitle>
                    <p className="text-xs text-[#5A5D70]">
                      Captured payments, credit bundles, and multi-gateway settlements
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#FAF8F5] border border-[#E6DCD0] px-3 py-1 text-xs font-semibold text-[#262A56]">
                    Stripe (USD) &amp; bKash (BDT)
                  </span>
                  <Link
                    href="/admin/payments"
                    className="text-xs font-bold text-[#B8621B] hover:underline"
                  >
                    View payment ledger →
                  </Link>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-[#E6DCD0]/70 bg-[#FAF8F5]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D9F]">
                    Total Captured Volume
                  </p>
                  <p className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-[#111322] tabular-nums">
                    {formatAmount(data.payments.successfulAmount)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#5A5D70]">
                    Aggregated multi-provider gross receipts
                  </p>
                </div>

                <div className="rounded-xl border border-[#E6DCD0]/70 bg-[#FAF8F5]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D9F]">
                    Purchased Test Credits
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 font-heading text-2xl font-extrabold tracking-tight text-[#B8621B] tabular-nums">
                    <LightningIcon weight="fill" className="size-5" />
                    {formatCount(data.payments.creditsPurchased)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#5A5D70]">
                    1 credit = 1 candidate assessment evaluation
                  </p>
                </div>

                <div className="rounded-xl border border-[#E6DCD0]/70 bg-[#FAF8F5]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D9F]">
                    Successful Transactions
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="font-heading text-2xl font-extrabold tracking-tight text-emerald-600 tabular-nums">
                      {formatCount(data.payments.succeeded)}
                    </p>
                    <span className="text-xs font-semibold text-[#8A8D9F]">
                      of {formatCount(data.payments.total)} total
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#5A5D70]">
                    {paymentSuccessRate}% checkout completion rate
                  </p>
                </div>

                <div className="rounded-xl border border-[#E6DCD0]/70 bg-[#FAF8F5]/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D9F]">
                    Failed / Pending Attempts
                  </p>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-heading text-2xl font-extrabold tracking-tight text-rose-600 tabular-nums">
                      {formatCount(data.payments.failed)}
                    </span>
                    <span className="text-xs font-medium text-[#8A8D9F]">
                      ({data.payments.pending} pending)
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#5A5D70]">
                    No critical settlement backlog detected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ================= 6. ADMINISTRATIVE SHORTCUTS & SYSTEM GOVERNANCE ================= */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/users"
              className="group flex flex-col justify-between rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#262A56]/60 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#262A56] text-[#E3CCAE] shadow-xs">
                    <UsersIcon className="size-5" weight="bold" />
                  </span>
                  <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-[10px] font-bold text-[#262A56] ring-1 ring-[#E6DCD0]">
                    {data.users.total} Accounts
                  </span>
                </div>
                <h4 className="mt-3 font-heading text-sm font-bold text-[#111322] group-hover:text-[#B8621B] transition-colors">
                  User Management &amp; Access Control
                </h4>
                <p className="mt-1 text-xs text-[#5A5D70]">
                  Inspect roles, suspend accounts, and verify candidate access credentials.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#B8621B]">
                <span>Manage Users</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>

            <Link
              href="/admin/audit-logs"
              className="group flex flex-col justify-between rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#262A56]/60 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#262A56] text-[#E3CCAE] shadow-xs">
                    <ShieldCheckIcon className="size-5" weight="bold" />
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <CheckCircleIcon className="size-3" weight="bold" />
                    Audited
                  </span>
                </div>
                <h4 className="mt-3 font-heading text-sm font-bold text-[#111322] group-hover:text-[#B8621B] transition-colors">
                  Security Logs &amp; Integrity Audits
                </h4>
                <p className="mt-1 text-xs text-[#5A5D70]">
                  Review immutable event trails, test invitations, and system authentication events.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#B8621B]">
                <span>Inspect Logs</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>

            <Link
              href="/admin/payments"
              className="group flex flex-col justify-between rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#262A56]/60 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#B8621B] text-white shadow-xs">
                    <ReceiptIcon className="size-5" weight="bold" />
                  </span>
                  <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-[10px] font-bold text-[#B8621B] ring-1 ring-[#E6DCD0]">
                    {data.payments.total} Records
                  </span>
                </div>
                <h4 className="mt-3 font-heading text-sm font-bold text-[#111322] group-hover:text-[#B8621B] transition-colors">
                  Payment Ledger &amp; Billing
                </h4>
                <p className="mt-1 text-xs text-[#5A5D70]">
                  Reconcile credit purchases, Stripe webhooks, and bKash mobile payments.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#B8621B]">
                <span>View Transactions</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </div>

          {/* ================= 7. PLATFORM ARCHITECTURE STATUS ================= */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E6DCD0]/70 bg-[#FAF8F5] p-4 text-xs text-[#5A5D70]">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-[#B8621B]" weight="bold" />
              <span className="font-semibold text-[#111322]">Platform Integrity:</span>
              <span>TLS 1.3 Encryption &bull; Real-Time Autosave Active &bull; Role Redirection Enforced</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#8A8D9F]">
              <span>Problem Bank: {data.problems.total}</span>
              <span>&bull;</span>
              <span>Companies: {data.companies.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
