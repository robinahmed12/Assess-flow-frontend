"use client";

import { useQuery } from "@tanstack/react-query";
import { evaluationApi } from "../api/evaluation.api";
import type { SubmissionsQueryDto } from "../types";

export function useSubmissions(
  assessmentId: string,
  params?: SubmissionsQueryDto,
) {
  return useQuery({
    queryKey: ["evaluation", "submissions", assessmentId, params],
    queryFn: () =>
      evaluationApi.submissions(assessmentId, params),
    enabled: Boolean(assessmentId),
  });
}