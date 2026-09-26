"use client";

import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

import { Button } from "@/src/shared/components/ui/button";
import { PaymentResultShell } from "./payment-result-shell";

export function PaymentCancelPage() {
  return (
    <PaymentResultShell
      icon={<XCircle className="size-5 text-destructive" />}
      title="Checkout cancelled"
      description="Your checkout was not completed. No payment was captured and your company credits were not changed. You can retry whenever you are ready."
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
