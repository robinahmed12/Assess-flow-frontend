"use client";

import { useQuery } from "@tanstack/react-query";
import { evaluationApi } from "../api/evaluation.api";

export function useAssessmentReport(assessmentId: string) {
  return useQuery({
    queryKey: ["evaluation", "report", assessmentId],
    queryFn: () => evaluationApi.report(assessmentId),
    enabled: Boolean(assessmentId),
  });
}