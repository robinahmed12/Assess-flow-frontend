import type { AuthUser, UserRole } from "../../domain";
import { canAccessRole } from "../../domain";

export function hasAllowedRole(user: AuthUser | null | undefined, allowedRoles: readonly UserRole[]) {
  return canAccessRole(user, allowedRoles);
}
