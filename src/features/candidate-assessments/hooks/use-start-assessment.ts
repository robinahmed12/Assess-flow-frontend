"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { candidateAssessmentsApi } from "../api/candidate-assessments.api";

export function useStartAssessment() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: candidateAssessmentsApi.startAssessment,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({queryKey:["candidate","assessments"]});
      queryClient.invalidateQueries({queryKey:["attempts","mine"]});
      queryClient.invalidateQueries({queryKey:["dashboard","candidate"]});
      router.push(`/candidate/attempts/${data.id}`);
    },
  });
}
