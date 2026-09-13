"use client";

import { CandidateAssessmentDto } from "../types/candidate-assessments.dto";

import { StatusBadge } from "./status-badge";

import { formatDate } from "../utils/date-format";

import { useStartAssessment } from "../hooks/use-start-assessment";

export function AssessmentCard({ data }: { data: CandidateAssessmentDto }) {
  const start = useStartAssessment();

  const canStart = !data.attempt && data.assessment.status === "PUBLISHED";

  const canResume = data.attempt?.status === "IN_PROGRESS";

  return (
    <div
      className="
rounded-xl
border
p-5
space-y-3
"
    >
      <div className="flex justify-between">
        <h2 className="font-semibold text-lg">{data.assessment.title}</h2>

        <StatusBadge status={data.status} />
      </div>

      <p>
        Duration:
        {data.assessment.duration} minutes
      </p>

      <p>
        Deadline:
        {formatDate(data.expiresAt)}
      </p>

      {data.attempt && <StatusBadge status={data.attempt.status} />}

      {canStart && (
        <button
          className="
rounded-md
bg-primary
text-primary-foreground
px-4
py-2
"
          onClick={() => start.mutate(data.assessment.id)}
        >
          Start
        </button>
      )}

      {canResume && (
        <button
          className="
rounded-md
bg-primary
text-primary-foreground
px-4
py-2
"
          onClick={() => start.mutate(data.assessment.id)}
        >
          Resume
        </button>
      )}
    </div>
  );
}
