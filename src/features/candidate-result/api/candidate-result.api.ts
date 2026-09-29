import { apiClient } from "@/src/shared/lib/api";
import { unwrap } from "../../auth";
import type { CandidateResultDto } from "../types/candidate-result.dto";

export const candidateResultApi = {
  getResult: (attemptId: string) =>
    unwrap(
      apiClient<CandidateResultDto>(
        `/evaluation/attempts/${attemptId}/result`,
      ),
    ),
};
