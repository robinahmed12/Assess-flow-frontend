"use client";

import { useQuery } from "@tanstack/react-query";
import { invitationApi } from "../api/invitation.api";

export function useInvitations(assessmentId: string) {
  return useQuery({
    queryKey: ["invitations", "assessment", assessmentId],
    queryFn: () => invitationApi.list(assessmentId),
    enabled: Boolean(assessmentId),
  });
}