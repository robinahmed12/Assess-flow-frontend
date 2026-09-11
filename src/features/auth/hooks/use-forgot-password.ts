"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  VerifyForgotPasswordOtpRequestDto,
} from "../types";
import { authApi } from "../api/auth.api";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequestDto) => authApi.forgotPassword(payload),
    retry: false,
  });
}

export function useVerifyForgotPasswordOtp() {
  return useMutation({
    mutationFn: (payload: VerifyForgotPasswordOtpRequestDto) => authApi.verifyForgotPasswordOtp(payload),
    retry: false,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequestDto) => authApi.resetPassword(payload),
    retry: false,
  });
}