"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { attemptApi } from "../api/attempt.api";
import { ROUTES } from "@/src/config/routes";

export function useSubmitAttempt() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attemptApi.submit(id),
    onSuccess: (_data, attemptId) => {
      queryClient.invalidateQueries({ queryKey: ["attempts", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["attempts", "detail", attemptId] });
      queryClient.invalidateQueries({ queryKey: ["candidate", "assessments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "candidate"] });
      router.push(ROUTES.candidateResult(attemptId));
    },
  });
}
