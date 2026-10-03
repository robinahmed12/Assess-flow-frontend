"use client";

import { useQuery } from "@tanstack/react-query";

import { auditLogApi } from "../api/audit-log.api";
import type { AuditLogQueryState } from "../types/audit-log.dto";

export function useAuditLogs(query: AuditLogQueryState) {
  return useQuery({
    queryKey: ["admin", "audit-logs", query],
    queryFn: () => auditLogApi.list(query),
    placeholderData: (previous) => previous,
  });
}
