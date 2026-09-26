import type { ProblemStatus, ProblemType } from "../types/problem.dto";

export const PROBLEM_TYPES = [
  "MCQ",
  "WRITTEN",
  "CODING",
] as const satisfies readonly ProblemType[];

export const PROBLEM_TYPE_LABELS: Record<ProblemType, string> = {
  MCQ: "MCQ",
  WRITTEN: "Written",
  CODING: "Coding",
};

export const PROBLEM_TYPE_HINTS: Record<ProblemType, string> = {
  MCQ: "Candidates pick one option, scored automatically.",
  WRITTEN: "Candidates write a long form answer, scored manually.",
  CODING: "Candidates write code, reviewed manually.",
};

export const PROBLEM_TYPE_BADGE_VARIANTS: Record<
  ProblemType,
  "default" | "secondary" | "outline"
> = {
  MCQ: "default",
  WRITTEN: "secondary",
  CODING: "outline",
};

export const PROBLEM_STATUS_LABELS: Record<ProblemStatus, string> = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
};

export const ARCHIVED_STATUS: ProblemStatus = "ARCHIVED";

export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export const NO_DIFFICULTY = "NONE";

export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 50;
export const MAX_TITLE_LENGTH = 200;
export const MAX_DIFFICULTY_LENGTH = 50;
export const MAX_OPTION_LENGTH = 1000;
export const MIN_MCQ_OPTIONS = 2;
