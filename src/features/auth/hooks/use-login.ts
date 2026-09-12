"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS, type LoginRequestDto } from "../types";
import { authApi } from "../api/auth.api";
import { toast } from "sonner";
// import { authClientApi } from "../api";
import Cookies from "js-cookie";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequestDto) => authApi.login(payload),
    onSuccess: async (data) => {

      Cookies.set("accessToken", data.accessToken, {
        expires: 7,
        sameSite: "lax",
      });

      toast.success("Login successful!");
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, data.user);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Login failed. Please try again.");
    },
    retry: false,
  });
}
