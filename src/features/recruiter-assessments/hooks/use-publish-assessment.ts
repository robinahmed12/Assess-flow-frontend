"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function usePublishAssessment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assessmentApi.publish(id),

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