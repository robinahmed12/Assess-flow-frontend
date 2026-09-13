"use client";

import { useAttemptHistory } from "../hooks/use-attempt-history";

import { StatusBadge } from "./status-badge";

import { formatDate } from "../utils/date-format";
import { AttemptHistoryDto } from "../types/candidate-assessments.dto";

export function AttemptHistoryPage() {
  const { data = [], isLoading } = useAttemptHistory();

  if (isLoading) return <div>Loading attempts...</div>;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Attempt History</h1>

      {data.map((attempt: AttemptHistoryDto) => (
        <div
          key={attempt.id}
          className="border rounded-xlp-5 space-y-3"
        >
          <h2 className="font-semibold">{attempt.assessment.title}</h2>

          <StatusBadge status={attempt.status} />

          <p>
            Started:
            {formatDate(attempt.startedAt)}
          </p>

          <p>
            Score:
            {attempt.score ?? "Not available"}
          </p>

          <p>
            Percentage:
            {attempt.percentage ?? "Not available"}%
          </p>
        </div>
      ))}
    </div>
  );
}
