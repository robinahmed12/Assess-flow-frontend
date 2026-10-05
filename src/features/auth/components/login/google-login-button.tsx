"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";

import { isGoogleAuthConfigured } from "@/src/config/env";
import { useGoogleLogin } from "../../hooks";
import { getRoleRedirect } from "../../utils/role.redirect";

export function GoogleLoginButton() {
  const router = useRouter();
  const mutation = useGoogleLogin();

  // Rendered without the `GoogleOAuthProvider` when unconfigured, the widget
  // would throw instead of simply being absent.
  if (!isGoogleAuthConfigured) {
    return null;
  }

  return (
    <GoogleLogin
      onSuccess={(response: CredentialResponse) => {
        // `GoogleLogin` has no `disabled` prop, so an in-flight exchange is
        // guarded here instead.
        if (mutation.isPending) return;

        if (!response.credential) {
          toast.error("Google did not return a credential. Please try again.");
          return;
        }

        mutation.mutate(
          { credential: response.credential },
          {
            onSuccess: (data) => {
              // The server owns the role: a first-time Google sign-in is created
              // as CANDIDATE, while a linked account keeps its existing role.
              router.replace(getRoleRedirect(data.user.role));
            },
          },
        );
      }}
      onError={() => {
        if (mutation.isPending) return;

        toast.error("Google sign-in was cancelled or failed. Please try again.");
      }}
    />
  );
}