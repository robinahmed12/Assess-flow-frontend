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
 * Continuously scrolling marquee strip of the teams that rely on AssessFlow.
 */
export function LandingSocialProof() {
  return (
    <section aria-label="Who AssessFlow is built for" className="border-y border-[#E6DCD0] bg-[#F5EFE6]/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl overflow-hidden px-4 py-6 sm:px-6">
        <p className="mb-4 text-center text-[11px] font-bold tracking-widest text-[#B8621B] uppercase">
          Trusted by high-performing talent teams worldwide
        </p>

        <div className="marquee-track relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-10 pr-10">
            {[...AUDIENCES, ...AUDIENCES].map((audience, index) => (
              <span
                key={`${audience}-${index}`}
                className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#E6DCD0] bg-white/80 px-4 py-1.5 text-xs font-semibold whitespace-nowrap text-[#262A56] shadow-sm transition-all hover:border-[#B8621B]/40 hover:bg-white"
              >
                <span aria-hidden className="size-1.5 rotate-45 bg-[#B8621B]" />
                {audience}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
