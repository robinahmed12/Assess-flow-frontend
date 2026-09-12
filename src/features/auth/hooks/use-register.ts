"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AUTH_QUERY_KEYS,
  type RegisterCandidateRequestDto,
  type RegisterRecruiterRequestDto,
  type VerifyRecruiterOtpRequestDto,
  type VerifyRegistrationOtpRequestDto,
} from "../types";
import { authApi } from "../api/auth.api";
import Cookies from "js-cookie";


export function useRegisterCandidate() {
  return useMutation({
    mutationFn: (payload: RegisterCandidateRequestDto) => authApi.registerCandidate(payload),
    retry: false,
  });
}

export function useVerifyRegistrationOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyRegistrationOtpRequestDto) => authApi.verifyRegistrationOtp(payload),
    onSuccess: async (data) => {
       Cookies.set("accessToken", data.accessToken, {
        expires: 7,
        sameSite: "lax",
      });
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, data.user);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
    retry: false,
  });
}

export function useRegisterRecruiter() {
  return useMutation({
    mutationFn: (payload: RegisterRecruiterRequestDto) => authApi.registerRecruiter(payload),
    retry: false,
  });
}

export function useVerifyRecruiterOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyRecruiterOtpRequestDto) => authApi.verifyRecruiterOtp(payload),
    onSuccess: async (data) => {
        Cookies.set("accessToken", data.accessToken, {
        expires: 7,
        sameSite: "lax",
      });
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, data.user);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
    retry: false,
  });
}
