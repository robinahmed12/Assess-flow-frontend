import Link from "next/link";
import { ROUTES } from "@/src/config/routes";
import { LoginForm } from "./login-form";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to AssessFlow</h1>
          <p className="text-sm text-gray-600">Use your registered email and password to continue.</p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          New here? <Link className="font-medium text-black underline" href={ROUTES.register}>Create an account</Link>
        </p>
      </section>
    </main>
  );
}
