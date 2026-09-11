"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { ROUTES } from "@/src/config/routes";
import { cn } from "@/src/shared/utils";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";

import { forgotPasswordSchema, otpSchema, resetPasswordSchema } from "../../schemas";
import type { ForgotPasswordRequestDto, VerifyForgotPasswordOtpRequestDto } from "../../types";
import { useForgotPassword, useResetPassword, useVerifyForgotPasswordOtp } from "../../hooks";

type Step = "email" | "otp" | "reset" | "done";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4 text-muted-foreground">
      <rect x="3" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 5.5L10 11l6.5-5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-10 text-primary">
      <circle cx="10" cy="10" r="9" className="fill-primary/10" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Three dots showing which stage of the reset flow the person is on. */
function StepTracker({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["Email", "Verify code", "New password"];

  return (
    <div className="mb-5 flex items-center gap-2">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-[10px] font-medium transition-colors",
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {s}
          </span>
          <span className={cn("text-[11px] font-medium", step >= s ? "text-foreground" : "text-muted-foreground")}>
            {labels[s - 1]}
          </span>
          {s < 3 ? <span className={cn("h-px flex-1", step > s ? "bg-primary" : "bg-border")} /> : null}
        </div>
      ))}
    </div>
  );
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);

  const forgotPasswordMutation = useForgotPassword();
  const verifyOtpMutation = useVerifyForgotPasswordOtp();
  const resetPasswordMutation = useResetPassword();

  const emailForm = useForm({
    defaultValues: {
      email: "",
    } satisfies ForgotPasswordRequestDto,
    onSubmit: async ({ value }) => {
      const payload = forgotPasswordSchema.parse(value);
      await forgotPasswordMutation.mutateAsync(payload);
      setEmail(payload.email);
      setStep("otp");
    },
  });

  const otpForm = useForm({
    defaultValues: {
      email,
      otp: "",
    } satisfies VerifyForgotPasswordOtpRequestDto,
    onSubmit: async ({ value }) => {
      const payload = otpSchema.parse({ ...value, email });
      const result = await verifyOtpMutation.mutateAsync(payload);
      setResetToken(result.resetToken);
      setStep("reset");
    },
  });

  const resetForm = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setResetError(null);

      if (value.newPassword !== value.confirmPassword) {
        setResetError("Passwords do not match.");
        return;
      }

      const payload = resetPasswordSchema.parse({ resetToken, newPassword: value.newPassword });
      await resetPasswordMutation.mutateAsync(payload);
      setStep("done");
    },
  });

  if (step === "done") {
    return (
      <div className="flex flex-col items-center space-y-4 py-4 text-center">
        <SuccessIcon />
        <div className="space-y-1">
          <h3 className="font-heading text-base font-medium">Password updated</h3>
          <p className="text-xs text-muted-foreground">You can now sign in with your new password.</p>
        </div>
        <Button className="h-10 w-full" onClick={() => router.replace(ROUTES.login)}>
          Back to sign in
        </Button>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div>
        <StepTracker step={3} />

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void resetForm.handleSubmit();
          }}
        >
          <resetForm.Field
            name="newPassword"
            validators={{
              onBlur: ({ value }) => {
                const result = resetPasswordSchema.shape.newPassword.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>New password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="h-10"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </resetForm.Field>

          <resetForm.Field
            name="confirmPassword"
            validators={{
              onBlur: ({ value }) => {
                const result = z.string().min(1, "Please confirm your password").safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Confirm new password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  className="h-10"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </resetForm.Field>

          {resetError ? (
            <Alert variant="destructive">
              <AlertIcon />
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          ) : null}

          {resetPasswordMutation.isError ? (
            <Alert variant="destructive">
              <AlertIcon />
              <AlertDescription>{getErrorMessage(resetPasswordMutation.error)}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" disabled={resetPasswordMutation.isPending} className="h-10 w-full">
            {resetPasswordMutation.isPending ? "Updating password..." : "Update password"}
          </Button>
        </form>
      </div>
    );
  }

  if (step === "otp") {
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
          <div className="flex items-start gap-2.5 border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-foreground">
            <MailIcon />
            <p>
              We sent a 6-digit code to <span className="font-medium">{email}</span>. Enter it below to continue.
            </p>
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
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Verification code</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  maxLength={6}
                  className="h-11 text-center text-base tracking-[0.5em]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </otpForm.Field>

          {verifyOtpMutation.isError ? (
            <Alert variant="destructive">
              <AlertIcon />
              <AlertDescription>{getErrorMessage(verifyOtpMutation.error)}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" disabled={verifyOtpMutation.isPending} className="h-10 w-full">
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify code"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 w-full"
            onClick={() => {
              setStep("email");
              setEmail("");
            }}
          >
            Use a different email
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <StepTracker step={1} />

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void emailForm.handleSubmit();
        }}
      >
        <emailForm.Field
          name="email"
          validators={{
            onBlur: ({ value }) => {
              const result = forgotPasswordSchema.shape.email.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-10"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors.length > 0 ? (
                <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
              ) : null}
            </div>
          )}
        </emailForm.Field>

        {forgotPasswordMutation.isError ? (
          <Alert variant="destructive">
            <AlertIcon />
            <AlertDescription>{getErrorMessage(forgotPasswordMutation.error)}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" disabled={forgotPasswordMutation.isPending} className="h-10 w-full">
          {forgotPasswordMutation.isPending ? "Sending code..." : "Send reset code"}
        </Button>
      </form>
    </div>
  );
}