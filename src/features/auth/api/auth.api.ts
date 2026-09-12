
import { apiClient } from "@/src/shared/lib/api/api-client";
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
  RegisterRecruiterRequestDto,
  RegisterRecruiterResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  VerifyForgotPasswordOtpRequestDto,
  VerifyForgotPasswordOtpResponseDto,
  VerifyRecruiterOtpRequestDto,
  VerifyRecruiterOtpResponseDto,
  VerifyRegistrationOtpRequestDto,
  VerifyRegistrationOtpResponseDto,
} from "../types";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

function toRecruiterFormData(payload: RegisterRecruiterRequestDto): FormData {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("companyName", payload.companyName);
  formData.append("companyLicensePaper", payload.companyLicensePaper);
  formData.append("selfDocument", payload.selfDocument);
  return formData;
}

export async function unwrap<T>(request: Promise<ApiEnvelope<T> | T>): Promise<T> {
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

  registerRecruiter: (payload: RegisterRecruiterRequestDto) =>
    unwrap(apiClient<ApiEnvelope<RegisterRecruiterResponseDto>>("/recruiters/register", {
      method: "POST",
      body: toRecruiterFormData(payload),
    })),

  verifyRecruiterOtp: (payload: VerifyRecruiterOtpRequestDto) =>
    unwrap(apiClient<ApiEnvelope<VerifyRecruiterOtpResponseDto>>("/recruiters/verify-otp", {
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
