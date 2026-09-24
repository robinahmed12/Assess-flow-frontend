import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type {
  AssessmentDetailDto,
  AssessmentDto,
  AssessmentListRawDto,
  CreateAssessmentRequestDto,
  UpdateAssessmentRequestDto,
} from "../types/assessment.dto";

export const assessmentApi = {
  list: async () => {
    const items = await unwrap(
      apiClient<AssessmentListRawDto[]>("/assessments"),
    );

    return items.map(
      (item): AssessmentDto => ({
        id: item.id,
        title: item.title,
        description: item.description,
        duration: item.duration,
        passingScore: item.passingScore,
        status: item.status,
        resultVisibility: item.resultVisibility,
        problemCount: item._count?.problems ?? 0,
      }),
    );
  },

  get: (id: string) =>
    unwrap(
      apiClient<AssessmentDetailDto>(`/assessments?${id}`),
    ),

  create: (payload: CreateAssessmentRequestDto) =>
    unwrap(
      apiClient<AssessmentDetailDto>("/assessments", {
        method: "POST",
        body: payload,
      }),
    ),

  update: (id: string, payload: UpdateAssessmentRequestDto) =>
    unwrap(
      apiClient<AssessmentDetailDto>(`/assessments/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    ),

  publish: (id: string) =>
    unwrap(
      apiClient(`/assessments/${id}/publish`, {
        method: "POST",
      }),
    ),

  archive: (id: string) =>
    unwrap(
      apiClient(`/assessments/${id}`, {
        method: "DELETE",
      }),
    ),
};