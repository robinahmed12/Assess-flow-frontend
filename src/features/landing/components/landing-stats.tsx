"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./reveal";

const STATS = [
  { value: 100, suffix: "%", label: "Autosave Reliability", description: "Zero candidate progress lost" },
  { value: 3, suffix: "", label: "Role Archetypes", description: "Candidate, Recruiter & Admin" },
  { value: 3, suffix: "", label: "Assessment Formats", description: "MCQ, Written & Coding" },
  { value: 2, suffix: "x", label: "Faster Grading", description: "Hybrid instant + rubric evaluation" },
] as const;

const COUNT_DURATION_MS = 1200;

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
    <div className="flex flex-col items-center px-4 py-10 text-center sm:py-12">
      <p className="font-heading text-4xl font-extrabold tracking-tight text-[#B8621B] sm:text-5xl">
        {value}
        {stat.suffix}
      </p>
      <p className="mt-3 text-sm font-bold tracking-tight text-white sm:text-base">
        {stat.label}
      </p>
      <p className="mt-1 max-w-[200px] text-xs leading-relaxed text-[#E3CCAE]/80">
        {stat.description}
      </p>
    </div>
  );
}

/** High-contrast dark banner with counters that animate upon viewport intersection. */
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
    <section aria-labelledby="stats-heading" className="relative overflow-hidden bg-[#262A56] py-12 text-white">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="absolute top-0 right-1/4 -z-0 size-72 rounded-full bg-[#B8621B]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/4 -z-0 size-72 rounded-full bg-[#000000]/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="stats-heading" className="sr-only">
          Platform performance metrics
        </h2>

        <Reveal>
          <div
            ref={ref}
            className="grid divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#12142B]/80 shadow-2xl backdrop-blur-md sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4"
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
