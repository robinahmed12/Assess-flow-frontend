"use client";

import { useMutation } from "@tanstack/react-query";
import { attemptApi, type SaveAnswerPayload } from "../api/attempt.api";

export function useSaveAnswer() {
  return useMutation({
    mutationFn: ({
      attemptId,
      problemId,
      payload,
    }: {
      attemptId: string;
      problemId: string;
      payload: SaveAnswerPayload;
    }) => attemptApi.saveAnswer(attemptId, problemId, payload),
  });
}
