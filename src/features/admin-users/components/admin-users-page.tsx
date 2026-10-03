"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";

import { useMe } from "@/src/features/auth/hooks";
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
import { AdminUsersFilters } from "./admin-users-filters";
import { AdminUsersTable } from "./admin-users-table";
import { UserStatusDialog } from "./user-status-dialog";
import {
  USER_DEFAULT_LIMIT,
  USER_PAGE_SIZES,
} from "../constants/admin-user.constants";
import { useAdminUsers } from "../hooks/use-admin-users";
import { useUpdateUserStatus } from "../hooks/use-update-user-status";
import type {
  AdminUserDto,
  UserRole,
  UserSortBy,
  UserStatus,
} from "../types/admin-user.dto";

interface FilterDraft {
  q: string;
  role: string;
  status: string;
  sortBy: UserSortBy;
}

const EMPTY_DRAFT: FilterDraft = { q: "", role: "", status: "", sortBy: "createdAt" };

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="space-y-3 p-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const meQuery = useMe();
  const currentUserId = meQuery.data?.id;

  const [draft, setDraft] = useState<FilterDraft>(EMPTY_DRAFT);
  const [applied, setApplied] = useState<FilterDraft>(EMPTY_DRAFT);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(USER_DEFAULT_LIMIT);
  const [target, setTarget] = useState<AdminUserDto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mutationError, setMutationError] = useState<string | undefined>(undefined);

  const updateStatus = useUpdateUserStatus();

  const query = useAdminUsers({
    page,
    limit,
    q: applied.q,
    role: (applied.role || undefined) as UserRole | undefined,
    status: (applied.status || undefined) as UserStatus | undefined,
    sortBy: applied.sortBy,
    sortOrder,
  });

  const users = query.data?.items ?? [];
  const meta = query.data?.meta;
  const totalPages = meta?.totalPages ?? 0;

  const isFiltered = Boolean(applied.q || applied.role || applied.status);
  const hasPendingChanges =
    draft.q !== applied.q ||
    draft.role !== applied.role ||
    draft.status !== applied.status ||
    draft.sortBy !== applied.sortBy;

  const resetAll = () => {
    setDraft(EMPTY_DRAFT);
    setApplied(EMPTY_DRAFT);
    setSortOrder("desc");
    setPage(1);
  };

  const handleConfirm = (user: AdminUserDto) => {
    const nextStatus: UserStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    setMutationError(undefined);

    updateStatus.mutate(
      { id: user.id, status: nextStatus },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setTarget(null);

          toast.success(
            nextStatus === "SUSPENDED"
              ? `${user.name} has been suspended`
              : `${user.name} has been reactivated`,
          );
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Could not update this user.";
          setMutationError(message);
          toast.error(message);
        },
      },
    );
  };

  const openDialog = (user: AdminUserDto) => {
    setTarget(user);
    setMutationError(undefined);
    setDialogOpen(true);
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
            <Users className="size-6 text-muted-foreground" />
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Search accounts and suspend or reactivate access.
          </p>
        </div>

        <Button variant="outline" onClick={() => void query.refetch()} disabled={query.isFetching}>
          <RefreshCw className={query.isFetching ? "size-4 animate-spin" : "size-4"} />
          Refresh
        </Button>
      </div>

      <AdminUsersFilters
        draft={draft}
        onChange={setDraft}
        onApply={() => {
          setApplied(draft);
          setPage(1);
        }}
        onReset={resetAll}
        isFiltered={isFiltered}
        hasPendingChanges={hasPendingChanges}
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
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
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
            {USER_PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">
          {meta
            ? `${meta.total} ${meta.total === 1 ? "user" : "users"} · page ${meta.page} of ${Math.max(
                totalPages,
                1,
              )}`
            : "Loading total…"}
        </span>
      </div>

      {query.isError ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Could not load users</AlertTitle>
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
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
            <Users className="size-8 text-muted-foreground" />
            <p className="font-medium">No users found</p>
            <p className="max-w-md text-sm text-muted-foreground">
              {isFiltered
                ? "No accounts match the current filters."
                : "Accounts will appear here once they register."}
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
          <AdminUsersTable
            users={users}
            currentUserId={currentUserId}
            pendingUserId={updateStatus.isPending ? target?.id : undefined}
            onToggleStatus={openDialog}
          />
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

      <UserStatusDialog
        user={target}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setTarget(null);
            setMutationError(undefined);
          }
        }}
        isPending={updateStatus.isPending}
        errorMessage={mutationError}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
