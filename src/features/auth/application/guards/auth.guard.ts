import type { AuthUser } from "../../domain";

export function isAuthenticated(user: AuthUser | null | undefined): user is AuthUser {
  return Boolean(user);
}
