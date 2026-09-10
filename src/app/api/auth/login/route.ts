import { NextResponse } from "next/server";
import { authRepository } from "@/src/features/auth/infrastructure";
import { loginSchema } from "@/src/features/auth/domain";
import { AUTH_ACCESS_TOKEN_COOKIE, getAuthCookieOptions } from "@/src/shared/infrastructure/auth";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Login failed.";
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = loginSchema.parse(json);
    const result = await authRepository.login(payload);

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(AUTH_ACCESS_TOKEN_COOKIE, result.accessToken, getAuthCookieOptions());

    return response;
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 401 });
  }
}
