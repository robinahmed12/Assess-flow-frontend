"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { assessmentApi } from "../api/assessment.api";

export function useAssessmentDetail(id: string) {
  const query = useQuery({
    queryKey: ["assessments", "detail", id],
    queryFn: () => assessmentApi.get(id),
    enabled: Boolean(id),
  });

  const totalPoints = useMemo(
    () =>
      query.data?.problems.reduce(
        (sum, item) => sum + (item.problem.points ?? 0),
        0,
      ) ?? 0,
    [query.data],
  );

  return { ...query, totalPoints };
}