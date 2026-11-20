import { apiClient } from "@/src/shared/lib/api";
import { unwrap } from "../../auth";
import type { CandidateDashboardDto } from "../types/candidate-dashboard.dto";

export const candidateDashboardApi = {
  getDashboard: (): Promise<CandidateDashboardDto> =>
    unwrap(apiClient<CandidateDashboardDto>("/dashboard/candidate")),
};
