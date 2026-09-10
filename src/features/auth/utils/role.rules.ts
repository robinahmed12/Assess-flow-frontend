import type { UserRole } from "../types/auth.enums";
import type { AuthUser, RoleCheckResult } from "../types/auth.types";
import { USER_STATUSES } from "../types/auth.enums";

export function canAccessRole(user: AuthUser | null | undefined, allowedRoles: readonly UserRole[]): RoleCheckResult {
  if (!user) {
    return { allowed: false, reason: "UNAUTHENTICATED" };
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    return { allowed: false, reason: "INACTIVE_USER" };
  }

  if (!allowedRoles.includes(user.role)) {
    return { allowed: false, reason: "ROLE_FORBIDDEN" };
  }

  return { allowed: true };
}
