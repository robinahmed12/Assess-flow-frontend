import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import { PROBLEM_TYPES } from "../constants/problem.constants";
import type {
  CreateProblemRequestDto,
  ProblemDto,
  ProblemOptionDto,
  ProblemType,
  UpdateProblemRequestDto,
} from "../types/problem.dto";

type ProblemRawDto = Omit<
  ProblemDto,
  "tags" | "status" | "type" | "options" | "description" | "difficulty" | "points"
> & {
  tags?: string[] | null;
  status?: string;
  type?: string;
  options?: ProblemOptionDto[] | null;
  description?: string | null;
  difficulty?: string | null;
  points?: number | null;
};

function toProblemType(value?: string): ProblemType {
  return PROBLEM_TYPES.find((type) => type === value) ?? "WRITTEN";
}

function toProblemDto(raw: ProblemRawDto): ProblemDto {
  return {
    ...raw,
    type: toProblemType(raw.type),
    description: raw.description ?? "",
    points: raw.points ?? 0,
    difficulty: raw.difficulty ?? null,
    tags: raw.tags ?? [],
    status: raw.status === "ARCHIVED" ? "ARCHIVED" : "ACTIVE",
    options: raw.options ?? [],
  };
}

export const problemApi = {
  list: async () => {
    const items = await unwrap(apiClient<ProblemRawDto[]>("/problems"));

    return items.map(toProblemDto);
  },

  get: async (id: string) =>
    toProblemDto(await unwrap(apiClient<ProblemRawDto>(`/problems/${id}`))),

  create: async (payload: CreateProblemRequestDto) =>
    toProblemDto(
      await unwrap(
        apiClient<ProblemRawDto>("/problems", {
          method: "POST",
          body: payload,
        }),
      ),
    ),

  update: async (id: string, payload: UpdateProblemRequestDto) =>
    toProblemDto(
      await unwrap(
        apiClient<ProblemRawDto>(`/problems/${id}`, {
          method: "PATCH",
          body: payload,
        }),
      ),
    ),

  archive: (id: string) =>
    unwrap(
      apiClient(`/problems/${id}`, {
        method: "DELETE",
      }),
    ),
};
