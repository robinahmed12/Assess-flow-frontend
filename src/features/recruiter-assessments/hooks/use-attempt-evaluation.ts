"use client";

import { useQuery } from "@tanstack/react-query";
import { evaluationApi } from "../api/evaluation.api";

export const attemptEvaluationKey = (attemptId: string) =>
  ["evaluation", "attempt", attemptId] as const;

export function useAttemptEvaluation(attemptId: string) {
  return useQuery({
    queryKey: attemptEvaluationKey(attemptId),
    queryFn: () => evaluationApi.attemptEvaluation(attemptId),
    enabled: Boolean(attemptId),
  });
}