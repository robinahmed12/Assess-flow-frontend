import type { UserRole, UserSortBy, UserStatus } from "../types/admin-user.dto";

export const USER_PAGE_SIZES = [10, 20, 50, 100] as const;

export const USER_DEFAULT_LIMIT = 20;

export const ALL_FILTER_VALUE = "__all__";

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  RECRUITER: "Recruiter",
  CANDIDATE: "Candidate",
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
};

export const SORT_BY_LABELS: Record<UserSortBy, string> = {
  createdAt: "Created",
  updatedAt: "Updated",
  name: "Name",
  email: "Email",
  role: "Role",
  status: "Status",
};

export const USER_ROLES: UserRole[] = ["ADMIN", "RECRUITER", "CANDIDATE"];
export const USER_STATUSES: UserStatus[] = ["ACTIVE", "SUSPENDED"];

export const USER_SORT_FIELDS: UserSortBy[] = [
  "createdAt",
  "updatedAt",
  "name",
  "email",
  "role",
  "status",
];
