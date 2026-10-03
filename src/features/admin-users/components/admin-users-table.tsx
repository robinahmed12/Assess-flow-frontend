"use client";

import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/components/ui/table";
import { ROLE_LABELS, STATUS_LABELS } from "../constants/admin-user.constants";
import type { AdminUserDto } from "../types/admin-user.dto";

export interface AdminUsersTableProps {
  users: AdminUserDto[];
  currentUserId?: string;
  pendingUserId?: string;
  onToggleStatus: (user: AdminUserDto) => void;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "UTC",
});

function formatDate(value: string | undefined): string {
  if (!value) return "—";

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? "—" : dateFormatter.format(parsed);
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function AdminUsersTable({
  users,
  currentUserId,
  pendingUserId,
  onToggleStatus,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-40 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const isPending = pendingUserId === user.id;

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                        {initialsFor(user.name)}
                      </span>
                      {user.name}
                      {isSelf ? (
                        <Badge variant="outline" className="ml-1">
                          You
                        </Badge>
                      ) : null}
                    </span>
                    <span className="text-xs text-muted-foreground break-all">
                      {user.email}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.status === "ACTIVE"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "border-destructive/40 bg-destructive/10 text-destructive"
                    }
                  >
                    {STATUS_LABELS[user.status]}
                  </Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>

                <TableCell className="text-right">
                  {isSelf ? (
                    <span className="text-xs text-muted-foreground">
                      Cannot change own status
                    </span>
                  ) : (
                    <Button
                      variant={user.status === "ACTIVE" ? "outline" : "default"}
                      size="sm"
                      disabled={isPending}
                      onClick={() => onToggleStatus(user)}
                    >
                      {isPending
                        ? "Saving…"
                        : user.status === "ACTIVE"
                          ? "Suspend"
                          : "Reactivate"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
