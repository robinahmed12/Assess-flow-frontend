import { apiClient } from "@/src/shared/lib/api";
import { unwrap } from "../../auth";
import type { AttemptDetailDto } from "../types/attempt.dto";

export interface SaveAnswerPayload {
  selectedOptionId?: string;
  answerText?: string;
}

export const attemptApi = {
  getAttempt: (id: string) =>
    unwrap(apiClient<AttemptDetailDto>(`/attempts/${id}`)),

  saveAnswer: (
    attemptId: string,
    problemId: string,
    payload: SaveAnswerPayload,
  ) =>
    unwrap(
      apiClient(
        `/attempts/${attemptId}/answers/${problemId}`,
        {
          method: "PUT",
          body: payload,
        },
      ),
    ),

  submit: (id: string) =>
    unwrap(
      apiClient(
        `/attempts/${id}/submit`,
        {
          method: "POST",
        },
      ),
    ),
};
