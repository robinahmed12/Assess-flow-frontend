"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { problemApi } from "../api/problem.api";

export function useArchiveProblem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => problemApi.archive(id),

    onSuccess: (_data, id) => {
      qc.invalidateQueries({
        queryKey: ["problems", "list"],
      });
      qc.invalidateQueries({
        queryKey: ["problems", "detail", id],
      });
      qc.invalidateQueries({
        queryKey: ["assessments", "list"],
      });
    },
  });
}
