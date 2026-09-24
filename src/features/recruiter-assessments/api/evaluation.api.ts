import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type {
  AssessmentReportDto,
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

  report: (assessmentId: string) =>
    unwrap(
      apiClient<AssessmentReportDto>(
        `/evaluation/assessments/${assessmentId}/report`,
      ),
    ),
};