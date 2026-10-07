"use client";

import { GoogleAuthProvider } from "./google-auth-provider";
import { QueryProvider } from "./query-provider";
import { SonnerProvider } from "./sonner-provider";
import { RouteProgress } from "@/src/shared/components/global-loader";

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        {children}
      </QueryProvider>

      <SonnerProvider />
      <RouteProgress />
    </GoogleAuthProvider>
  );
}