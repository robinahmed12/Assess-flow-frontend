"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

import { usePaymentWatch } from "../hooks/use-payment-watch";

import { Button } from "@/src/shared/components/ui/button";
import { PaymentResultShell } from "./payment-result-shell";
import { PaymentResultView } from "./payment-result-view";

export function PaymentBkashSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment");
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["payments", "recruiter"] });
    queryClient.invalidateQueries({ queryKey: ["company", "me"] });
  }, [queryClient]);

  const payment = usePaymentWatch(paymentId);

  if (!paymentId) {
    return (
      <PaymentResultShell
        icon={<AlertTriangle className="size-5 text-destructive" />}
        title="Missing payment reference"
        description="This page was opened without a payment reference, so no payment state can be shown. If you were charged, contact support."
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
