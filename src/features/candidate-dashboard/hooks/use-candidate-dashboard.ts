"use client";

import { useQuery } from "@tanstack/react-query";
import { candidateDashboardApi } from "../api/candidate-dashboard.api";

export function useCandidateDashboard() {
  return useQuery({
    queryKey: ["dashboard", "candidate"],
    queryFn: candidateDashboardApi.getDashboard,
  });
}
