"use client";

import { useQuery } from "@tanstack/react-query";
import { candidateAssessmentsApi } from "../api/candidate-assessments.api";

export function useAttemptHistory() {
  return useQuery({
    queryKey: ["attempts", "mine"],
    queryFn: candidateAssessmentsApi.getAttempts,
  });
}
