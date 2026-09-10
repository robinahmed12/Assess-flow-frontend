import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const AUTH_ACCESS_TOKEN_COOKIE = "assessflow_access_token";
export const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export function getAuthCookieOptions(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
  };
}
