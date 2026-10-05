"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { evaluationApi } from "../api/evaluation.api";
import type { EvaluateAnswerRequestDto } from "../types";
import { attemptEvaluationKey } from "./use-attempt-evaluation";

export interface EvaluateAnswerVariables {
  attemptId: string;
  answerId: string;
  payload: EvaluateAnswerRequestDto;
}

export function useEvaluateAnswer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      attemptId,
      answerId,
      payload,
    }: EvaluateAnswerVariables) =>
      evaluationApi.evaluateAnswer(attemptId, answerId, payload),

    onSuccess: (_data, variables) => {
      // The attempt evaluation query owns every score, so refetching it keeps
      // the totals and the "still needs scoring" count consistent with the
      // server rather than patched optimistically on the client.
      qc.invalidateQueries({
        queryKey: attemptEvaluationKey(variables.attemptId),
      });

      toast.success("Answer scored.");
    },

    onError: (error) => {
      toast.error(error.message || "Could not save this score.");
    },
  });
}