import { ROUTES } from "@/src/config/routes";
import { USER_ROLES } from "../types/auth.enums";

/**
 * Resolves the landing route for a signed-in user.
 *
 * Takes a plain `string` because the role can arrive from the login response as
 * well as from a cached session, and an unrecognised role falls back home rather
 * than throwing.
 */
export function getRoleRedirect(role: string): string {
  switch (role) {
    case USER_ROLES.CANDIDATE:
      return ROUTES.candidateDashboard;
    case USER_ROLES.RECRUITER:
      return ROUTES.recruiterDashboard;
    case USER_ROLES.ADMIN:
      return ROUTES.adminDashboard;
    default:
      return ROUTES.home;
  }
}