import type { AuthUser } from "../types";

export function isAuthenticated(user: AuthUser | null | undefined): user is AuthUser {
  return Boolean(user);
}
