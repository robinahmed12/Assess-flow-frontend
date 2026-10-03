import type { PaymentStatus } from "../types/payment.dto";

export const PAYMENT_PAGE_SIZES = [10, 20, 50, 100] as const;

export const PAYMENT_DEFAULT_LIMIT = 20;

export const ALL_FILTER_VALUE = "__all__";

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  SUCCEEDED: "Succeeded",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

/** Kept in one place so a status always reads the same colour across the module. */
export const PAYMENT_STATUS_CLASSES: Record<PaymentStatus, string> = {
  PENDING:
    "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  SUCCEEDED:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  FAILED: "border-destructive/40 bg-destructive/10 text-destructive",
  REFUNDED: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400",
};
