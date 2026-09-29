"use client";

import Link from "next/link";
import { ChartLineUpIcon, PlayIcon } from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { useAttemptHistory } from "../hooks/use-attempt-history";
import { ATTEMPT_STATUS_META } from "../constants/assessment.constants";
import { formatDate } from "../utils/date-format";
import type { AttemptHistoryDto } from "../types/candidate-assessments.dto";
import { StatusBadge } from "./status-badge";

export function AttemptHistoryPage() {
  const { data, isLoading, isError } = useAttemptHistory();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <div className="h-7 w-40 animate-pulse rounded-none bg-muted" />
        <div className="h-28 animate-pulse rounded-none bg-muted" />
        <div className="h-28 animate-pulse rounded-none bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-none border border-destructive/40 bg-destructive/5 p-6 text-xs text-destructive">
        Failed to load your attempts. Please try again.
      </div>
    );
  }

  const items = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Attempt History
      </h1>

      {items.length === 0 ? (
        <div className="rounded-none border border-dashed p-8 text-center">
          <p className="text-sm font-medium text-foreground">No attempts yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start an assessment and it will show up here.
          </p>
        </div>
      ) : (
        items.map((item) => <AttemptHistoryCard key={item.id} data={item} />)
      )}
    </div>
  );
}

function AttemptHistoryCard({ data }: { data: AttemptHistoryDto }) {
  const meta = ATTEMPT_STATUS_META[data.status];
  const isActive = data.status === "IN_PROGRESS";
  const hasResult = data.status === "SUBMITTED" || data.status === "EVALUATED";

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{data.assessment.title}</CardTitle>
          <StatusBadge label={meta.label} variant={meta.variant} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Started: {formatDate(data.startedAt)}</span>
          {data.submittedAt ? (
            <span>Submitted: {formatDate(data.submittedAt)}</span>
          ) : null}
        </div>

        {hasResult ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="text-muted-foreground">
              Score:{" "}
              <span className="font-semibold text-foreground">
                {data.score ?? "—"}
              </span>
            </span>
            <span className="text-muted-foreground">
              Percentage:{" "}
              <span className="font-semibold text-foreground">
                {data.percentage !== null ? `${data.percentage.toFixed(1)}%` : "—"}
              </span>
            </span>
            {data.passed !== null ? (
              <span className="text-muted-foreground">
                Result:{" "}
                <span
                  className={`font-semibold ${data.passed ? "text-primary" : "text-destructive"}`}
                >
                  {data.passed ? "Passed" : "Failed"}
                </span>
              </span>
            ) : null}
          </div>
        ) : null}
      </CardContent>

      {isActive || hasResult ? (
        <CardFooter>
          {isActive ? (
            <Button
              size="sm"
              render={<Link href={ROUTES.candidateAttempt(data.id)} />}
            >
              <PlayIcon className="size-4" />
              Resume
            </Button>
          ) : (
            <Button
              size="sm"
              render={<Link href={ROUTES.candidateResult(data.id)} />}
            >
              <ChartLineUpIcon className="size-4" />
              View result
            </Button>
          )}
        </CardFooter>
      ) : null}
    </Card>
  );
}
