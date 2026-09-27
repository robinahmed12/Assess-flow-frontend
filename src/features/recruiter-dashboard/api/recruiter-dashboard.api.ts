import { apiClient } from "@/src/shared/lib/api";
import { unwrap } from "../../auth";
import type { RecruiterDashboard } from "../types/recruiter-dashboard.dto";


export const recruiterDashboardApi = {
  getDashboard: () =>
    unwrap(apiClient<RecruiterDashboard>("/dashboard/recruiter")),
};
