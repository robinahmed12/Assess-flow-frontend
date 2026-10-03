import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type {
  AdminUserDto,
  UpdateUserStatusInput,
  UserListPageDto,
  UserListParams,
} from "../types/admin-user.dto";

interface RawUserListPage {
  data?: AdminUserDto[] | null;
  meta?: Partial<UserListPageDto["meta"]> | null;
}

function toUserListPage(
  raw: RawUserListPage | null | undefined,
  params: UserListParams,
): UserListPageDto {
  const items = Array.isArray(raw?.data) ? raw.data : [];
  const meta = raw?.meta ?? {};
  const total = meta.total ?? items.length;

  return {
    items,
    meta: {
      page: meta.page ?? params.page ?? 1,
      limit: meta.limit ?? params.limit ?? items.length,
      total,
      totalPages: meta.totalPages ?? (items.length > 0 ? 1 : 0),
    },
  };
}

export const adminUsersApi = {
  list: (params: UserListParams = {}): Promise<UserListPageDto> => {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    // `q` is validated with `.min(1)`, so an empty search must be omitted
    // rather than sent as an empty string.
    const q = params.q?.trim();
    if (q) query.set("q", q);

    if (params.role) query.set("role", params.role);
    if (params.status) query.set("status", params.status);

    const search = query.toString();

    return unwrap<RawUserListPage>(
      apiClient<RawUserListPage>(`/admin/users${search ? `?${search}` : ""}`),
    ).then((raw) => toUserListPage(raw, params));
  },

  updateStatus: ({ id, status }: UpdateUserStatusInput): Promise<AdminUserDto> =>
    unwrap<AdminUserDto>(
      apiClient<AdminUserDto>(`/admin/users/${id}/status`, {
        method: "PATCH",
        body: { status },
      }),
    ),
};
