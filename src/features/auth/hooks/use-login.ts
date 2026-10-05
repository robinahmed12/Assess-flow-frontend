"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { type LoginRequestDto } from "../types";
import { authApi } from "../api/auth.api";
import { establishSession, getAuthErrorMessage } from "../utils/session";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequestDto) => authApi.login(payload),

    onSuccess: async (data) => {
      await establishSession(queryClient, data);

      toast.success("Login successful!");
    },

    onError: (error) => {
      toast.error(getAuthErrorMessage(error, "Login failed. Please try again."));
    },

    retry: false,
  });
}