import type { UserRole, UserStatus } from "./auth.enums";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
};

export type LoginResult = {
  user: AuthUser;
  accessToken: string;
};

export type RegisterVerificationResult = {
  user: AuthUser;
  accessToken: string;
};

export type ForgotPasswordOtpVerificationResult = {
  resetToken: string;
  expiresInMinutes: number;
};

export type AuthSessionState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

export type RoleCheckResult =
  | { allowed: true }
  | { allowed: false; reason: "UNAUTHENTICATED" | "ROLE_FORBIDDEN" | "INACTIVE_USER" };
