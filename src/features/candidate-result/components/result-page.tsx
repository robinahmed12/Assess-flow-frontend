"use client";

import { useCandidateResult } from "../hooks/use-candidate-result";
import type { CandidateResultDto } from "../types/candidate-result.dto";

export function CandidateResultPage({ attemptId }: { attemptId: string }) {
  const { data, isLoading, error } = useCandidateResult(attemptId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <div className="h-8 w-56 animate-pulse rounded-none bg-muted" />
        <div className="h-40 animate-pulse rounded-none bg-muted" />
      </div>
    );
  }

  if (error) {
    const status = (error as Error & { status?: number }).status;

    if (status === 403) {
      return (
        <div className="rounded-none border border-border bg-muted/40 p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            Result not available yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This result is hidden until the recruiter completes the review.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-none border border-destructive/40 bg-destructive/5 p-6 text-xs text-destructive">
        Result unavailable. It may not have been submitted yet.
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <ResultView data={data} />;
}

function ResultView({ data }: { data: CandidateResultDto }) {
  const isFinal = data.isFinal;
  const hasScores =
    data.totalScore !== null &&
    data.maxScore !== null &&
    data.percentage !== null &&
    data.passed !== null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {data.assessment.title}
          </h1>
          <span
            className={`rounded-none px-2 py-0.5 text-[10px] font-medium ${
              isFinal
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {isFinal ? "Final" : "Provisional"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Submitted {data.submittedAt ?? "—"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ScoreCard label="Score" value={hasScores ? `${data.totalScore}/${data.maxScore}` : "Pending"} />
        <ScoreCard
          label="Percentage"
          value={data.percentage !== null ? `${data.percentage.toFixed(1)}%` : "Pending"}
        />
        <ScoreCard
          label="Result"
          value={data.passed === null ? "Pending" : data.passed ? "Passed" : "Failed"}
          tone={data.passed === null ? "muted" : data.passed ? "success" : "failure"}
        />
        <ScoreCard label="Status" value={isFinal ? "Evaluated" : "Awaiting review"} />
      </div>

      {!isFinal ? (
        <div className="rounded-none border border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
          Your recruiter has not finalized this evaluation yet. Scores may
          change after review.
        </div>
      ) : null}

      {data.answers.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            Per-question breakdown
          </h2>
          {data.answers.map((answer) => (
            <div
              key={answer.id}
              className="flex items-center justify-between rounded-none border border-border px-4 py-2.5 text-xs"
            >
              <span className="text-muted-foreground">
                {answer.problemType} answer
              </span>
              <span className="font-semibold text-foreground">
                {answer.score !== null ? `${answer.score} pts` : "Not evaluated"}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ScoreCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "failure" | "muted";
}) {
  const tones: Record<string, string> = {
    default: "text-foreground",
    success: "text-primary",
    failure: "text-destructive",
    muted: "text-muted-foreground",
  };

  return (
    <div className="rounded-none border border-border p-4">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <p className={`mt-1 font-heading text-base font-semibold ${tones[tone]}`}>
        {value}
      </p>
    </div>
  );
}
