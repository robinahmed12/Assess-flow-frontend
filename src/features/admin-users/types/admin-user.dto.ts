export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";

export type UserStatus = "ACTIVE" | "SUSPENDED";

/** Mirrors the backend `UserSortBy` enum; anything else is rejected by validation. */
export type UserSortBy = "createdAt" | "updatedAt" | "email" | "name" | "role" | "status";

export interface AdminUserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  q?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: UserSortBy;
  sortOrder?: "asc" | "desc";
}

export interface UserListMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListPageDto {
  items: AdminUserDto[];
  meta: UserListMetaDto;
}

/** Query state with the fields the table always needs resolved. */
export interface UserQueryState extends UserListParams {
  page: number;
  limit: number;
}

export interface UpdateUserStatusInput {
  id: string;
  status: UserStatus;
}
