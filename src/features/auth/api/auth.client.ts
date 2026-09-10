import { ofetch } from "ofetch";
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterCandidateRequestDto,
  RegisterCandidateResponseDto,
  VerifyRegistrationOtpRequestDto,
  VerifyRegistrationOtpResponseDto,
  MeResponseDto,
} from "../types";

export const authClientApi = {
  me: () => ofetch<MeResponseDto>("/api/auth/me"),

  login: (payload: LoginRequestDto) =>
    ofetch<{ user: LoginResponseDto["user"] }>("/api/auth/login", {
      method: "POST",
      body: payload,
    }),

  registerCandidate: (payload: RegisterCandidateRequestDto) =>
    ofetch<RegisterCandidateResponseDto>("/api/auth/register", {
      method: "POST",
      body: payload,
    }),

  verifyRegistrationOtp: (payload: VerifyRegistrationOtpRequestDto) =>
    ofetch<{ user: VerifyRegistrationOtpResponseDto["user"] }>("/api/auth/verify-registration-otp", {
      method: "POST",
      body: payload,
    }),
};
