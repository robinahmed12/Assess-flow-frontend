import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type {
  AssessmentReportDto,
  AttemptEvaluationDto,
  EvaluateAnswerRequestDto,
  EvaluateAnswerResponseDto,
  FinalizeEvaluationResponseDto,
  SubmissionsQueryDto,
  SubmissionsResponseDto,
} from "../types/assessment.dto";

export const evaluationApi = {
  submissions: (
    assessmentId: string,
    params?: SubmissionsQueryDto,
  ) =>
    unwrap(
      apiClient<SubmissionsResponseDto>(
        `/evaluation/assessments/${assessmentId}/submissions`,
        {
          query: params,
        },
      ),
    ),

  attemptEvaluation: (attemptId: string) =>
    unwrap(
      apiClient<AttemptEvaluationDto>(
        `/evaluation/attempts/${attemptId}/evaluation`,
      ),
    ),

  evaluateAnswer: (
    attemptId: string,
    answerId: string,
    payload: EvaluateAnswerRequestDto,
  ) =>
    unwrap(
      apiClient<EvaluateAnswerResponseDto>(
        `/evaluation/attempts/${attemptId}/answers/${answerId}/evaluate`,
        {
          method: "PATCH",
          body: payload,
        },
      ),
    ),

  finalizeEvaluation: (attemptId: string) =>
    unwrap(
      apiClient<FinalizeEvaluationResponseDto>(
        `/evaluation/attempts/${attemptId}/finalize-evaluation`,
        { method: "POST" },
      ),
    ),

  report: (assessmentId: string) =>
    unwrap(
      apiClient<AssessmentReportDto>(
        `/evaluation/assessments/${assessmentId}/report`,
      ),
    ),
};