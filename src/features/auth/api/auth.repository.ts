import type {
  ForgotPasswordRequestDto,
  GoogleLoginRequestDto,
  LoginRequestDto,
  RegisterCandidateRequestDto,
  RegisterRecruiterRequestDto,
  ResetPasswordRequestDto,
  VerifyForgotPasswordOtpRequestDto,
  VerifyRecruiterOtpRequestDto,
  VerifyRegistrationOtpRequestDto,
} from "../types";
import { authApi } from "./auth.api";

export const authRepository = {
  getMe: () => authApi.me(),
  login: (payload: LoginRequestDto) => authApi.login(payload),
  googleLogin: (payload: GoogleLoginRequestDto) => authApi.googleLogin(payload),
  registerCandidate: (payload: RegisterCandidateRequestDto) => authApi.registerCandidate(payload),
  verifyRegistrationOtp: (payload: VerifyRegistrationOtpRequestDto) => authApi.verifyRegistrationOtp(payload),
  registerRecruiter: (payload: RegisterRecruiterRequestDto) => authApi.registerRecruiter(payload),
  verifyRecruiterOtp: (payload: VerifyRecruiterOtpRequestDto) => authApi.verifyRecruiterOtp(payload),
  forgotPassword: (payload: ForgotPasswordRequestDto) => authApi.forgotPassword(payload),
  verifyForgotPasswordOtp: (payload: VerifyForgotPasswordOtpRequestDto) => authApi.verifyForgotPasswordOtp(payload),
  resetPassword: (payload: ResetPasswordRequestDto) => authApi.resetPassword(payload),
};
