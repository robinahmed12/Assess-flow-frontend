import Cookies from "js-cookie";
import type { QueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";

import { AUTH_QUERY_KEYS, type LoginResult } from "../types";

export const ACCESS_TOKEN_COOKIE = "accessToken";

const ACCESS_TOKEN_MAX_AGE_DAYS = 7;

/**
 * Turns a successful auth response into a usable client session.
 *
 * `apiClient` reads the bearer token from this cookie, so without it every
 * protected request would 401 even though login "succeeded". The `me` cache is
 * seeded for an instant authenticated render and then invalidated: neither login
 * endpoint returns `user.status`, so only `/auth/me` produces a complete user
 * for the role guards.
 */
export async function establishSession(
  queryClient: QueryClient,
  result: LoginResult,
): Promise<void> {
  Cookies.set(ACCESS_TOKEN_COOKIE, result.accessToken, {
    expires: ACCESS_TOKEN_MAX_AGE_DAYS,
    sameSite: "lax",
  });

  queryClient.setQueryData(AUTH_QUERY_KEYS.me, result.user);

  await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
}

export function clearSession(queryClient: QueryClient): void {
  Cookies.remove(ACCESS_TOKEN_COOKIE);
  queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
}

/** Surfaces a Zod issue message instead of Zod's raw JSON error blob. */
export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}