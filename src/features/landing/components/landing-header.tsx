import Link from "next/link";

import { ROUTES } from "@/src/config/routes";
import { Button } from "@/src/shared/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href={ROUTES.home}
          className="font-heading text-sm font-semibold tracking-tight text-foreground"
        >
          AssessFlow
        </Link>

        {/* Nav actions */}
        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <Button variant="ghost" size="sm" render={<Link href={ROUTES.login} />}>
            Sign in
          </Button>
          <Button size="sm" render={<Link href={ROUTES.register} />}>
            Get started
          </Button>
        </nav>
      </div>
    </header>
  );
}