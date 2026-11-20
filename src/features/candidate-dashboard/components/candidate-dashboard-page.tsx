"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  ClipboardTextIcon,
  ClockIcon,
  FileTextIcon,
  LightningIcon,
  SparkleIcon,
  WarningIcon,
  XCircleIcon,
  type Icon,
} from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { useMe } from "@/src/features/auth/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/src/shared/components/ui/alert";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { CandidatePerformanceChart } from "./charts/candidate-performance-chart";
import { CandidateStatusChart } from "./charts/candidate-status-chart";
import { useCandidateDashboard } from "../hooks/use-candidate-dashboard";

const countFormatter = new Intl.NumberFormat("en-US");

function formatCount(value: number): string {
  return countFormatter.format(value);
}

function CandidateDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white p-5" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="h-84 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white lg:col-span-7" />
        <div className="h-84 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white lg:col-span-5" />
      </div>

      <div className="h-72 animate-pulse rounded-2xl border border-[#E6DCD0] bg-white" />
    </div>
  );
}

interface CandidateStatCardProps {
  title: string;
  value: number | string;
  icon: Icon;
  hint?: string;
  trend?: string;
  tone?: "navy" | "amber" | "emerald" | "default";
  href?: string;
}

function CandidateStatCard({
  title,
  value,
  icon: Icon,
  hint,
  trend,
  tone = "default",
  href,
}: CandidateStatCardProps) {
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

export function CandidateDashboardPage() {
  const { data, isLoading, error, refetch, isFetching } = useCandidateDashboard();
  const meQuery = useMe();
  const candidateName = meQuery.data?.name ?? "Candidate";

  if (isLoading) {
    return (
      <div role="candidate">
        <CandidateDashboardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div role="candidate" className="py-8">
        <Alert variant="destructive" className="rounded-2xl">
          <WarningIcon className="size-5" />
          <AlertTitle>Could not load candidate workspace</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load candidate dashboard data."}
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
    overview,
    attemptBreakdown,
    upcomingAssessments,
    recentAttempts,
    performanceTrend,
  } = data;

  return (
    <div role="candidate" className="space-y-7 pb-10">
      {/* ================= 1. CANDIDATE EXECUTIVE HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E6DCD0]/70 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#262A56] text-[#E3CCAE] shadow-xs">
              <SparkleIcon className="size-4" weight="bold" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#B8621B]">
              Welcome, {candidateName}
            </span>
          </div>
          <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-[#111322] sm:text-3xl">
            Candidate Assessment Studio
          </h1>
          <p className="mt-0.5 text-xs text-[#5A5D70] sm:text-sm">
            Track your coding assessments, monitor grading velocity, and inspect auto-scored reports.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            className="bg-[#B8621B] text-xs font-bold text-white shadow-xs transition-all hover:bg-[#9B5115] hover:shadow-md"
            render={<Link href={ROUTES.candidateAssessments} />}
          >
            <ClipboardTextIcon weight="bold" className="size-3.5" />
            View Available Tests
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
        <CandidateStatCard
          title="Total Assignments"
          value={formatCount(overview.totalAssignments)}
          icon={ClipboardTextIcon}
          tone="navy"
          hint={`${overview.pendingInvitations} invitations pending`}
          trend={`${overview.acceptedInvitations} accepted`}
          href={ROUTES.candidateAssessments}
        />

        <CandidateStatCard
          title="Tests Completed"
          value={formatCount(overview.completedAttempts)}
          icon={CheckCircleIcon}
          tone="amber"
          hint={`${overview.inProgressAttempts} in-progress sessions`}
          trend={`${overview.completionRate}% completion`}
          href={ROUTES.candidateAttempts}
        />

        <CandidateStatCard
          title="Performance Average"
          value={`${overview.averagePercentage.toFixed(1)}%`}
          icon={SparkleIcon}
          tone="emerald"
          hint={`${overview.averageScore.toFixed(1)} avg points`}
          trend={`${overview.passedAttempts} passed / ${overview.failedAttempts} failed`}
        />

        <CandidateStatCard
          title="Qualification Rate"
          value={`${overview.passRate.toFixed(1)}%`}
          icon={ChartLineUpIcon}
          tone="default"
          hint={`${overview.visibleResults} reports available`}
          trend={`${overview.startRate}% turnout`}
        />
      </section>

      {/* ================= 3. PRIMARY ANALYTICS & INTERACTIVE CHARTS ================= */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <CandidatePerformanceChart
            performanceTrend={performanceTrend}
            averagePercentage={overview.averagePercentage}
          />
        </div>

        <div className="lg:col-span-5">
          <CandidateStatusChart
            inProgress={attemptBreakdown.inProgress}
            submitted={attemptBreakdown.submitted}
            evaluated={attemptBreakdown.evaluated}
            expired={attemptBreakdown.expired}
            total={overview.totalAttempts}
          />
        </div>
      </section>

      {/* ================= 4. RECENT ASSESSMENT ATTEMPTS FEED ================= */}
      <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#262A56] ring-1 ring-[#E6DCD0]">
              <FileTextIcon className="size-4" />
            </span>
            <div>
              <CardTitle className="font-heading text-sm font-bold text-[#111322] sm:text-base">
                Recent Assessment Attempts
              </CardTitle>
              <p className="mt-0.5 text-xs text-[#5A5D70]">
                Your test submissions, active sessions, and grading outcomes
              </p>
            </div>
          </div>

          <Link
            href={ROUTES.candidateAttempts}
            className="text-xs font-bold text-[#B8621B] hover:underline"
          >
            All Attempts ({overview.totalAttempts}) →
          </Link>
        </CardHeader>

        <CardContent className="p-0 pt-4">
          {recentAttempts.length === 0 ? (
            <div className="py-12 text-center">
              <ClipboardTextIcon className="mx-auto size-8 text-[#8A8D9F]/60" />
              <p className="mt-2 text-xs font-semibold text-[#111322]">
                No assessment attempts recorded yet
              </p>
              <p className="mt-0.5 text-[11px] text-[#5A5D70]">
                Explore your assigned tests and initiate a coding session to begin.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E6DCD0]/60">
              {recentAttempts.map((attempt) => {
                const isEvaluated = attempt.status === "EVALUATED";
                const isSubmitted = attempt.status === "SUBMITTED";
                const isInProgress = attempt.status === "IN_PROGRESS";
                const hasPassed = attempt.passed === true;
                const hasFailed = attempt.passed === false;

                const submittedDate = attempt.submittedAt
                  ? new Date(attempt.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "In Progress";

                return (
                  <div
                    key={attempt.id}
                    className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between px-2.5 rounded-xl transition-colors hover:bg-[#FAF8F5]/60"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-xs font-bold text-[#111322] sm:text-sm">
                          {attempt.assessment.title}
                        </span>
                        <span className="flex items-center gap-1 rounded-md bg-[#FAF8F5] px-1.5 py-0.5 text-[10px] font-medium text-[#5A5D70] ring-1 ring-[#E6DCD0]/60">
                          <ClockIcon className="size-3 text-[#B8621B]" />
                          {attempt.assessment.duration} mins
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[#8A8D9F]">
                        Submitted: {submittedDate} &bull; Started:{" "}
                        {new Date(attempt.startedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 shrink-0">
                      {/* Qualification Badge */}
                      {isEvaluated && hasPassed && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                          <CheckCircleIcon className="size-3.5" weight="bold" />
                          Passed
                        </span>
                      )}
                      {isEvaluated && hasFailed && (
                        <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200">
                          <XCircleIcon className="size-3.5" weight="bold" />
                          Below Passing
                        </span>
                      )}
                      {isSubmitted && (
                        <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[10px] font-bold text-[#8A8D9F] ring-1 ring-[#E6DCD0]">
                          Under Review
                        </span>
                      )}
                      {isInProgress && (
                        <span className="rounded-full bg-[#262A56]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#262A56] ring-1 ring-[#262A56]/20 animate-pulse">
                          Live Session
                        </span>
                      )}

                      {/* Score metrics */}
                      {attempt.percentage !== null && (
                        <div className="text-right">
                          <span className="font-mono text-xs font-extrabold text-[#111322]">
                            {attempt.percentage.toFixed(1)}%
                          </span>
                          {attempt.score !== null && (
                            <p className="text-[10px] text-[#8A8D9F]">
                              {attempt.score} pts
                            </p>
                          )}
                        </div>
                      )}

                      {/* Direct CTA */}
                      {attempt.resultAvailable ? (
                        <Button
                          size="xs"
                          className="bg-[#262A56] text-xs font-bold text-[#E3CCAE] hover:bg-[#181B38]"
                          render={<Link href={ROUTES.candidateResult(attempt.id)} />}
                        >
                          View Report
                          <ArrowRightIcon className="size-3" weight="bold" />
                        </Button>
                      ) : isInProgress ? (
                        <Button
                          size="xs"
                          className="bg-[#B8621B] text-xs font-bold text-white hover:bg-[#9B5115]"
                          render={<Link href={ROUTES.candidateAttempt(attempt.id)} />}
                        >
                          Resume
                          <ArrowRightIcon className="size-3" weight="bold" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= 5. UPCOMING ASSIGNMENTS & INTEGRITY ================= */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Left: Upcoming Assignments */}
        <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#B8621B] ring-1 ring-[#E6DCD0]">
                <LightningIcon className="size-4" weight="fill" />
              </span>
              <div>
                <CardTitle className="font-heading text-sm font-bold text-[#111322] sm:text-base">
                  Upcoming &amp; Pending Tests
                </CardTitle>
                <p className="mt-0.5 text-xs text-[#5A5D70]">
                  Invitations waiting for you to take
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.candidateAssessments}
              className="text-xs font-bold text-[#B8621B] hover:underline"
            >
              All Tests →
            </Link>
          </CardHeader>

          <CardContent className="p-0 pt-4">
            {upcomingAssessments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#E6DCD0] bg-[#FAF8F5]/60 p-6 text-center">
                <CheckCircleIcon className="mx-auto size-7 text-emerald-600" weight="bold" />
                <p className="mt-2 text-xs font-bold text-[#111322]">
                  All Caught Up!
                </p>
                <p className="mt-0.5 text-[11px] text-[#5A5D70]">
                  You have no pending test invitations waiting. Explore assigned tests or check back when a recruiter sends an invite.
                </p>
                <Button
                  size="xs"
                  variant="outline"
                  className="mt-3 border-[#E6DCD0] bg-white text-xs font-semibold text-[#262A56]"
                  render={<Link href={ROUTES.candidateAssessments} />}
                >
                  Browse Assessment Library
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssessments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-[#E6DCD0] bg-[#FAF8F5] p-3.5 transition-all hover:border-[#B8621B]/60"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#111322]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#8A8D9F]">
                        Duration: {item.duration} minutes
                      </p>
                    </div>

                    <Button
                      size="xs"
                      className="bg-[#B8621B] text-xs font-bold text-white hover:bg-[#9B5115]"
                      render={<Link href={ROUTES.candidateAttempt(item.id)} />}
                    >
                      Start Assessment
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Security & Autosave Confidence */}
        <Card className="rounded-2xl border border-[#E6DCD0] bg-white p-5 shadow-xs flex flex-col justify-between lg:col-span-5">
          <div>
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-[#E6DCD0]/60">
              <span className="font-heading text-sm font-bold text-[#111322]">
                Testing Environment Protocols
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                Live &bull; Active
              </span>
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#262A56] text-[#E3CCAE]">
                  <LightningIcon className="size-3.5" weight="fill" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#111322]">Continuous Real-Time Autosave</p>
                  <p className="text-[11px] text-[#5A5D70]">
                    Every keystroke in the code editor is saved instantly. Accidental browser closures will never lose your progress.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#B8621B] text-white">
                  <SparkleIcon className="size-3.5" weight="fill" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#111322]">Zero-Latency Automated Grading</p>
                  <p className="text-[11px] text-[#5A5D70]">
                    Test cases and code execution rubrics evaluate submissions with zero bias and immediate score availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6DCD0]/60 text-center">
            <Link
              href={ROUTES.candidateAttempts}
              className="text-xs font-bold text-[#B8621B] hover:underline"
            >
              Review all completed attempt transcripts →
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
