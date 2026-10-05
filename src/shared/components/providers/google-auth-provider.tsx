"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { isGoogleAuthConfigured, env } from "@/src/config/env";

export function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // `GoogleOAuthProvider` throws when no client id is supplied, and this provider
  // wraps the whole app, so the provider is omitted rather than allowed to crash.
  if (!isGoogleAuthConfigured) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}