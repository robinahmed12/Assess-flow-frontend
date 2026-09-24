"use client";

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments", "list"],
    queryFn: assessmentApi.list,
  });
}