"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { AUTH_QUERY_KEYS, type AuthUser, type LoginRequestDto } from "../types";

type LoginSessionResponse = {
  user: AuthUser;
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginRequestDto) => {
      return ofetch<LoginSessionResponse>("/api/auth/login", {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, data.user);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
    retry: false,
  });
}
