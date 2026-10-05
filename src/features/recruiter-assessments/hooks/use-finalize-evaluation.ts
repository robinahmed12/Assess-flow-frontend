"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { evaluationApi } from "../api/evaluation.api";
import { attemptEvaluationKey } from "./use-attempt-evaluation";

export function useFinalizeEvaluation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: string) =>
      evaluationApi.finalizeEvaluation(attemptId),

    onSuccess: (_data, attemptId) => {
      // Finalizing locks the attempt, so the evaluation becomes read-only and
      // the submissions list gains an EVALUATED row with a final score.
      qc.invalidateQueries({ queryKey: attemptEvaluationKey(attemptId) });
      qc.invalidateQueries({ queryKey: ["evaluation", "submissions"] });
      qc.invalidateQueries({ queryKey: ["evaluation", "report"] });

      toast.success("Evaluation finalized.");
    },

    onError: (error) => {
      toast.error(error.message || "Could not finalize this evaluation.");
    },
  });
}