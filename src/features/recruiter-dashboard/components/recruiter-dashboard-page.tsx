"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { DashboardLayout } from "@/src/shared/components/dashboard";
import { useRecruiterDashboard } from "../hooks/use-recruiter-dashboard";

export function RecruiterDashboardPage() {
  const { data, isLoading, error } = useRecruiterDashboard();

  if (isLoading) {
    return (
      <div role="recruiter">
        <div className="py-10 text-center text-xs text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div role="recruiter">
        <div className="py-10 text-center text-xs text-muted-foreground">
          Failed to load dashboard
        </div>
      </div>
    );
  }

  const { company, overview, paymentSummary } = data;

  return (
    <div role="recruiter">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground">
              {company.name}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Recruiter overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Credits</span>
            <span className="font-heading text-lg font-semibold text-foreground">
              {company.creditsAvailable}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Assessments" value={overview.totalAssessments} />
          <StatCard
            label="Published"
            value={overview.publishedAssessments}
          />
          <StatCard label="Invitations" value={overview.totalInvitations} />
          <StatCard label="Attempts" value={overview.totalAttempts} />
          <StatCard
            label="In progress"
            value={overview.inProgressAttempts}
          />
          <StatCard
            label="Pending evaluation"
            value={overview.pendingEvaluations}
          />
          <StatCard label="Evaluated" value={overview.evaluatedAttempts} />
          <StatCard
            label="Pass rate"
            value={`${overview.passRate.toFixed(1)}%`}
          />
          <StatCard
            label="Average score"
            value={overview.averageScore.toFixed(1)}
          />
          <StatCard
            label="Average percentage"
            value={`${overview.averagePercentage.toFixed(1)}%`}
          />
          <StatCard label="Candidates passed" value={overview.passedAttempts} />
          <StatCard label="Candidates failed" value={overview.failedAttempts} />
          <StatCard
            label="Start rate"
            value={`${overview.candidateStartRate.toFixed(1)}%`}
          />
          <StatCard
            label="Submission rate"
            value={`${overview.submissionRate.toFixed(1)}%`}
          />
          <StatCard
            label="Evaluation rate"
            value={`${overview.evaluationRate.toFixed(1)}%`}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <BreakdownCard
            title="Assessments"
            items={[
              ["Draft", data.assessmentBreakdown.draft],
              ["Published", data.assessmentBreakdown.published],
              ["Closed", data.assessmentBreakdown.closed],
              ["Archived", data.assessmentBreakdown.archived],
            ]}
          />
          <BreakdownCard
            title="Invitations"
            items={[
              ["Pending", data.invitationBreakdown.pending],
              ["Accepted", data.invitationBreakdown.accepted],
              ["Expired", data.invitationBreakdown.expired],
              ["Revoked", data.invitationBreakdown.revoked],
            ]}
          />
          <BreakdownCard
            title="Attempts"
            items={[
              ["In progress", data.attemptBreakdown.inProgress],
              ["Submitted", data.attemptBreakdown.submitted],
              ["Evaluated", data.attemptBreakdown.evaluated],
              ["Expired", data.attemptBreakdown.expired],
            ]}
          />
        </div>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Successful</p>
              <p className="font-heading text-sm font-semibold text-foreground">
                {paymentSummary.successfulPayments}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total spent</p>
              <p className="font-heading text-sm font-semibold text-foreground">
                {paymentSummary.totalSpent.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Credits purchased
              </p>
              <p className="font-heading text-sm font-semibold text-foreground">
                {paymentSummary.creditsPurchased}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Assessment performance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {data.assessmentPerformance.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No evaluated attempts yet
                </p>
              ) : (
                data.assessmentPerformance.map((item) => (
                  <div
                    key={item.assessment.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {item.assessment.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.evaluatedAttempts} evaluated
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">
                        {item.averagePercentage.toFixed(1)}%
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        avg score {item.averageScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Recent submissions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {data.recentSubmissions.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No submissions yet
                </p>
              ) : (
                data.recentSubmissions.map((submission) => (
                  <div
                    key={submission.attemptId}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {submission.assessment.title}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {submission.candidate?.name ??
                          submission.candidateEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">
                        {submission.percentage !== null
                          ? `${submission.percentage.toFixed(1)}%`
                          : "—"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {submission.score !== null
                          ? `score ${submission.score.toFixed(1)}`
                          : submission.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-heading text-base font-semibold text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function BreakdownCard({
  title,
  items,
}: {
  title: string;
  items: [string, number][];
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-semibold text-foreground">
              {value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
