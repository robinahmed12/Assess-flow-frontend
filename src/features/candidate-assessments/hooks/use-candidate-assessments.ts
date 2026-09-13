"use client";

import { useQuery } from "@tanstack/react-query";
import { candidateAssessmentsApi } from "../api/candidate-assessments.api";

export function useCandidateAssessments() {
  return useQuery({
    queryKey: ["candidate", "assessments"],
    queryFn: candidateAssessmentsApi.getAssessments,
  });
}
