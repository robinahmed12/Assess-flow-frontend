import { z } from "zod";

export const createAssessmentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200),
  description: z.string().max(2000).optional(),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 minute")
    .max(1440),
  passingScore: z.coerce
    .number()
    .int()
    .min(0, "Passing score cannot be negative"),
  problemIds: z
    .array(z.string().min(1))
    .min(1, "At least one problem is required")
    .max(100),
});

export const updateAssessmentSchema =
  createAssessmentSchema.partial().extend({
    description: z.string().max(2000).nullable().optional(),
  });

export const invitationSchema = z.object({
  candidateEmail: z.string().email("Enter a valid email address"),
  expiresAt: z.string().optional(),
});