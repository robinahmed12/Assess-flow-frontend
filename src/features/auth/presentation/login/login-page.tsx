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
      </section>
    </main>
  );
}
