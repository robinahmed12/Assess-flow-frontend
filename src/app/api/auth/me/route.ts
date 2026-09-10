import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ofetch } from "ofetch";

import { env } from "@/src/config/env";
import type { MeResponseDto } from "@/src/features/auth/types";
import { AUTH_ACCESS_TOKEN_COOKIE } from "@/src/shared/lib/auth";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

function getErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = Number((error as { status: unknown }).status);
    if (Number.isInteger(status) && status >= 400 && status <= 599) return status;
  }

  return 401;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unable to load current user.";
}

function unwrap<T>(response: ApiEnvelope<T> | T): T {
  if (response && typeof response === "object" && "success" in response && "data" in response) {
    return (response as ApiEnvelope<T>).data;
  }

  return response as T;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const result = await ofetch<ApiEnvelope<MeResponseDto> | MeResponseDto>("/auth/me", {
      baseURL: env.apiUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(unwrap(result));
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: getErrorStatus(error) });
  }
}
