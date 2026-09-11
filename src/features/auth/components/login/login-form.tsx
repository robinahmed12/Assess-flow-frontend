"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { loginSchema } from "../../schemas";
import { USER_ROLES, type LoginRequestDto } from "../../types";
import { useLogin } from "../../hooks";
import { ROUTES } from "@/src/config/routes";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";

function getRoleRedirect(role: string) {
  switch (role) {
    case USER_ROLES.CANDIDATE:
      return ROUTES.candidateDashboard;
    case USER_ROLES.RECRUITER:
      return ROUTES.recruiterDashboard;
    case USER_ROLES.ADMIN:
      return ROUTES.adminDashboard;
    default:
      return ROUTES.home;
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unable to sign in. Please try again.";
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

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4">
      <path
        d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4">
      <path
        d="M2.5 2.5l15 15M8.36 8.4a2.25 2.25 0 0 0 3.2 3.19M6.1 6.12C3.6 7.4 1.5 10 1.5 10s3 5.5 8.5 5.5c1.34 0 2.53-.33 3.55-.83M14.06 5.5c2.5 1.4 4.44 4.5 4.44 4.5s-.72 1.31-2.06 2.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies LoginRequestDto,
    onSubmit: async ({ value }) => {
      const payload = loginSchema.parse(value);
      const result = await loginMutation.mutateAsync(payload);
      router.replace(getRoleRedirect(result.user.role));
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }) => {
            const result = loginSchema.shape.email.safeParse(value);
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
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onBlur: ({ value }) => {
            const result = z.string().min(1, "Password is required").safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.name}>Password</Label>
              <Link
                href={ROUTES.forgotPassword}
                className="text-[11px] font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id={field.name}
                name={field.name}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-10 pr-9"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {field.state.meta.errors.length > 0 ? (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      {loginMutation.isError ? (
        <Alert variant="destructive">
          <AlertIcon />
          <AlertDescription>{getErrorMessage(loginMutation.error)}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={loginMutation.isPending} className="h-10 w-full">
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
