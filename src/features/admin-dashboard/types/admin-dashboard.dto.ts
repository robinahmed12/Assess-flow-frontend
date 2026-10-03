export interface AdminDashboardRoleBreakdownDto {
  admin: number;
  recruiter: number;
  candidate: number;
}

export interface AdminDashboardDto {
  users: {
    total: number;
    active: number;
    suspended: number;
    byRole: AdminDashboardRoleBreakdownDto;
  };
  companies: {
    total: number;
  };
  problems: {
    total: number;
  };
  assessments: {
    total: number;
    draft: number;
    published: number;
    closed: number;
    archived: number;
  };
  invitations: {
    total: number;
    pending: number;
    accepted: number;
    revoked: number;
  };
  attempts: {
    total: number;
    inProgress: number;
    submitted: number;
    evaluated: number;
    expired: number;
  };
  payments: {
    total: number;
    pending: number;
    succeeded: number;
    failed: number;
    /**
     * Sum of captured amounts across *all* providers. Stripe settles in USD and
     * bKash in BDT, so this figure mixes currencies and must not be rendered
     * with a single currency symbol.
     */
    successfulAmount: number;
    creditsPurchased: number;
  };
}

/** Loosened shape used to tolerate partial or legacy API responses. */
export type PartialAdminDashboardDto = {
  [K in keyof AdminDashboardDto]?: Partial<AdminDashboardDto[K]>;
};

export interface AdminDashboardBreakdownRow {
  label: string;
  value: number;
}
