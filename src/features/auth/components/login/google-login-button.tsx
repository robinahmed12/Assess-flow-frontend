"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

import { useGoogleLogin } from "../../hooks/use-google-login";

export function GoogleLoginButton() {
  const router = useRouter();

  const mutation = useGoogleLogin();

  return (
    <GoogleLogin
      onSuccess={(response :CredentialResponse) => {
        if (!response.credential) return;

        mutation.mutate(
          {
            credential: response.credential,
          },
          {
            onSuccess: (data) => {
              const user = data.user;

              if (user.role === "CANDIDATE") {
                router.push("/candidate/dashboard");
              }

              if (user.role === "RECRUITER") {
                router.push("/recruiter/dashboard");
              }

              if (user.role === "ADMIN") {
                router.push("/admin/dashboard");
              }
            },
          },
        );
      }}
    />
  );
}
