"use client";

import { useQuery } from "@tanstack/react-query";

import { adminPaymentsApi } from "../api/admin-payments.api";
import type { PaymentQueryState } from "../types/payment.dto";

export const ADMIN_PAYMENTS_QUERY_KEY = ["admin", "payments"] as const;

export function useAdminPayments(query: PaymentQueryState) {
  return useQuery({
    queryKey: [...ADMIN_PAYMENTS_QUERY_KEY, query],
    queryFn: () => adminPaymentsApi.list(query),
    placeholderData: (previous) => previous,
  });
}
