const AUDIENCES = [
  "Engineering teams",
  "Hiring managers",
  "Recruiting agencies",
  "University career centers",
  "Startup founders",
  "Talent acquisition",
  "Bootcamp programs",
  "Enterprise HR",
] as const;

/**
 * Continuously scrolling strip of the teams that use the platform.
 * Purely decorative: pauses on hover and freezes for reduced-motion users.
 */
export function LandingSocialProof() {
  return (
    <section aria-label="Who AssessFlow is built for" className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl overflow-hidden px-4 py-6 sm:px-6">
        <p className="mb-4 text-center text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Built for every kind of hiring team
        </p>

        <div className="marquee-track relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-10 pr-10">
            {[...AUDIENCES, ...AUDIENCES].map((audience, index) => (
              <span
                key={`${audience}-${index}`}
                className="flex shrink-0 items-center gap-2 text-sm font-medium whitespace-nowrap text-muted-foreground/80 transition-colors hover:text-foreground"
              >
                <span aria-hidden className="size-1.5 rotate-45 bg-primary/40" />
                {audience}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
