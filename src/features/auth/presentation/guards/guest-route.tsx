"use client";

import type { ReactNode } from "react";
import { useMe } from "../../application";

type GuestRouteProps = {
  children: ReactNode;
  authenticatedFallback?: ReactNode;
};

export function GuestRoute({ children, authenticatedFallback = null }: GuestRouteProps) {
  const meQuery = useMe();

  if (meQuery.isLoading) {
    return null;
  }

  if (meQuery.data) {
    return authenticatedFallback;
  }

  return <>{children}</>;
}
