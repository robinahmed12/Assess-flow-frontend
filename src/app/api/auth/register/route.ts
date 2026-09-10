import { NextResponse } from "next/server";
import { authRepository } from "@/src/features/auth/api";
import { candidateRegisterSchema } from "@/src/features/auth/schemas";

function getErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = Number((error as { status: unknown }).status);
    if (Number.isInteger(status) && status >= 400 && status <= 599) return status;
  }

  return 400;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Registration failed.";
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = candidateRegisterSchema.parse(json);
    const result = await authRepository.registerCandidate(payload);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: getErrorStatus(error) });
  }
}
