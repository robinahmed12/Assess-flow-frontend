"use client";
import { GoogleLoginRequestDto } from '../types/auth.dto';
import { authApi } from './../api/auth.api';


import { useMutation } from "@tanstack/react-query";




export function useGoogleLogin() {
  return useMutation({
    mutationFn: (payload: GoogleLoginRequestDto) =>
      authApi.googleLogin(payload),
  });
}