"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ROUTES } from "@/src/config/routes";
import { clearSession } from "../utils/session";

/**
 * Signs the user out of the client session.
 *
 * Drops the `accessToken` cookie (so `apiClient` stops sending the bearer
 * token), wipes the cached `me` user and hard-navigates to the login page so
 * no in-memory query state survives the sign-out. There is no backend logout
 * endpoint yet — the JWT itself stays valid until it expires.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearSession(queryClient);
    window.location.assign(ROUTES.login);
  }, [queryClient]);
}
