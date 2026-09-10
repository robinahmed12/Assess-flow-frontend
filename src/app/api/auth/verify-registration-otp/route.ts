import { NextResponse } from "next/server";
import { authRepository } from "@/src/features/auth/api";
import { otpSchema } from "@/src/features/auth/schemas";
import { AUTH_ACCESS_TOKEN_COOKIE, getAuthCookieOptions } from "@/src/shared/lib/auth";

function getErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = Number((error as { status: unknown }).status);
    if (Number.isInteger(status) && status >= 400 && status <= 599) return status;
  }

  return 400;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "OTP verification failed.";
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = otpSchema.parse(json);
    const result = await authRepository.verifyRegistrationOtp(payload);

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(AUTH_ACCESS_TOKEN_COOKIE, result.accessToken, getAuthCookieOptions());

    return response;
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: getErrorStatus(error) });
  }
}
