"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { loginSchema, USER_ROLES, type LoginRequestDto } from "../../domain";
import { useLogin } from "../../application";
import { ROUTES } from "@/src/config/routes";

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

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

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
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={field.name}>Password</label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.length > 0 ? <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p> : null}
          </div>
        )}
      </form.Field>

      {loginMutation.isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {getErrorMessage(loginMutation.error)}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
