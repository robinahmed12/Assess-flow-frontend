"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS, type LoginRequestDto } from "../types";
import { authClientApi } from "../api";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequestDto) => authClientApi.login(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, data.user);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
    retry: false,
  });
}
