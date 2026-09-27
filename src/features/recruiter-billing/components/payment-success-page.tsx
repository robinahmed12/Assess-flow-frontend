"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, SearchX } from "lucide-react";

import { usePayments } from "../hooks/use-payments";
import { usePaymentWatch } from "../hooks/use-payment-watch";

import { Button } from "@/src/shared/components/ui/button";
import { PaymentResultShell } from "./payment-result-shell";
import { PaymentResultView } from "./payment-result-view";

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

  const payment = usePaymentWatch(pendingPaymentId);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["payments", "recruiter"] });
    queryClient.invalidateQueries({ queryKey: ["company", "me"] });
  }, [queryClient]);

  if (!sessionId) {
    return (
      <PaymentResultShell
        icon={<AlertTriangle className="size-5 text-destructive" />}
        title="Missing checkout session"
        description="This page was opened without a Stripe session, so no payment state can be shown. If you were charged, contact support."
      >
        <Button variant="outline">
          <Link href="/recruiter/billing">Back to billing</Link>
        </Button>
      </PaymentResultShell>
    );
  }

  if (isLoadingPayments) {
    return (
      <PaymentResultShell
        icon={<Loader2 className="size-5 animate-spin" />}
        title="Looking up your payment"
        description="Fetching the latest state of this checkout from the server."
      />
    );
  }

  if (!pendingPaymentId) {
    return (
      <PaymentResultShell
        icon={<SearchX className="size-5 text-muted-foreground" />}
        title="Payment not found"
        description="We could not find a payment linked to this checkout session. If the payment was created moments ago, give the webhook a few seconds and return to billing to check your history."
      >
        <Button variant="outline">
          <Link href="/recruiter/billing">Back to billing</Link>
        </Button>
      </PaymentResultShell>
    );
  }

  return (
    <PaymentResultView
      payment={payment.data}
      timedOut={payment.timedOut}
      loading={payment.isLoading}
    />
  );
}
