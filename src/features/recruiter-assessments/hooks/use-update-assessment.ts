"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";
import type { UpdateAssessmentRequestDto } from "../types";

export type UpdateAssessmentVariables = {
  id: string;
  payload: UpdateAssessmentRequestDto;
};

export function useUpdateAssessment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateAssessmentVariables) =>
      assessmentApi.update(id, payload),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ["assessments", "list"],
      });
      qc.invalidateQueries({
        queryKey: ["assessments", "detail", variables.id],
      });
    },
  });
}