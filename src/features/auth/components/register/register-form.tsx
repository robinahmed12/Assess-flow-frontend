"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  ArrowRightIcon,
  CircleNotchIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
  UserIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { z } from "zod";

import { ROUTES } from "@/src/config/routes";
import { cn } from "@/src/shared/utils";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";
import { Separator } from "@/src/shared/components/ui/separator";

import { candidateRegisterSchema, otpSchema } from "../../schemas";
import type {
  RegisterCandidateRequestDto,
  VerifyRegistrationOtpRequestDto,
} from "../../types";
import { useRegisterCandidate, useVerifyRegistrationOtp } from "../../hooks";
import { GoogleLoginButton } from "../login/google-login-button";
import { isGoogleAuthConfigured } from "@/src/config/env";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please check your information and try again.";
}

/** Step indicator showing registration milestones. */
function StepTracker({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {[1, 2].map((s) => (
        <div key={s} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-xs font-bold transition-all",
              step >= s
                ? "bg-[#B8621B] text-white shadow-sm"
                : "bg-[#FAF8F5] text-[#5A5D70] ring-1 ring-[#E6DCD0]",
            )}
          >
            {s}
          </span>
          <span
            className={cn(
              "text-xs font-semibold",
              step >= s ? "text-[#111322]" : "text-[#5A5D70]",
            )}
          >
            {s === 1 ? "Your details" : "Verify OTP"}
          </span>
          {s === 1 ? (
            <span
              className={cn(
                "h-0.5 flex-1 rounded-full",
                step >= 2 ? "bg-[#B8621B]" : "bg-[#E6DCD0]",
              )}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  /* Stage 2: OTP Verification */
  if (registeredEmail) {
    return (
      <div>
        <StepTracker step={2} />

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void otpForm.handleSubmit();
          }}
        >
          <div className="flex items-start gap-3 rounded-xl border border-[#B8621B]/30 bg-[#B8621B]/5 p-3.5 text-xs text-[#111322]">
            <EnvelopeIcon className="size-5 shrink-0 text-[#B8621B]" />
            <p className="leading-relaxed">
              We sent a 6-digit one-time passcode to{" "}
              <strong className="text-[#111322] underline">{registeredEmail}</strong>.
              Enter it below to activate your candidate account.
            </p>
          </div>

          <otpForm.Field
            name="otp"
            validators={{
              onBlur: ({ value }) => {
                const result = z
                  .string()
                  .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
                  .safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold text-[#111322]">
                  Verification Passcode
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  maxLength={6}
                  className="h-12 rounded-xl border-[#E6DCD0] bg-white text-center font-mono text-lg font-bold tracking-[0.6em] focus-visible:border-[#B8621B] focus-visible:ring-[#B8621B]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                    <WarningCircleIcon className="size-3.5" />
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </otpForm.Field>

          {verifyOtpMutation.isError ? (
            <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/10 text-xs">
              <WarningCircleIcon className="size-4" />
              <AlertDescription>
                {getErrorMessage(verifyOtpMutation.error)}
              </AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="h-11 w-full rounded-xl bg-[#B8621B] font-bold text-white shadow-md shadow-[#B8621B]/20 transition-all hover:bg-[#9B5115] hover:shadow-lg"
          >
            {verifyOtpMutation.isPending ? (
              <span className="flex items-center gap-2">
                <CircleNotchIcon className="size-4 animate-spin" />
                Verifying Passcode...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Verify &amp; Launch Dashboard</span>
                <ArrowRightIcon className="size-4" weight="bold" />
              </span>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl border-[#262A56] text-xs font-semibold text-[#262A56] hover:bg-[#FAF8F5]"
            onClick={() => setRegisteredEmail("")}
          >
            Use a different email address
          </Button>
        </form>
      </div>
    );
  }

  /* Stage 1: Registration Form */
  return (
    <div>
      <StepTracker step={1} />

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void registerForm.handleSubmit();
        }}
      >
        {/* Full Name */}
        <registerForm.Field
          name="name"
          validators={{
            onBlur: ({ value }) => {
              const result =
                candidateRegisterSchema.shape.name.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name} className="text-xs font-semibold text-[#111322]">
                Full Name
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-[#5A5D70]">
                  <UserIcon className="size-4" />
                </span>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Rivera"
                  className="h-11 rounded-xl border-[#E6DCD0] bg-white pl-10 text-xs transition-colors focus-visible:border-[#B8621B] focus-visible:ring-[#B8621B]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </div>
              {field.state.meta.errors.length > 0 ? (
                <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                  <WarningCircleIcon className="size-3.5" />
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </registerForm.Field>

        {/* Email */}
        <registerForm.Field
          name="email"
          validators={{
            onBlur: ({ value }) => {
              const result =
                candidateRegisterSchema.shape.email.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name} className="text-xs font-semibold text-[#111322]">
                Email Address
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-[#5A5D70]">
                  <EnvelopeIcon className="size-4" />
                </span>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-xl border-[#E6DCD0] bg-white pl-10 text-xs transition-colors focus-visible:border-[#B8621B] focus-visible:ring-[#B8621B]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </div>
              {field.state.meta.errors.length > 0 ? (
                <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                  <WarningCircleIcon className="size-3.5" />
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </registerForm.Field>

        {/* Password */}
        <registerForm.Field
          name="password"
          validators={{
            onBlur: ({ value }) => {
              const result =
                candidateRegisterSchema.shape.password.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name} className="text-xs font-semibold text-[#111322]">
                Create Password
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-[#5A5D70]">
                  <LockKeyIcon className="size-4" />
                </span>
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="h-11 rounded-xl border-[#E6DCD0] bg-white pl-10 pr-10 text-xs transition-colors focus-visible:border-[#B8621B] focus-visible:ring-[#B8621B]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#5A5D70] transition-colors hover:text-[#111322]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
              {field.state.meta.errors.length > 0 ? (
                <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                  <WarningCircleIcon className="size-3.5" />
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </registerForm.Field>

        {registerMutation.isError ? (
          <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/10 text-xs">
            <WarningCircleIcon className="size-4" />
            <AlertDescription>
              {getErrorMessage(registerMutation.error)}
            </AlertDescription>
          </Alert>
        ) : null}

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="h-11 w-full rounded-xl bg-[#B8621B] font-bold text-white shadow-md shadow-[#B8621B]/20 transition-all hover:bg-[#9B5115] hover:shadow-lg"
        >
          {registerMutation.isPending ? (
            <span className="flex items-center gap-2">
              <CircleNotchIcon className="size-4 animate-spin" />
              Creating Candidate Account...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Create Candidate Account</span>
              <ArrowRightIcon className="size-4" weight="bold" />
            </span>
          )}
        </Button>

        {isGoogleAuthConfigured && (
          <>
            <div className="my-4 flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-[11px] text-[#5A5D70]">OR REGISTER WITH</span>
              <Separator className="flex-1" />
            </div>

            <GoogleLoginButton />
          </>
        )}
      </form>
    </div>
  );
}
