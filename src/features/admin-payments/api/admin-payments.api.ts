import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type {
  AdminPaymentDto,
  PaymentListPageDto,
  PaymentListParams,
} from "../types/payment.dto";

interface RawPaymentListPage {
  data?: AdminPaymentDto[] | null;
  meta?: Partial<PaymentListPageDto["meta"]> | null;
}

/**
 * The endpoint answers with `{ data, meta }`, so a partially formed or missing
 * envelope is normalised into a usable page rather than crashing the table.
 */
function toPaymentListPage(
  raw: RawPaymentListPage | null | undefined,
  params: PaymentListParams,
): PaymentListPageDto {
  const items = Array.isArray(raw?.data) ? raw.data : [];
  const meta = raw?.meta ?? {};
  const total = meta.total ?? items.length;

  return {
    items,
    meta: {
      page: meta.page ?? params.page ?? 1,
      limit: meta.limit ?? params.limit ?? items.length,
      total,
      totalPages: meta.totalPages ?? (items.length > 0 ? 1 : 0),
    },
  };
}

export const adminPaymentsApi = {
  list: (params: PaymentListParams = {}): Promise<PaymentListPageDto> => {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.status) query.set("status", params.status);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const companyId = params.companyId?.trim();
    if (companyId) query.set("companyId", companyId);

    const search = query.toString();

    return unwrap<RawPaymentListPage>(
      apiClient<RawPaymentListPage>(`/admin/payments${search ? `?${search}` : ""}`),
    ).then((raw) => toPaymentListPage(raw, params));
  },
};
