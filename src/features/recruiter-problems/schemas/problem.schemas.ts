import { z } from "zod";

import {
  MAX_DIFFICULTY_LENGTH,
  MAX_OPTION_LENGTH,
  MAX_TAG_LENGTH,
  MAX_TAGS,
  MAX_TITLE_LENGTH,
  MIN_MCQ_OPTIONS,
  PROBLEM_TYPES,
} from "../constants/problem.constants";

const requiredNumber = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .pipe(z.coerce.number());

const optionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Option text is required")
    .max(MAX_OPTION_LENGTH, "Option text is too long"),
  isCorrect: z.boolean(),
});

export const problemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(MAX_TITLE_LENGTH, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters"),
  type: z.enum(PROBLEM_TYPES),
  points: requiredNumber("Points is required").pipe(
    z
      .number()
      .int("Points must be a whole number")
      .positive("Points must be greater than 0")
      .max(1000, "Points look too high"),
  ),
  difficulty: z
    .string()
    .trim()
    .max(MAX_DIFFICULTY_LENGTH, "Difficulty is too long")
    .optional(),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tags cannot be blank")
        .max(MAX_TAG_LENGTH, "Tag is too long"),
    )
    .max(MAX_TAGS, `You can add at most ${MAX_TAGS} tags`),
  options: z.array(optionSchema).optional(),
});

export const createProblemSchema = problemFormSchema.superRefine((value, ctx) => {
  const options = value.options ?? [];

  if (value.type === "MCQ") {
    if (options.length < MIN_MCQ_OPTIONS) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: `An MCQ needs at least ${MIN_MCQ_OPTIONS} options`,
      });
    }

    if (options.filter((option) => option.isCorrect).length !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Mark exactly one option as correct",
      });
    }

    return;
  }

  if (options.length > 0) {
    ctx.addIssue({
      code: "custom",
      path: ["options"],
      message: "Only MCQ problems accept options",
    });
  }
});
