"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  SearchX,
  XCircle,
} from "lucide-react";

import { usePayments } from "../hooks/use-payments";
import { usePayment } from "../hooks/use-payment";
import { PAYMENT_STATUS_META } from "../constants/payment.constants";
import type { PaymentStatus } from "../types/payment.dto";

import { Button } from "@/src/shared/components/ui/button";
import { PaymentResultShell } from "./payment-result-shell";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120_000;

export function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  const { data: payments, isLoading: isLoadingPayments } = usePayments();

  const pendingPaymentId = useMemo(
    () =>
      (Array.isArray(payments) ? payments : []).find(
        (payment) => payment.stripeSessionId === sessionId,
      )?.id ?? null,
    [payments, sessionId],
  );

  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["payments", "recruiter"] });
    queryClient.invalidateQueries({ queryKey: ["company", "me"] });
  }, [queryClient]);

  useEffect(() => {
    if (!pendingPaymentId) return;

    const timer = window.setTimeout(
      () => setTimedOut(true),
      POLL_TIMEOUT_MS,
    );

    return () => window.clearTimeout(timer);
  }, [pendingPaymentId]);

  const detail = usePayment(pendingPaymentId ?? "", {
    enabled: Boolean(pendingPaymentId),
    refetchInterval: (query) =>
      !timedOut && query.state.data?.status === "PENDING"
        ? POLL_INTERVAL_MS
        : false,
    refetchIntervalInBackground: true,
  });

  const status: PaymentStatus | undefined = detail.data?.status;

  let content: React.ReactNode;

  if (!sessionId) {
    content = (
      <PaymentResultShell
        icon={<AlertTriangle className="size-5 text-destructive" />}
        title="Missing checkout session"
        description="This page was opened without a Stripe session, so no payment state can be shown. If you were charged, contact support."
      >
        <BackToBilling />
      </PaymentResultShell>
    );
  } else if (isLoadingPayments) {
    content = (
      <PaymentResultShell
        icon={<Loader2 className="size-5 animate-spin" />}
        title="Looking up your payment"
        description="Fetching the latest state of this checkout from the server."
      />
    );
  } else if (!pendingPaymentId) {
    content = (
      <PaymentResultShell
        icon={<SearchX className="size-5 text-muted-foreground" />}
        title="Payment not found"
        description="We could not find a payment linked to this checkout session. If the payment was created moments ago, give the webhook a few seconds and return to billing to check your history."
      >
        <BackToBilling />
      </PaymentResultShell>
    );
  } else if (!detail.data) {
    content = (
      <PaymentResultShell
        icon={<Loader2 className="size-5 animate-spin" />}
        title="Confirming your payment"
        description="The payment record exists. Waiting for the provider webhook to confirm it."
      />
    );
  } else if (status === "SUCCEEDED") {
    content = (
      <PaymentResultShell
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        title="Payment confirmed"
        description={`Your ${PAYMENT_STATUS_META.SUCCEEDED.label.toLowerCase()} payment added ${detail.data.creditsPurchased} credits to your company balance.`}
      >
        <BackToBilling />
        {detail.data.id && (
          <Button variant="outline">
            <Link href={`/recruiter/billing/payments/${detail.data.id}`}>
              View payment details
            </Link>
          </Button>
        )}
      </PaymentResultShell>
    );
  } else if (status === "FAILED") {
    content = (
      <PaymentResultShell
        icon={<XCircle className="size-5 text-destructive" />}
        title="Payment failed"
        description="The provider reported this payment as failed. No credits were added to your company."
      >
        <BackToBilling />
      </PaymentResultShell>
    );
  } else if (status === "REFUNDED") {
    content = (
      <PaymentResultShell
        icon={<CheckCircle2 className="size-5 text-sky-600" />}
        title="Payment refunded"
        description="This payment was refunded. Contact support if this is unexpected."
      >
        <BackToBilling />
      </PaymentResultShell>
    );
  } else if (timedOut) {
    content = (
      <PaymentResultShell
        icon={<Clock className="size-5 text-amber-600" />}
        title="Still processing"
        description="We stopped polling after a bounded period. The webhook may still confirm this payment shortly — check your payment history in a few minutes."
      >
        <BackToBilling />
      </PaymentResultShell>
    );
  } else {
    content = (
      <PaymentResultShell
        icon={<Loader2 className="size-5 animate-spin" />}
        title="Processing your payment"
        description="Waiting for Stripe to confirm the payment. You can keep this tab open or check your history later."
      />
    );
  }

  return content;
}

function BackToBilling() {
  return (
    <Button variant="outline">
      <Link href="/recruiter/billing">
        <ArrowLeft className="h-4 w-4" />
        Back to billing
      </Link>
    </Button>
  );
}
