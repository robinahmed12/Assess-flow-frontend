import type { AuthUser, UserRole } from "../types";
import { canAccessRole } from "./role.rules";

export function hasAllowedRole(user: AuthUser | null | undefined, allowedRoles: readonly UserRole[]) {
  return canAccessRole(user, allowedRoles);
}
