
import { apiClient } from "@/src/shared/infrastructure/api/api-client";
import type {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  GoogleLoginRequestDto,
  GoogleLoginResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  MeResponseDto,
  RegisterCandidateRequestDto,
  RegisterCandidateResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  VerifyForgotPasswordOtpRequestDto,
  VerifyForgotPasswordOtpResponseDto,
  VerifyRegistrationOtpRequestDto,
  VerifyRegistrationOtpResponseDto,
} from "../domain";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

async function unwrap<T>(request: Promise<ApiEnvelope<T> | T>): Promise<T> {
  const response = await request;

  if (response && typeof response === "object" && "success" in response && "data" in response) {
    return (response as ApiEnvelope<T>).data;
  }

  return response as T;
}

export const authApi = {
  me: () => unwrap(apiClient<ApiEnvelope<MeResponseDto>>("/auth/me")),

  login: (payload: LoginRequestDto) =>
    unwrap(apiClient<ApiEnvelope<LoginResponseDto>>("/auth/login", {
      method: "POST",
      body: payload,
    })),

  googleLogin: (payload: GoogleLoginRequestDto) =>
    unwrap(apiClient<ApiEnvelope<GoogleLoginResponseDto>>("/auth/google", {
      method: "POST",
      body: payload,
    })),

  registerCandidate: (payload: RegisterCandidateRequestDto) =>
    unwrap(apiClient<ApiEnvelope<RegisterCandidateResponseDto>>("/auth/register", {
      method: "POST",
      body: payload,
    })),

  verifyRegistrationOtp: (payload: VerifyRegistrationOtpRequestDto) =>
    unwrap(apiClient<ApiEnvelope<VerifyRegistrationOtpResponseDto>>("/auth/verify-registration-otp", {
      method: "POST",
      body: payload,
    })),

  forgotPassword: (payload: ForgotPasswordRequestDto) =>
    unwrap(apiClient<ApiEnvelope<ForgotPasswordResponseDto>>("/auth/forgot-password", {
      method: "POST",
      body: payload,
    })),

  verifyForgotPasswordOtp: (payload: VerifyForgotPasswordOtpRequestDto) =>
    unwrap(apiClient<ApiEnvelope<VerifyForgotPasswordOtpResponseDto>>("/auth/verify-forgot-password-otp", {
      method: "POST",
      body: payload,
    })),

  resetPassword: (payload: ResetPasswordRequestDto) =>
    unwrap(apiClient<ApiEnvelope<ResetPasswordResponseDto>>("/auth/reset-password", {
      method: "POST",
      body: payload,
    })),
};
