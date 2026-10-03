"use client";

import { CreditCard } from "lucide-react";

import { Badge } from "@/src/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/components/ui/table";
import {
  PAYMENT_STATUS_CLASSES,
  PAYMENT_STATUS_LABELS,
} from "../constants/admin-payment.constants";
import type { AdminPaymentDto } from "../types/payment.dto";
import {
  formatAmount,
  formatDateTime,
  resolveProvider,
  resolveReference,
} from "../utils/payment-format";

export interface AdminPaymentsTableProps {
  payments: AdminPaymentDto[];
}

export function AdminPaymentsTable({ payments }: AdminPaymentsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Credits</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead className="whitespace-nowrap">Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((payment) => {
            const provider = resolveProvider(payment);
            const reference = resolveReference(payment);

            return (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{payment.company.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {payment.company.slug}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right font-medium tabular-nums">
                  {formatAmount(payment.amount)}
                </TableCell>

                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {payment.creditsPurchased}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={PAYMENT_STATUS_CLASSES[payment.status]}
                  >
                    {PAYMENT_STATUS_LABELS[payment.status]}
                  </Badge>
                </TableCell>

                <TableCell>
                  {provider ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-sm">
                        <CreditCard className="size-3.5 text-muted-foreground" />
                        {provider}
                      </span>
                      {reference && (
                        <span
                          className="font-mono text-xs text-muted-foreground"
                          title={reference}
                        >
                          {reference.length > 18
                            ? `${reference.slice(0, 18)}…`
                            : reference}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Awaiting gateway
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {payment.invoiceNumber ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs">
                        {payment.invoiceNumber}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {payment.invoiceEmailSentAt
                          ? `Emailed ${formatDateTime(payment.invoiceEmailSentAt)}`
                          : "Not emailed"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDateTime(payment.createdAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
