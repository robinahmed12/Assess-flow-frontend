export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface PaymentCompanyDto {
  id: string;
  name: string;
  slug: string;
}

/**
 * A row from `GET /admin/payments`.
 *
 * `amount` arrives as a number because the service coerces it before responding.
 * Every provider/invoice field is nullable, since a payment is only linked to a
 * gateway once that gateway has responded.
 */
export interface AdminPaymentDto {
  id: string;
  amount: number;
  creditsPurchased: number;
  status: PaymentStatus;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  bkashPaymentId: string | null;
  bkashTransactionId: string | null;
  invoiceNumber: string | null;
  invoiceEmailSentAt: string | null;
  companyId: string;
  company: PaymentCompanyDto;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  companyId?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaymentListMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentListPageDto {
  items: AdminPaymentDto[];
  meta: PaymentListMetaDto;
}

/**
 * Query state with the fields the table always needs resolved.
 *
 * There is deliberately no `sortBy`: the backend orders by `createdAt` alone and
 * exposes no sort-field parameter, so only the direction can be chosen.
 */
export interface PaymentQueryState extends PaymentListParams {
  page: number;
  limit: number;
}
