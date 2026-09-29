"use client";

import Link from "next/link";
import { ClockIcon, PlayIcon, ChartLineUpIcon } from "@phosphor-icons/react";

import { ROUTES } from "@/src/config/routes";
import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { useStartAssessment } from "../hooks/use-start-assessment";
import {
  ATTEMPT_STATUS_META,
  INVITATION_STATUS_META,
} from "../constants/assessment.constants";
import {
  getAssignmentAction,
  getAssignmentActionLabel,
} from "../utils/attempt-actions";
import { formatDate } from "../utils/date-format";
import type { CandidateAssessmentDto } from "../types/candidate-assessments.dto";
import { StatusBadge } from "./status-badge";

export function AssessmentCard({ data }: { data: CandidateAssessmentDto }) {
  const start = useStartAssessment();
  const action = getAssignmentAction(data);

  const invitationMeta = INVITATION_STATUS_META[data.status];
  const attemptMeta = data.attempt
    ? ATTEMPT_STATUS_META[data.attempt.status]
    : null;

  const targetHref =
    action === "start" || action === "resume"
      ? ROUTES.candidateAttempt(data.assessment.id)
      : action === "result" && data.attempt
        ? ROUTES.candidateResult(data.attempt.id)
        : null;

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{data.assessment.title}</CardTitle>
          <StatusBadge
            label={invitationMeta.label}
            variant={invitationMeta.variant}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {data.assessment.description ? (
          <p className="text-xs text-muted-foreground">
            {data.assessment.description}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="size-3.5" />
            {data.assessment.duration} minutes
          </span>
          <span>Deadline: {formatDate(data.expiresAt)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground">
            Assessment:
          </span>
          <StatusBadge
            label={data.assessment.status}
            variant={data.assessment.status === "PUBLISHED" ? "default" : "outline"}
          />
          {attemptMeta ? (
            <>
              <span className="text-[11px] font-medium text-muted-foreground">
                Attempt:
              </span>
              <StatusBadge label={attemptMeta.label} variant={attemptMeta.variant} />
            </>
          ) : null}
        </div>
      </CardContent>

      {action && targetHref ? (
        <CardFooter>
          {action === "start" || action === "resume" ? (
            <Button
              size="sm"
              disabled={start.isPending}
              onClick={() => start.mutate(data.assessment.id)}
            >
              {action === "start" ? (
                <PlayIcon className="size-4" />
              ) : (
                <ChartLineUpIcon className="size-4" />
              )}
              {getAssignmentActionLabel(action)}
            </Button>
          ) : (
            <Button size="sm" render={<Link href={targetHref} />}>
              <ChartLineUpIcon className="size-4" />
              {getAssignmentActionLabel(action)}
            </Button>
          )}
        </CardFooter>
      ) : null}
    </Card>
  );
}
