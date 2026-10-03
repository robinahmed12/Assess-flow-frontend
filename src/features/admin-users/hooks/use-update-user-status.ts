"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminUsersApi } from "../api/admin-users.api";
import type { UpdateUserStatusInput } from "../types/admin-user.dto";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserStatusInput) => adminUsersApi.updateStatus(input),

    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      // A status change writes an `ADMIN_USER_STATUS_UPDATED` audit entry, so
      // the audit log view is now stale too.
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });

      queryClient.invalidateQueries({ queryKey: ["dashboard", "admin"] });

      return updatedUser;
    },
  });
}
