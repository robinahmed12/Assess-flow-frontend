"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";

import { PAYMENT_STATUS_META } from "../constants/payment.constants";
import type { PaymentDto } from "../types/payment.dto";

import { Button } from "@/src/shared/components/ui/button";
import { PaymentResultShell } from "./payment-result-shell";

export function PaymentResultView({
  payment,
  timedOut,
  loading,
}: {
  payment?: PaymentDto;
  timedOut: boolean;
  loading?: boolean;
}) {
  const status = payment?.status;

  let content: ReactNode;

  if (loading || !payment || status === "PENDING") {
    content =
      timedOut && payment ? (
        <PaymentResultShell
          icon={<Clock className="size-5 text-amber-600" />}
          title="Still processing"
          description="We stopped polling after a bounded period. The provider may still confirm this payment shortly — check your payment history in a few minutes."
        >
          <BackToBilling />
          <ViewPaymentDetails id={payment.id} />
        </PaymentResultShell>
      ) : (
        <PaymentResultShell
          icon={<Loader2 className="size-5 animate-spin" />}
          title="Processing your payment"
          description="Waiting for the payment provider to confirm this payment. You can keep this tab open or check your history later."
        />
      );
  } else if (status === "SUCCEEDED") {
    content = (
      <PaymentResultShell
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        title="Payment confirmed"
        description={`Your ${PAYMENT_STATUS_META.SUCCEEDED.label.toLowerCase()} payment added ${payment.creditsPurchased} credits to your company balance.`}
      >
        <BackToBilling />
        <ViewPaymentDetails id={payment.id} />
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
        <ViewPaymentDetails id={payment.id} />
      </PaymentResultShell>
    );
  } else {
    content = (
      <PaymentResultShell
        icon={<CheckCircle2 className="size-5 text-sky-600" />}
        title="Payment refunded"
        description="This payment was refunded. Contact support if this is unexpected."
      >
        <BackToBilling />
        <ViewPaymentDetails id={payment.id} />
      </PaymentResultShell>
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

function ViewPaymentDetails({ id }: { id: string }) {
  return (
    <Button>
      <Link href={`/recruiter/billing/payments/${id}`}>View payment details</Link>
    </Button>
  );
}
