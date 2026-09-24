"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useArchiveAssessment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assessmentApi.archive(id),

    onSuccess: (_data, id) => {
      qc.invalidateQueries({
        queryKey: ["assessments", "list"],
      });
      qc.invalidateQueries({
        queryKey: ["assessments", "detail", id],
      });
    },
  });
}