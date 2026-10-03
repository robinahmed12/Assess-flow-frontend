"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CreditCard, RefreshCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/src/shared/components/ui/alert";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/shared/components/ui/pagination";
import { buildPageWindow } from "@/src/shared/lib/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { AdminPaymentsFilters } from "./admin-payments-filters";
import { AdminPaymentsTable } from "./admin-payments-table";
import {
  PAYMENT_DEFAULT_LIMIT,
  PAYMENT_PAGE_SIZES,
} from "../constants/admin-payment.constants";
import { useAdminPayments } from "../hooks/use-admin-payments";
import type { PaymentStatus } from "../types/payment.dto";
import { isUuid } from "../utils/payment-format";

interface FilterDraft {
  status: string;
  companyId: string;
}

const EMPTY_DRAFT: FilterDraft = { status: "", companyId: "" };

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="space-y-3 p-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="ml-auto h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPaymentsPage() {
  const [draft, setDraft] = useState<FilterDraft>(EMPTY_DRAFT);
  const [applied, setApplied] = useState<FilterDraft>(EMPTY_DRAFT);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAYMENT_DEFAULT_LIMIT);

  // The backend validates `companyId` as a uuid, so a partial id is caught here
  // rather than costing a round trip to be rejected.
  const companyIdError = useMemo(() => {
    const value = draft.companyId.trim();

    if (!value) return undefined;

    return isUuid(value) ? undefined : "Enter a valid company UUID.";
  }, [draft.companyId]);

  const query = useAdminPayments({
    page,
    limit,
    status: (applied.status || undefined) as PaymentStatus | undefined,
    companyId: applied.companyId || undefined,
    sortOrder,
  });

  const payments = query.data?.items ?? [];
  const meta = query.data?.meta;
  const totalPages = meta?.totalPages ?? 0;

  const isFiltered = Boolean(applied.status || applied.companyId);
  const hasPendingChanges =
    draft.status !== applied.status ||
    draft.companyId.trim() !== applied.companyId;

  const resetAll = () => {
    setDraft(EMPTY_DRAFT);
    setApplied(EMPTY_DRAFT);
    setSortOrder("desc");
    setPage(1);
  };

  const handleApply = () => {
    if (companyIdError) return;

    setApplied({ ...draft, companyId: draft.companyId.trim() });
    setPage(1);
  };

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || (totalPages > 0 && nextPage > totalPages)) return;

    setPage(nextPage);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <CreditCard className="size-6 text-muted-foreground" />
            Payments
          </h1>
          <p className="text-sm text-muted-foreground">
            Review credit purchases across every company on the platform.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
        >
          <RefreshCw className={query.isFetching ? "size-4 animate-spin" : "size-4"} />
          Refresh
        </Button>
      </div>

      <AdminPaymentsFilters
        draft={draft}
        onChange={setDraft}
        onApply={handleApply}
        onReset={resetAll}
        isFiltered={isFiltered}
        hasPendingChanges={hasPendingChanges}
        companyIdError={companyIdError}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={sortOrder}
          onValueChange={(value) => {
            setSortOrder(value === "asc" ? "asc" : "desc");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40" aria-label="Sort order">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-32" aria-label="Rows per page">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">
          {meta
            ? `${meta.total} ${meta.total === 1 ? "payment" : "payments"} · page ${
                meta.page
              } of ${Math.max(totalPages, 1)}`
            : "Loading total…"}
        </span>
      </div>

      {query.isError ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Could not load payments</AlertTitle>
          <AlertDescription>
            {query.error instanceof Error
              ? query.error.message
              : "An unexpected error occurred."}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => void query.refetch()}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : query.isPending ? (
        <TableSkeleton />
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
            <CreditCard className="size-8 text-muted-foreground" />
            <p className="font-medium">No payments found</p>
            <p className="max-w-md text-sm text-muted-foreground">
              {isFiltered
                ? "No transactions match the current filters."
                : "Payments will appear here once a company purchases credits."}
            </p>
            {isFiltered && (
              <Button variant="outline" className="mt-2" onClick={resetAll}>
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={query.isFetching ? "opacity-60 transition-opacity" : undefined}>
          <AdminPaymentsTable payments={payments} />
        </div>
      )}

      {!query.isError && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(page - 1);
                }}
              />
            </PaginationItem>

            {buildPageWindow(page, totalPages).map((entry) =>
              typeof entry === "number" ? (
                <PaginationItem key={entry}>
                  <PaginationLink
                    href="#"
                    isActive={entry === page}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(entry);
                    }}
                  >
                    {entry}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={entry}>
                  <PaginationEllipsis />
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page >= totalPages}
                className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
