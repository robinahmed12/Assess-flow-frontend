"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronRight, Coins, CreditCard, Smartphone } from "lucide-react";

import { useCompany } from "@/src/features/company/hooks/use-company";
import { usePayments } from "../hooks/use-payments";
import { useCheckout } from "../hooks/use-checkout";
import {
  PACKAGES_BY_PROVIDER,
  PAYMENT_PROVIDERS,
  PAYMENT_STATUS_META,
  PAYMENT_STATUSES,
  PROVIDER_META,
  type PaymentPlan,
  type PaymentProvider,
} from "../constants/payment.constants";
import { formatAmount, formatDate } from "../utils/payment-format";
import type { PaymentStatus } from "../types/payment.dto";

import { Button } from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/components/ui/table";
import { cn } from "@/src/shared/utils";

const PROVIDER_ICONS = {
  STRIPE: CreditCard,
  BKASH: Smartphone,
} as const;

type StatusFilter = PaymentStatus | "ALL";

export function BillingPage() {
  const queryClient = useQueryClient();
  const { data: company, isLoading: isCompanyLoading } = useCompany();
  const {
    data: payments,
    isLoading,
    isError,
    error,
    refetch,
  } = usePayments();
  const checkout = useCheckout();
  const data = useMemo(
    () => (Array.isArray(payments) ? payments : []),
    [payments],
  );

  const [provider, setProvider] = useState<PaymentProvider>("STRIPE");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["payments", "recruiter"] });
    queryClient.invalidateQueries({ queryKey: ["company", "me"] });
  }, [queryClient]);

  const plans = PACKAGES_BY_PROVIDER[provider];

  const filtered = useMemo(
    () =>
      status === "ALL"
        ? data
        : data.filter((payment) => payment.status === status),
    [data, status],
  );

  function buy(plan: PaymentPlan) {
    checkout.mutate(
      { provider, packageCode: plan.code },
      {
        onSuccess: (response) => {
          window.location.assign(response.url);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not start the checkout. Please try again.",
          );
        },
      },
    );
  }

  return (
    <main className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Buy company credits with Stripe or bKash and review past payments.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3">
          <Coins className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Available credits</p>
            {isCompanyLoading ? (
              <Skeleton className="mt-1 h-6 w-16" />
            ) : (
              <p className="text-2xl font-semibold tabular-nums">
                {company?.credits ?? 0}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Buy credits</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {PAYMENT_PROVIDERS.map((item) => {
            const meta = PROVIDER_META[item];
            const Icon = PROVIDER_ICONS[item];
            const selected = provider === item;

            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => setProvider(item)}
                className={cn(
                  "flex items-start gap-3 border p-4 text-left transition-colors",
                  selected
                    ? "border-transparent ring-2 ring-ring"
                    : "ring-1 ring-foreground/10 hover:bg-muted/40",
                )}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block font-medium">{meta.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {meta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {plans.map((plan) => {
            const perCredit = plan.amount / plan.credits;

            return (
              <Card
                key={plan.code}
                className={cn(
                  "flex flex-col",
                  plan.code === "GROWTH" && "ring-2 ring-ring",
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{plan.code}</CardTitle>
                    {plan.code === "GROWTH" && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {plan.credits} credits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-2xl font-semibold tabular-nums">
                    {plan.currency} {formatAmount(plan.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {plan.currency} {formatAmount(perCredit)} per credit
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={checkout.isPending}
                    onClick={() => buy(plan)}
                  >
                    {checkout.isPending ? "Processing…" : `Buy with ${PROVIDER_META[provider].label}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Payment history</h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["ALL", ...PAYMENT_STATUSES] as const).map((item) => (
            <Button
              key={item}
              variant={status === item ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatus(item)}
            >
              {item === "ALL" ? "All" : PAYMENT_STATUS_META[item].label}
            </Button>
          ))}
        </div>

        {isError ? (
          <LoadError
            message={
              error instanceof Error
                ? error.message
                : "Could not load payments."
            }
            onRetry={() => void refetch()}
          />
        ) : isLoading ? (
          <PaymentHistorySkeleton />
        ) : data.length === 0 ? (
          <div className="border border-dashed p-12 text-center">
            <p className="font-medium">No payments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Purchased credit packages will appear here once you check out.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="border border-dashed p-10 text-center text-sm text-muted-foreground">
            No payments match this filter.
          </p>
        ) : (
          <div className="overflow-x-auto border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Payment</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {payment.creditsPurchased}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatAmount(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate text-xs text-muted-foreground">
                      {payment.invoiceNumber ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Link
                          href={`/recruiter/billing/payments/${payment.id}`}
                        >
                          Details
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </main>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const meta = PAYMENT_STATUS_META[status];

  return (
    <Badge variant="outline" className={cn("font-medium", meta.badgeClassName)}>
      {meta.label}
    </Badge>
  );
}

function LoadError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="border border-destructive/40 p-6">
      <p className="font-medium text-destructive">Failed to load payments</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function PaymentHistorySkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="space-y-2 border p-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
      ))}
    </div>
  );
}
