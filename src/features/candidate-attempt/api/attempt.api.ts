import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api";


export const attemptApi = {
  getAttempt: (id:string) =>
    unwrap(apiClient(`/attempts/${id}`)),

  saveAnswer: (
    attemptId:string,
    problemId:string,
    payload:object
  ) =>
    unwrap(
      apiClient(
        `/attempts/${attemptId}/answers/${problemId}`,
        {
          method:"PUT",
          body:payload,
        }
      )
    ),

  submit: (id:string) =>
    unwrap(
      apiClient(
        `/attempts/${id}/submit`,
        {
          method:"POST",
        }
      )
    ),
};
