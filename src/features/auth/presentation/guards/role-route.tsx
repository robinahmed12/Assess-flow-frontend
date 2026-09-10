"use client";

import type { ReactNode } from "react";
import type { UserRole } from "../../domain";
import { canAccessRole } from "../../domain";
import { useMe } from "../../application";

type RoleRouteProps = {
  allowedRoles: readonly UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleRoute({ allowedRoles, children, fallback = null }: RoleRouteProps) {
  const meQuery = useMe();

  if (meQuery.isLoading) {
    return fallback;
  }

  const result = canAccessRole(meQuery.data, allowedRoles);

  if (!result.allowed) {
    return fallback;
  }

  return <>{children}</>;
}
