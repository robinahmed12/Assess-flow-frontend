import type { ReactNode } from "react";

export function PaymentResultShell({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md border p-6">
        <div className="mx-auto grid size-10 place-items-center border border-foreground/10 bg-muted/40">
          {icon}
        </div>
        <h1 className="mt-4 text-center text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {description}
        </p>
        {children && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {children}
          </div>
        )}
      </div>
    </main>
  );
}
