import type { PaymentStatus } from "../types/payment.dto";

export type PaymentProvider = "STRIPE" | "BKASH";

export const PAYMENT_PROVIDERS = [
  "STRIPE",
  "BKASH",
] as const satisfies readonly PaymentProvider[];

export const PROVIDER_META: Record<
  PaymentProvider,
  { label: string; description: string }
> = {
  STRIPE: {
    label: "Stripe",
    description: "Card payment through Stripe Checkout, billed in USD.",
  },
  BKASH: {
    label: "bKash",
    description: "Mobile banking payment through bKash, billed in BDT.",
  },
};

export interface PaymentPlan {
  code: string;
  credits: number;
  amount: number;
  currency: "USD" | "BDT";
}

export const STRIPE_PACKAGES: readonly PaymentPlan[] = [
  { code: "STARTER", credits: 10, amount: 10, currency: "USD" },
  { code: "GROWTH", credits: 50, amount: 40, currency: "USD" },
  { code: "SCALE", credits: 150, amount: 100, currency: "USD" },
];

export const BKASH_PACKAGES: readonly PaymentPlan[] = [
  { code: "STARTER", credits: 10, amount: 500, currency: "BDT" },
  { code: "GROWTH", credits: 50, amount: 2000, currency: "BDT" },
  { code: "SCALE", credits: 150, amount: 5000, currency: "BDT" },
];

export const PACKAGES_BY_PROVIDER: Record<
  PaymentProvider,
  readonly PaymentPlan[]
> = {
  STRIPE: STRIPE_PACKAGES,
  BKASH: BKASH_PACKAGES,
};

export const PAYMENT_STATUSES = [
  "PENDING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
] as const satisfies readonly PaymentStatus[];

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; badgeClassName: string }
> = {
  PENDING: {
    label: "Pending",
    badgeClassName: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  SUCCEEDED: {
    label: "Succeeded",
    badgeClassName: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  FAILED: {
    label: "Failed",
    badgeClassName: "bg-red-500/10 text-red-700 dark:text-red-400",
  },
  REFUNDED: {
    label: "Refunded",
    badgeClassName: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
};

export const CHECKOUT_URL_KEYS = [
  "url",
  "checkoutUrl",
  "bkashURL",
  "paymentUrl",
  "redirectUrl",
] as const;
