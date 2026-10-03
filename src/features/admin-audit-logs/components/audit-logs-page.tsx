"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { AuditLogMetadataDialog } from "./audit-log-metadata-dialog";
import { AuditLogsFilters } from "./audit-logs-filters";
import { AuditLogsTable } from "./audit-logs-table";
import {
  AUDIT_LOG_DEFAULT_LIMIT,
  AUDIT_LOG_PAGE_SIZES,
} from "../constants/audit-log.constants";
import { useAuditLogs } from "../hooks/use-audit-logs";
import { buildPageWindow } from "../utils/audit-log-format";
import type {
  AuditLogDto,
  AuditLogFilterDto,
  AuditLogSortOrder,
} from "../types/audit-log.dto";

type SortOrderValue = AuditLogSortOrder | "desc_default";

const EMPTY_FILTERS: AuditLogFilterDto = {
  action: "",
  entityType: "",
  entityId: "",
  actorId: "",
  from: "",
  to: "",
};

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="space-y-3 p-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuditLogsPage() {
  const [draft, setDraft] = useState<AuditLogFilterDto>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<AuditLogFilterDto>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(AUDIT_LOG_DEFAULT_LIMIT);
  const [sortOrder, setSortOrder] = useState<SortOrderValue>("desc_default");
  const [inspected, setInspected] = useState<AuditLogDto | null>(null);
  const [metadataOpen, setMetadataOpen] = useState(false);

  const query = useAuditLogs({
    ...applied,
    page,
    limit,
    sortOrder: sortOrder === "desc_default" ? "desc" : sortOrder,
  });

  const items = query.data?.items ?? [];
  const meta = query.data?.meta;
  const totalPages = meta?.totalPages ?? 0;
  const hasFilters = Object.values(applied).some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  const hasPendingChanges =
    draft.action !== applied.action ||
    draft.entityType !== applied.entityType ||
    draft.entityId !== applied.entityId ||
    draft.actorId !== applied.actorId ||
    draft.from !== applied.from ||
    draft.to !== applied.to;

  const handleApply = () => {
    setApplied(draft);
    setPage(1);
  };

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  };

  const handleInspect = (log: AuditLogDto) => {
    setInspected(log);
    setMetadataOpen(true);
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
            <ShieldCheck className="size-6 text-muted-foreground" />
            Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Immutable record of privileged actions across the platform.
          </p>
        </div>

        <Button variant="outline" onClick={() => void query.refetch()} disabled={query.isFetching}>
          <RefreshCw className={query.isFetching ? "size-4 animate-spin" : "size-4"} />
          Refresh
        </Button>
      </div>

      <AuditLogsFilters
        filters={draft}
        onChange={setDraft}
        onReset={handleReset}
        isFetching={query.isFetching}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleApply} disabled={!hasPendingChanges}>
          Apply filters
        </Button>

        <Select
          value={sortOrder}
          onValueChange={(value) => {
            setSortOrder(value as SortOrderValue);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44" aria-label="Sort order">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc_default">Newest first</SelectItem>
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
            {AUDIT_LOG_PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">
          {meta
            ? `${meta.total} ${meta.total === 1 ? "entry" : "entries"} · page ${meta.page} of ${
                Math.max(totalPages, 1)
              }`
            : "Loading total…"}
        </span>
      </div>

      {query.isError ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Could not load audit logs</AlertTitle>
          <AlertDescription>
            {query.error instanceof Error
              ? query.error.message
              : "An unexpected error occurred."}
            <Button variant="outline" size="sm" className="mt-3" onClick={() => void query.refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : query.isPending ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
            <ShieldCheck className="size-8 text-muted-foreground" />
            <p className="font-medium">No audit logs found</p>
            <p className="max-w-md text-sm text-muted-foreground">
              {hasFilters
                ? "No entries match the current filters. Try widening the date range or clearing filters."
                : "Audit entries will appear here as privileged actions are recorded."}
            </p>
            {hasFilters && (
              <Button variant="outline" className="mt-2" onClick={handleReset}>
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={query.isFetching ? "opacity-60 transition-opacity" : undefined}>
          <AuditLogsTable logs={items} onInspect={handleInspect} />
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

      <AuditLogMetadataDialog
        log={inspected}
        open={metadataOpen}
        onOpenChange={setMetadataOpen}
      />
    </div>
  );
}
