"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, XCircle } from "lucide-react";

import { Button } from "@/src/shared/components/ui/button";
import { PaymentResultShell } from "./payment-result-shell";

const REASONS: Record<string, { title: string; description: string }> = {
  cancelled: {
    title: "Checkout cancelled",
    description:
      "You cancelled the payment before it completed. No payment was captured and your company credits were not changed. You can retry whenever you are ready.",
  },
  failed: {
    title: "Payment failed",
    description:
      "bKash reported that the payment did not go through, so no credits were added. You can retry the payment or choose a different payment method.",
  },
  error: {
    title: "Payment could not be verified",
    description:
      "We could not confirm the outcome of this payment, so no credits were added. If you were charged, check your bKash history or contact support before retrying.",
  },
};

export function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "cancelled";
  const copy = REASONS[reason] ?? REASONS.cancelled;

  return (
    <PaymentResultShell
      icon={<XCircle className="size-5 text-destructive" />}
      title={copy.title}
      description={copy.description}
    >
      <Button>
        <Link href="/recruiter/billing">
          <ArrowLeft className="h-4 w-4" />
          Return to billing
        </Link>
      </Button>
    </PaymentResultShell>
  );
}
