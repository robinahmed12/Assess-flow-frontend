import { RegisterForm } from "./register-form";

export function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Create your candidate account</h1>
          <p className="text-sm text-gray-600">Register with your email and verify your account with OTP.</p>
        </div>
        <RegisterForm />
      </section>
    </main>
  );
}
