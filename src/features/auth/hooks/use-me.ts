"use client";

import { useQuery } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS } from "../types";
import { authRepository } from "../api";


export function useMe() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: authRepository.getMe,
    retry: false,
  });
}
