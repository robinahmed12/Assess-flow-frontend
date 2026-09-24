"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "../api/invitation.api";
import type { CreateInvitationRequestDto } from "../types";

export function useCreateInvitation(assessmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvitationRequestDto) =>
      invitationApi.create(assessmentId, payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["invitations", "assessment", assessmentId],
      });
    },
  });
}