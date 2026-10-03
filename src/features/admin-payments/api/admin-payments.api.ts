import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type { AdminPaymentDto, PaymentFilterDto } from "../types/payment.dto";

export const adminPaymentsApi = {
  list: (params?: PaymentFilterDto) =>
    unwrap<AdminPaymentDto[]>(
      apiClient<AdminPaymentDto[]>("/admin/payments", {
        params,
      }),
    ),
};
