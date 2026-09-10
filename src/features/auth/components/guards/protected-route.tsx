"use client";

import type { ReactNode } from "react";
import { useMe } from "../../hooks";

type ProtectedRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function ProtectedRoute({ children, fallback = null }: ProtectedRouteProps) {
  const meQuery = useMe();

  if (meQuery.isLoading) {
    return fallback;
  }

  if (!meQuery.data) {
    return fallback;
  }

  return <>{children}</>;
}
