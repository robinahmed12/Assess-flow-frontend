"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authApi } from "../api/auth.api";
import { googleLoginSchema } from "../schemas";
import type { GoogleLoginRequestDto } from "../types";
import { establishSession, getAuthErrorMessage } from "../utils/session";

export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GoogleLoginRequestDto) =>
      // Validated here so a malformed credential fails with a readable message
      // instead of a raw Zod payload surfacing in the toast.
      authApi.googleLogin(googleLoginSchema.parse(payload)),

    // Mirrors `useLogin`: the token cookie and the `me` cache are what make the
    // session real. Without them Google sign-in appeared to work but every
    // subsequent request was unauthenticated.
    onSuccess: async (data) => {
      await establishSession(queryClient, data);

      toast.success("Login successful!");
    },

    onError: (error) => {
      toast.error(
        getAuthErrorMessage(error, "Google sign-in failed. Please try again."),
      );
    },

    retry: false,
  });
}