import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type {
  AdminDashboardDto,
  AdminDashboardRoleBreakdownDto,
  PartialAdminDashboardDto,
} from "../types/admin-dashboard.dto";

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * `dashboard-stats` always returns every group, but normalising defensively
 * keeps a partial response from rendering `NaN` or throwing mid-dashboard.
 */
function normalize(raw: PartialAdminDashboardDto | null | undefined): AdminDashboardDto {
  const users = raw?.users ?? {};
  const byRole: Partial<AdminDashboardRoleBreakdownDto> = users.byRole ?? {};

  return {
    users: {
      total: num(users.total),
      active: num(users.active),
      suspended: num(users.suspended),
      byRole: {
        admin: num(byRole.admin),
        recruiter: num(byRole.recruiter),
        candidate: num(byRole.candidate),
      },
    },
    companies: { total: num(raw?.companies?.total) },
    problems: { total: num(raw?.problems?.total) },
    assessments: {
      total: num(raw?.assessments?.total),
      draft: num(raw?.assessments?.draft),
      published: num(raw?.assessments?.published),
      closed: num(raw?.assessments?.closed),
      archived: num(raw?.assessments?.archived),
    },
    invitations: {
      total: num(raw?.invitations?.total),
      pending: num(raw?.invitations?.pending),
      accepted: num(raw?.invitations?.accepted),
      revoked: num(raw?.invitations?.revoked),
    },
    attempts: {
      total: num(raw?.attempts?.total),
      inProgress: num(raw?.attempts?.inProgress),
      submitted: num(raw?.attempts?.submitted),
      evaluated: num(raw?.attempts?.evaluated),
      expired: num(raw?.attempts?.expired),
    },
    payments: {
      total: num(raw?.payments?.total),
      pending: num(raw?.payments?.pending),
      succeeded: num(raw?.payments?.succeeded),
      failed: num(raw?.payments?.failed),
      successfulAmount: num(raw?.payments?.successfulAmount),
      creditsPurchased: num(raw?.payments?.creditsPurchased),
    },
  };
}

export const adminDashboardApi = {
  getStats: (): Promise<AdminDashboardDto> =>
    unwrap(
      apiClient<PartialAdminDashboardDto | null>("/admin/dashboard-stats"),
    ).then(normalize),
};
