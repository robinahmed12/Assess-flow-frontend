"use client";

import { useQuery } from "@tanstack/react-query";

import { adminUsersApi } from "../api/admin-users.api";
import type { UserQueryState } from "../types/admin-user.dto";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

export function useAdminUsers(query: UserQueryState) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, query],
    queryFn: () => adminUsersApi.list(query),
    placeholderData: (previous) => previous,
  });
}
