"use client";

import { useQuery } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS } from "../types";
import { authApi } from "../api/auth.api";

export function useMe() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: authApi.me,
    retry: false,
  });
}
