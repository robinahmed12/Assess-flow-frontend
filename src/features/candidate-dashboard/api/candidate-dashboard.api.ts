import { apiClient } from "@/src/shared/lib/api";
import { unwrap } from "../../auth";


export const candidateDashboardApi = {
  getDashboard: () =>
    unwrap(apiClient("/dashboard/candidate")),
};
