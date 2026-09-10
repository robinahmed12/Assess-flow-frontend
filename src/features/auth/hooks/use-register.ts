"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS, type RegisterCandidateRequestDto, type VerifyRegistrationOtpRequestDto } from "../types";
import { authClientApi } from "../api";

export function useRegisterCandidate() {
  return useMutation({
    mutationFn: (payload: RegisterCandidateRequestDto) => authClientApi.registerCandidate(payload),
    retry: false,
  });
}

export function useVerifyRegistrationOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyRegistrationOtpRequestDto) => authClientApi.verifyRegistrationOtp(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, data.user);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
    retry: false,
  });
}
