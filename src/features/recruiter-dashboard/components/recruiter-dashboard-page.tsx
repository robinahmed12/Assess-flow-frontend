"use client";

import Link from "next/link";
import {
  ArrowsClockwiseIcon,
  BuildingsIcon,
  CheckCircleIcon,
  ClipboardTextIcon,
  CreditCardIcon,
  FileTextIcon,
  LightningIcon,
  PaperPlaneTiltIcon,
  PlusIcon,
  SparkleIcon,
  UsersIcon,
  WarningIcon,
  XCircleIcon,
  type Icon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { Alert, AlertDescription, AlertTitle } from "@/src/shared/components/ui/alert";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { RecruiterFunnelChart } from "./charts/recruiter-funnel-chart";
import { RecruiterDonutChart } from "./charts/recruiter-donut-chart";
import { useRecruiterDashboard } from "../hooks/use-recruiter-dashboard";

const countFormatter = new Intl.NumberFormat("en-US");

function formatCount(value: number): string {
  return countFormatter.format(value);
}

function RecruiterDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white p-5" />
        ))}
      </div>

      {/* Chart Skeletons */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="h-84 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white lg:col-span-7" />
        <div className="h-84 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white lg:col-span-5" />
      </div>

      {/* Table Skeletons */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white" />
        <div className="h-72 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white" />
      </div>
    </div>
  );
}

interface RecruiterStatCardProps {
  title: string;
  value: number | string;
  icon: Icon;
  hint?: string;
  trend?: string;
  tone?: "navy" | "amber" | "emerald" | "default";
  href?: string;
}

function RecruiterStatCard({
  title,
  value,
  icon: Icon,
  hint,
  trend,
  tone = "default",
  href,
}: RecruiterStatCardProps) {
  const toneMap = {
    navy: {
      iconBg: "bg-[#262A56] text-[#E3CCAE]",
      borderHover: "hover:border-[#262A56]/60",
      badgeBg: "bg-[#262A56]/10 text-[#262A56]",
    },
    amber: {
      iconBg: "bg-[#B8621B] text-white",
      borderHover: "hover:border-[#B8621B]/60",
      badgeBg: "bg-[#B8621B]/10 text-[#B8621B]",
    },
    emerald: {
      iconBg: "bg-emerald-500/15 text-emerald-700",
      borderHover: "hover:border-emerald-500/50",
      badgeBg: "bg-emerald-500/10 text-emerald-700",
    },
    default: {
      iconBg: "bg-[#FAF8F5] text-[#262A56] border border-[#E6DCD0]",
      borderHover: "hover:border-[#B8621B]/40",
      badgeBg: "bg-[#FAF8F5] text-[#5A5D70]",
    },
  };

  const currentTone = toneMap[tone];

  const body = (
    <Card
      className={`relative overflow-hidden rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${currentTone.borderHover}`}
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

          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105 ${currentTone.iconBg}`}
          >
            <Icon className="size-5" />
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#E6DCD0]/60 pt-2.5 text-[11px]">
          <span className="font-medium text-[#5A5D70]">{hint}</span>
          {trend && (
            <span
              className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-bold ${currentTone.badgeBg}`}
            >
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!href) return body;

  return (
    <Link href={href} className="group block rounded-2xl focus-visible:outline-none">
      {body}
    </Link>
  );
}

export function RecruiterDashboardPage() {
  const { data, isLoading, error, refetch, isFetching } = useRecruiterDashboard();

  if (isLoading) {
    return (
      <div role="recruiter">
        <RecruiterDashboardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div role="recruiter" className="py-8">
        <Alert variant="destructive" className="rounded-2xl">
          <WarningIcon className="size-5" />
          <AlertTitle>Could not load recruiter workspace</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load dashboard data."}
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                className="text-xs"
              >
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const {
    company,
    overview,
    paymentSummary,
    assessmentBreakdown,
    invitationBreakdown,
    attemptBreakdown,
    recentSubmissions,
    assessmentPerformance,
  } = data;

  return (
    <div role="recruiter" className="space-y-7 pb-10">
      {/* ================= 1. RECRUITER EXECUTIVE HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E6DCD0]/70 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#262A56] text-[#E3CCAE] shadow-xs">
              <BuildingsIcon className="size-4" weight="bold" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#B8621B]">
              {company.name} Workspace
            </span>
          </div>
          <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-[#111322] sm:text-3xl">
            Recruiter Command Studio
          </h1>
          <p className="mt-0.5 text-xs text-[#5A5D70] sm:text-sm">
            Manage assessment creation, candidate invitations, and automated test evaluations.
          </p>
        </div>

        {/* Action Controls & Available Credits */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Credits Counter Card */}
          <Link
            href={ROUTES.recruiterBilling}
            className="group flex items-center gap-2.5 rounded-xl border border-[#E6DCD0] bg-white px-3.5 py-2 shadow-xs transition-all hover:border-[#B8621B] hover:shadow-md"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#B8621B] text-white">
              <LightningIcon weight="fill" className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base font-extrabold text-[#111322]">
                  {company.creditsAvailable}
                </span>
                <span className="text-[11px] font-bold uppercase text-[#8A8D9F]">
                  Credits
                </span>
              </div>
              <p className="text-[10px] text-[#B8621B] font-semibold group-hover:underline">
                Top up balance →
              </p>
            </div>
          </Link>

          <Button
            size="sm"
            className="bg-[#B8621B] text-xs font-bold text-white shadow-xs transition-all hover:bg-[#9B5115] hover:shadow-md"
            render={<Link href={ROUTES.recruiterAssessments} />}
          >
            <PlusIcon weight="bold" className="size-3.5" />
            Create Assessment
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="border-[#E6DCD0] bg-white text-xs font-semibold text-[#262A56] hover:bg-[#FAF8F5] shadow-xs"
          >
            <ArrowsClockwiseIcon
              className={isFetching ? "size-3.5 animate-spin text-[#B8621B]" : "size-3.5"}
              weight="bold"
            />
          </Button>
        </div>
      </div>

      {/* ================= 2. 4-METRIC EXECUTIVE KPI RIBBON ================= */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RecruiterStatCard
          title="Total Assessments"
          value={formatCount(overview.totalAssessments)}
          icon={ClipboardTextIcon}
          tone="navy"
          hint={`${overview.publishedAssessments} published & active`}
          trend={`${assessmentBreakdown.draft} in draft`}
          href={ROUTES.recruiterAssessments}
        />

        <RecruiterStatCard
          title="Candidate Invitations"
          value={formatCount(overview.totalInvitations)}
          icon={PaperPlaneTiltIcon}
          tone="amber"
          hint={`${overview.totalAttempts} attempts initiated`}
          trend={`${overview.candidateStartRate.toFixed(1)}% start rate`}
        />

        <RecruiterStatCard
          title="Qualification Rate"
          value={`${overview.passRate.toFixed(1)}%`}
          icon={CheckCircleIcon}
          tone="emerald"
          hint={`${overview.passedAttempts} passed / ${overview.failedAttempts} failed`}
          trend={`Avg: ${overview.averagePercentage.toFixed(1)}%`}
        />

        <RecruiterStatCard
          title="Evaluations Velocity"
          value={formatCount(overview.evaluatedAttempts)}
          icon={SparkleIcon}
          tone="default"
          hint={`${overview.pendingEvaluations} pending grading`}
          trend={`${overview.evaluationRate.toFixed(1)}% auto-scored`}
        />
      </section>

      {/* ================= 3. PRIMARY ANALYTICS & INTERACTIVE CHARTS ================= */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RecruiterFunnelChart
            totalInvitations={overview.totalInvitations}
            totalAttempts={overview.totalAttempts}
            submittedAttempts={attemptBreakdown.submitted + attemptBreakdown.evaluated}
            passedAttempts={overview.passedAttempts}
          />
        </div>

        <div className="lg:col-span-5">
          <RecruiterDonutChart
            inProgress={attemptBreakdown.inProgress}
            submitted={attemptBreakdown.submitted}
            evaluated={attemptBreakdown.evaluated}
            expired={attemptBreakdown.expired}
            total={overview.totalAttempts}
          />
        </div>
      </section>

      {/* ================= 4. RECENT CANDIDATE SUBMISSIONS & LEADERBOARD ================= */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Left: Recent Submissions Feed */}
        <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#262A56] ring-1 ring-[#E6DCD0]">
                <FileTextIcon className="size-4" />
              </span>
              <div>
                <CardTitle className="font-heading text-sm font-bold text-[#111322] sm:text-base">
                  Recent Candidate Submissions
                </CardTitle>
                <p className="mt-0.5 text-xs text-[#5A5D70]">
                  Latest test solutions submitted for review
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[11px] font-bold text-[#8A8D9F] ring-1 ring-[#E6DCD0]">
              {recentSubmissions.length} Recent
            </span>
          </CardHeader>

          <CardContent className="p-0 pt-4">
            {recentSubmissions.length === 0 ? (
              <div className="py-12 text-center">
                <UsersIcon className="mx-auto size-8 text-[#8A8D9F]/60" />
                <p className="mt-2 text-xs font-semibold text-[#111322]">
                  No candidate submissions recorded yet
                </p>
                <p className="mt-0.5 text-[11px] text-[#5A5D70]">
                  Dispatch candidate invitations from your active assessments to begin receiving test attempts.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E6DCD0]/60">
                {recentSubmissions.slice(0, 6).map((sub) => {
                  const candidateName = sub.candidate?.name ?? sub.candidateEmail.split("@")[0];
                  const hasPassed = sub.passed === true;
                  const hasFailed = sub.passed === false;

                  return (
                    <div
                      key={sub.attemptId}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-[#FAF8F5]/60 px-2 rounded-xl"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-xs font-bold text-[#111322]">
                            {candidateName}
                          </span>
                          <span className="truncate rounded-md bg-[#FAF8F5] px-1.5 py-0.5 text-[9px] font-medium text-[#5A5D70] ring-1 ring-[#E6DCD0]/60">
                            {sub.assessment.title}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-[#8A8D9F]">
                          {sub.candidateEmail} &bull; {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {hasPassed ? (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                            <CheckCircleIcon className="size-3" weight="bold" />
                            Passed
                          </span>
                        ) : hasFailed ? (
                          <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200">
                            <XCircleIcon className="size-3" weight="bold" />
                            Failed
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-[10px] font-bold text-[#8A8D9F] ring-1 ring-[#E6DCD0]">
                            {sub.status}
                          </span>
                        )}

                        <div className="text-right">
                          <span className="font-mono text-xs font-extrabold text-[#111322]">
                            {sub.percentage !== null ? `${sub.percentage.toFixed(1)}%` : "—"}
                          </span>
                          {sub.score !== null && (
                            <p className="text-[10px] text-[#8A8D9F]">Score {sub.score.toFixed(1)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Assessment Performance Leaderboard */}
        <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs lg:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#B8621B] ring-1 ring-[#E6DCD0]">
                <SparkleIcon className="size-4" weight="fill" />
              </span>
              <div>
                <CardTitle className="font-heading text-sm font-bold text-[#111322] sm:text-base">
                  Assessment Leaderboard
                </CardTitle>
                <p className="mt-0.5 text-xs text-[#5A5D70]">
                  Performance metrics by published test
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.recruiterAssessments}
              className="text-xs font-bold text-[#B8621B] hover:underline"
            >
              All Tests →
            </Link>
          </CardHeader>

          <CardContent className="p-0 pt-4">
            {assessmentPerformance.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#5A5D70]">
                No evaluated assessments available yet
              </div>
            ) : (
              <div className="space-y-3.5">
                {assessmentPerformance.slice(0, 5).map((item) => {
                  return (
                    <div key={item.assessment.id} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate font-semibold text-[#111322]">
                          {item.assessment.title}
                        </span>
                        <div className="flex items-center gap-2 font-mono shrink-0">
                          <span className="text-[11px] text-[#8A8D9F]">
                            {item.evaluatedAttempts} tests
                          </span>
                          <span className="font-bold text-[#B8621B]">
                            {item.averagePercentage.toFixed(1)}% avg
                          </span>
                        </div>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF8F5] ring-1 ring-[#E6DCD0]/50">
                        <div
                          className="h-full rounded-full bg-[#B8621B] transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(item.averagePercentage, 4))}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ================= 5. BREAKDOWN FUNNELS & OPERATIONAL PIPELINES ================= */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Assessment Breakdown */}
        <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
            <span className="font-heading text-sm font-bold text-[#111322]">
              Assessment Portfolio
            </span>
            <span className="font-mono text-xs font-bold text-[#8A8D9F]">
              {overview.totalAssessments} Total
            </span>
          </CardHeader>
          <CardContent className="space-y-3 p-0 pt-4">
            {[
              { label: "Published & Active", count: assessmentBreakdown.published, color: "bg-[#262A56]" },
              { label: "Draft (Editing)", count: assessmentBreakdown.draft, color: "bg-[#B8621B]" },
              { label: "Closed", count: assessmentBreakdown.closed, color: "bg-[#5A5D70]" },
              { label: "Archived", count: assessmentBreakdown.archived, color: "bg-[#8A8D9F]" },
            ].map((row) => {
              const pct = overview.totalAssessments > 0 ? Math.round((row.count / overview.totalAssessments) * 100) : 0;
              return (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#5A5D70]">{row.label}</span>
                    <span className="font-mono font-bold text-[#111322]">
                      {row.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#FAF8F5] overflow-hidden ring-1 ring-[#E6DCD0]/50">
                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Invitation Breakdown */}
        <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
            <span className="font-heading text-sm font-bold text-[#111322]">
              Candidate Invitations
            </span>
            <span className="font-mono text-xs font-bold text-[#8A8D9F]">
              {overview.totalInvitations} Dispatched
            </span>
          </CardHeader>
          <CardContent className="space-y-3 p-0 pt-4">
            {[
              { label: "Accepted & Started", count: invitationBreakdown.accepted, color: "bg-emerald-600" },
              { label: "Pending Response", count: invitationBreakdown.pending, color: "bg-[#B8621B]" },
              { label: "Expired", count: invitationBreakdown.expired, color: "bg-[#8A8D9F]" },
              { label: "Revoked", count: invitationBreakdown.revoked, color: "bg-rose-500" },
            ].map((row) => {
              const pct = overview.totalInvitations > 0 ? Math.round((row.count / overview.totalInvitations) * 100) : 0;
              return (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#5A5D70]">{row.label}</span>
                    <span className="font-mono font-bold text-[#111322]">
                      {row.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#FAF8F5] overflow-hidden ring-1 ring-[#E6DCD0]/50">
                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Billing & Credit Account Card */}
        <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
              <span className="font-heading text-sm font-bold text-[#111322]">
                Credit Ledger &amp; Billing
              </span>
              <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-[10px] font-bold text-[#262A56] ring-1 ring-[#E6DCD0]">
                {paymentSummary.successfulPayments} Orders
              </span>
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5A5D70]">Available Evaluation Credits:</span>
                <span className="font-mono font-bold text-[#B8621B]">{company.creditsAvailable}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5A5D70]">Total Purchased Credits:</span>
                <span className="font-mono font-bold text-[#111322]">{paymentSummary.creditsPurchased}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5A5D70]">Total Amount Invested:</span>
                <span className="font-mono font-bold text-[#262A56]">${paymentSummary.totalSpent.toFixed(2)}</span>
              </div>
            </CardContent>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6DCD0]/60">
            <Button
              size="sm"
              className="w-full justify-center bg-[#262A56] text-xs font-bold text-white hover:bg-[#181B38]"
              render={<Link href={ROUTES.recruiterBilling} />}
            >
              <CreditCardIcon className="size-3.5 text-[#E3CCAE]" />
              Manage Billing &amp; Invoices
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
