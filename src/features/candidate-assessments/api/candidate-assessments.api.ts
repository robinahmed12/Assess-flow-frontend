import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";


export const candidateAssessmentsApi = {
  getAssessments: () =>
    unwrap(apiClient("/candidate/assessments")),

  getAttempts: () =>
    unwrap(apiClient("/attempts/me")),

  startAssessment: (id: string) =>
    unwrap(
      apiClient(`/candidate/assessments/${id}/start`, {
        method: "POST",
      })
    ),
};
