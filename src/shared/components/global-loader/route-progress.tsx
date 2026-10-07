"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "cn";

/** Delay before painting so instant navigations never flash the bar. */
const SHOW_DELAY_MS = 150;
/** How long the bar lingers (fading out) after the route commits. */
const FADE_MS = 350;
/** Hard stop so a cancelled navigation can never strand the bar on screen. */
const FAILSAFE_MS = 15_000;

type Phase = "idle" | "scheduled" | "active";

function isPlainLeftClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/** Resolves the same-origin `<a>` a click landed on, or null. */
function getInternalAnchor(event: MouseEvent): HTMLAnchorElement | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;

  const anchor = target.closest("a");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return null;
  } catch {
    return null;
  }

  return anchor;
}

/**
 * Global route-change loader: an indeterminate bar pinned to the top of the
 * viewport while a client-side navigation is in flight.
 *
 * Next.js App Router has no `router.events`, so the bar starts on same-origin
 * link clicks (capture phase) and `popstate`, then fades out once
 * `usePathname()` reports the new route. Fast navigations cancel before the
 * show delay, so the bar never flashes.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const phaseRef = useRef<Phase>("idle");
  const showTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const failsafeTimerRef = useRef<number | null>(null);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const clearShowTimer = () => {
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
    };

    const clearFadeTimer = () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    };

    const clearFailsafeTimer = () => {
      if (failsafeTimerRef.current !== null) {
        window.clearTimeout(failsafeTimerRef.current);
        failsafeTimerRef.current = null;
      }
    };

    const start = () => {
      if (phaseRef.current !== "idle") return;

      clearFadeTimer();
      phaseRef.current = "scheduled";

      showTimerRef.current = window.setTimeout(() => {
        showTimerRef.current = null;
        phaseRef.current = "active";
        setVisible(true);
      }, SHOW_DELAY_MS);

      failsafeTimerRef.current = window.setTimeout(() => {
        failsafeTimerRef.current = null;
        finish();
      }, FAILSAFE_MS);
    };

    const finish = () => {
      clearShowTimer();
      clearFailsafeTimer();

      if (phaseRef.current !== "active") {
        phaseRef.current = "idle";
        return;
      }

      phaseRef.current = "idle";
      fadeTimerRef.current = window.setTimeout(() => {
        fadeTimerRef.current = null;
        setVisible(false);
      }, FADE_MS);
    };

    finishRef.current = finish;

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !isPlainLeftClick(event)) return;

      const anchor = getInternalAnchor(event);
      if (!anchor) return;

      // Same route (hash-only or repeated click): nothing to wait for.
      if (
        anchor.pathname === window.location.pathname &&
        anchor.search === window.location.search
      ) {
        return;
      }

      start();
    };

    const handlePopState = () => start();

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      clearShowTimer();
      clearFadeTimer();
      clearFailsafeTimer();
    };
  }, []);

  // The route committed: wind the bar down.
  useEffect(() => {
    finishRef.current();
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-primary/15 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="route-progress-bar h-full bg-primary" />
    </div>
  );
}
