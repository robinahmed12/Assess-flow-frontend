import { z } from "zod";
import { USER_ROLES, USER_STATUSES } from "./auth.enums";

export const userRoleSchema = z.enum([
  USER_ROLES.CANDIDATE,
  USER_ROLES.RECRUITER,
  USER_ROLES.ADMIN,
]);

export const userStatusSchema = z.enum([
  USER_STATUSES.ACTIVE,
  USER_STATUSES.INACTIVE,
  USER_STATUSES.SUSPENDED,
]);

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address").transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export const candidateRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid email address").transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const otpSchema = z.object({
  email: z.string().email("Enter a valid email address").transform((email) => email.toLowerCase()),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address").transform((email) => email.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const googleLoginSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});
