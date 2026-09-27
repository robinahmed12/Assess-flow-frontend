"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterDashboardApi } from "../api/recruiter-dashboard.api";

export function useRecruiterDashboard() {
  return useQuery({
    queryKey: ["dashboard", "recruiter"],
    queryFn: recruiterDashboardApi.getDashboard,
  });
}
