import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type { AdminUserDto, UserListParams } from "../types/admin-user.dto";

export type AdminUserStatus = "ACTIVE" | "SUSPENDED";

export const adminUsersApi = {
  list: (params?: UserListParams) =>
    unwrap<AdminUserDto[]>(
      apiClient<AdminUserDto[]>("/admin/users", {
        params,
      }),
    ),

  updateStatus: (id: string, status: AdminUserStatus) =>
    unwrap(
      apiClient(`/admin/users/${id}/status`, {
        method: "PATCH",
        body: { status },
      }),
    ),
};
