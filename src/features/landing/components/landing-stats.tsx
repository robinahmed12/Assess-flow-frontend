"use client";

import { useEffect, useRef, useState } from "react";

import { Reveal } from "./reveal";

const STATS = [
  { value: 3, suffix: "", label: "Roles", description: "Candidate, recruiter & admin" },
  { value: 3, suffix: "", label: "Question types", description: "MCQ, written & coding" },
  { value: 2, suffix: "", label: "Evaluation modes", description: "Automatic + manual scoring" },
  { value: 4, suffix: "", label: "Workflow steps", description: "Register → attempt → evaluate → results" },
] as const;

const COUNT_DURATION_MS = 1100;

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    let frame = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      if (startedAt === null) startedAt = now;
      const progress = Math.min((now - startedAt) / COUNT_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);

  return value;
}

function StatItem({
  stat,
  active,
}: {
  stat: (typeof STATS)[number];
  active: boolean;
}) {
  const value = useCountUp(stat.value, active);

  return (
    <div className="px-4 py-8 text-center sm:py-10">
      <p className="font-heading text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
        {value}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{stat.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
    </div>
  );
}

/** Animated band of headline numbers that count up when scrolled into view. */
export function LandingStats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="stats-heading" className="relative overflow-hidden">
      <div
        aria-hidden
        className="animate-gradient-pan absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-accent/10"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="stats-heading" className="sr-only">
          Platform at a glance
        </h2>

        <Reveal>
          <div
            ref={ref}
            className="grid divide-y divide-border border-x sm:grid-cols-2 sm:divide-x lg:grid-cols-4"
          >
            {STATS.map((stat) => (
              <StatItem key={stat.label} stat={stat} active={active} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
