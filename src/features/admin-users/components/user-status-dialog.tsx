"use client";

import { ShieldAlert, UserCheck, UserX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog";
import { STATUS_LABELS } from "../constants/admin-user.constants";
import type { AdminUserDto } from "../types/admin-user.dto";

export interface UserStatusDialogProps {
  user: AdminUserDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  errorMessage?: string;
  onConfirm: (user: AdminUserDto) => void;
}

export function UserStatusDialog({
  user,
  open,
  onOpenChange,
  isPending,
  errorMessage,
  onConfirm,
}: UserStatusDialogProps) {
  const nextStatus = user?.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  const isSuspending = nextStatus === "SUSPENDED";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              isSuspending
                ? "bg-destructive/10 text-destructive"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }
          >
            {isSuspending ? <UserX className="size-5" /> : <UserCheck className="size-5" />}
          </AlertDialogMedia>

          <AlertDialogTitle>
            {isSuspending ? "Suspend" : "Reactivate"} {user?.name ?? "user"}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            {isSuspending ? (
              <>
                <span className="font-medium">{user?.email}</span> will no longer be able to sign
                in. Their data is retained and this can be reversed at any time.
              </>
            ) : (
              <>
                <span className="font-medium">{user?.email}</span> will regain access to their
                account.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage ? (
          <p className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" />
            {errorMessage}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending || !user}
            onClick={() => {
              if (user) onConfirm(user);
            }}
          >
            {isPending
              ? "Saving…"
              : `Yes, ${STATUS_LABELS[nextStatus].toLowerCase()} this user`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
