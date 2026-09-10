"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { ROUTES } from "@/src/config/routes";
import { candidateRegisterSchema, otpSchema } from "../../schemas";
import type { RegisterCandidateRequestDto, VerifyRegistrationOtpRequestDto } from "../../types";
import { useRegisterCandidate, useVerifyRegistrationOtp } from "../../hooks";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function RegisterForm() {
  const router = useRouter();
  const [registeredEmail, setRegisteredEmail] = useState("");

  const registerMutation = useRegisterCandidate();
  const verifyOtpMutation = useVerifyRegistrationOtp();

  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } satisfies RegisterCandidateRequestDto,
    onSubmit: async ({ value }) => {
      const payload = candidateRegisterSchema.parse(value);
      await registerMutation.mutateAsync(payload);
      setRegisteredEmail(payload.email);
    },
  });

  const otpForm = useForm({
    defaultValues: {
      email: registeredEmail,
      otp: "",
    } satisfies VerifyRegistrationOtpRequestDto,
    onSubmit: async ({ value }) => {
      const payload = otpSchema.parse({ ...value, email: registeredEmail });
      await verifyOtpMutation.mutateAsync(payload);
      router.replace(ROUTES.candidateDashboard);
    },
  });

  if (registeredEmail) {
    return (
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void otpForm.handleSubmit();
        }}
      >
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Registration started. Enter the 6 digit OTP sent to {registeredEmail}.
        </div>

        <otpForm.Field
          name="otp"
          validators={{
            onBlur: ({ value }) => {
              const result = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits").safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor={field.name}>OTP</label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors.length > 0 ? <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p> : null}
            </div>
          )}
        </otpForm.Field>

        {verifyOtpMutation.isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {getErrorMessage(verifyOtpMutation.error)}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify account"}
        </button>

        <button
          type="button"
          className="w-full rounded-md border px-4 py-2 text-sm font-medium"
          onClick={() => setRegisteredEmail("")}
        >
          Use another email
        </button>
      </form>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void registerForm.handleSubmit();
      }}
    >
      <registerForm.Field
        name="name"
        validators={{
          onBlur: ({ value }) => {
            const result = candidateRegisterSchema.shape.name.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={field.name}>Name</label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              autoComplete="name"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.length > 0 ? <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p> : null}
          </div>
        )}
      </registerForm.Field>

      <registerForm.Field
        name="email"
        validators={{
          onBlur: ({ value }) => {
            const result = candidateRegisterSchema.shape.email.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={field.name}>Email</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              autoComplete="email"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.length > 0 ? <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p> : null}
          </div>
        )}
      </registerForm.Field>

      <registerForm.Field
        name="password"
        validators={{
          onBlur: ({ value }) => {
            const result = candidateRegisterSchema.shape.password.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={field.name}>Password</label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              autoComplete="new-password"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.length > 0 ? <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p> : null}
          </div>
        )}
      </registerForm.Field>

      {registerMutation.isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {getErrorMessage(registerMutation.error)}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account? <Link className="font-medium text-black underline" href={ROUTES.login}>Sign in</Link>
      </p>
    </form>
  );
}
