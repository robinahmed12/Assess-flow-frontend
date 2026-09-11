import type { AuthUser, ForgotPasswordOtpVerificationResult, LoginResult, RegisterVerificationResult } from "./auth.types";

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type GoogleLoginRequestDto = {
  credential: string;
};

export type RegisterCandidateRequestDto = {
  name: string;
  email: string;
  password: string;
};

export type VerifyRegistrationOtpRequestDto = {
  email: string;
  otp: string;
};

export type RegisterRecruiterRequestDto = {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyLicensePaper: File;
  selfDocument: File;
};

export type VerifyRecruiterOtpRequestDto = {
  email: string;
  otp: string;
};

export type ForgotPasswordRequestDto = {
  email: string;
};

export type VerifyForgotPasswordOtpRequestDto = {
  email: string;
  otp: string;
};

export type ResetPasswordRequestDto = {
  resetToken: string;
  newPassword: string;
};

export type MeResponseDto = AuthUser;
export type LoginResponseDto = LoginResult;
export type GoogleLoginResponseDto = LoginResult;
export type RegisterCandidateResponseDto = { message?: string };
export type VerifyRegistrationOtpResponseDto = RegisterVerificationResult;
export type RegisterRecruiterResponseDto = { message?: string };
export type VerifyRecruiterOtpResponseDto = RegisterVerificationResult;
export type ForgotPasswordResponseDto = { message?: string };
export type VerifyForgotPasswordOtpResponseDto = ForgotPasswordOtpVerificationResult;
export type ResetPasswordResponseDto = { message?: string };
