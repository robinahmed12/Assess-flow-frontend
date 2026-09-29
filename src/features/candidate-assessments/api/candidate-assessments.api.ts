import { apiClient } from "@/src/shared/lib/api";
import { unwrap } from "../../auth";
import type {
  AttemptHistoryDto,
  CandidateAssessmentDto,
  StartedAttemptDto,
} from "../types/candidate-assessments.dto";

export const candidateAssessmentsApi = {
  getAssessments: () =>
    unwrap(apiClient<CandidateAssessmentDto[]>("/candidate/assessments")),

  getAttempts: () =>
    unwrap(apiClient<AttemptHistoryDto[]>("/attempts/me")),

  startAssessment: (id: string) =>
    unwrap(
      apiClient<StartedAttemptDto>(
        `/candidate/assessments/${id}/start`,
        {
          method: "POST",
        },
      ),
    ),
};
