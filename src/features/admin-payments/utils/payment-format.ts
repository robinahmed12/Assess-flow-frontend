import type { AdminPaymentDto } from "../types/payment.dto";

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

/**
 * Amounts are deliberately rendered without a currency symbol: `Payment.amount`
 * is a bare float with no currency column, and the table mixes bKash and Stripe
 * rows, so any symbol we picked would be wrong for part of the data.
 */
export function formatAmount(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";

  return amountFormatter.format(value);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? "—" : dateTimeFormatter.format(parsed);
}

export type PaymentProvider = "bKash" | "Stripe" | null;

/** Infers the gateway from whichever provider reference the row carries. */
export function resolveProvider(payment: AdminPaymentDto): PaymentProvider {
  if (payment.bkashPaymentId || payment.bkashTransactionId) return "bKash";
  if (payment.stripePaymentIntentId || payment.stripeSessionId) return "Stripe";

  return null;
}

export function resolveReference(payment: AdminPaymentDto): string | null {
  return (
    payment.bkashTransactionId ??
    payment.bkashPaymentId ??
    payment.stripePaymentIntentId ??
    payment.stripeSessionId ??
    null
  );
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Mirrors the backend's `z.string().uuid()` rule for `companyId`, so a partial
 * id is caught in the form instead of coming back as a validation error.
 */
export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value.trim());
}
