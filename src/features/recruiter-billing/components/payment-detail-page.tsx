"use client";

import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";

import { usePayment } from "../hooks/use-payment";
import { PAYMENT_STATUS_META } from "../constants/payment.constants";
import { formatAmount, formatDateTime, truncateId } from "../utils/payment-format";
import type { PaymentDto } from "../types/payment.dto";

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
import { cn } from "@/src/shared/utils";

export function PaymentDetailPage({ paymentId }: { paymentId: string }) {
  const { data, isLoading, isError, error, refetch } = usePayment(paymentId);

  return (
    <main className="space-y-5">
      <div>
        <Button variant="ghost" size="sm">
          <Link href="/recruiter/billing">
            <ArrowLeft className="h-4 w-4" />
            Back to billing
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <PaymentDetailSkeleton />
      ) : isError ? (
        <div className="border border-destructive/40 p-6">
          <p className="font-medium text-destructive">
            Failed to load payment
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "This payment could not be loaded."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </div>
      ) : !data ? (
        <div className="border border-dashed p-12 text-center">
          <p className="font-medium">Payment not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This payment does not exist or belongs to another company.
          </p>
        </div>
      ) : (
        <PaymentDetail payment={data} />
      )}
    </main>
  );
}

function PaymentDetail({ payment }: { payment: PaymentDto }) {
  const statusMeta = PAYMENT_STATUS_META[payment.status];

  const references = [
    { label: "Stripe session", value: payment.stripeSessionId },
    { label: "Stripe payment intent", value: payment.stripePaymentIntentId },
    { label: "bKash payment ID", value: payment.bkashPaymentId },
    { label: "bKash transaction ID", value: payment.bkashTransactionId },
  ].filter((reference) => Boolean(reference.value));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>
            Payment {truncateId(payment.id)}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn("font-medium", statusMeta.badgeClassName)}
          >
            {statusMeta.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1.5">
          <ReceiptText className="h-3.5 w-3.5" />
          {payment.invoiceNumber
            ? `Invoice ${payment.invoiceNumber}`
            : "Invoice not issued yet"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <DetailRow label="Amount" value={formatAmount(payment.amount)} />
          <DetailRow
            label="Credits purchased"
            value={String(payment.creditsPurchased)}
          />
          <DetailRow
            label="Status"
            value={statusMeta.label}
          />
          <DetailRow label="Payment ID" value={truncateId(payment.id)} />
          <DetailRow label="Created" value={formatDateTime(payment.createdAt)} />
          <DetailRow
            label="Last update"
            value={formatDateTime(payment.updatedAt)}
          />
        </dl>

        {references.length > 0 && (
          <div className="mt-6 space-y-2 border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Provider references
            </p>
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {references.map((reference) => (
                <DetailRow
                  key={reference.label}
                  label={reference.label}
                  value={reference.value as string}
                  mono
                />
              ))}
            </dl>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Refunds are not available from this screen. Payments are confirmed by
          the provider webhook, and company credits are updated automatically
          once the payment succeeds.
        </p>
      </CardFooter>
    </Card>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "mt-0.5 truncate text-sm",
          mono && "font-mono text-xs",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function PaymentDetailSkeleton() {
  return (
    <div className="space-y-4 border p-5">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-3 w-40" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
