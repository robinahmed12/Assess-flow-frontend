"use client";

import {
  ArticleIcon,
  ArrowRightIcon,
  ClockIcon,
} from "@phosphor-icons/react";

import { LandingHeader } from "@/src/features/landing/components/landing-header";
import { LandingFooter } from "@/src/features/landing/components/landing-footer";
import { Badge } from "@/src/shared/components/ui/badge";

const BLOG_ARTICLES = [
  {
    title: "How Structured Assessments Eliminate Hiring Bias in Tech Teams",
    excerpt:
      "Why traditional resume screening systematically overlooks non-traditional engineers, and how objective MCQ and coding challenges evaluate true capability.",
    category: "Hiring Philosophy",
    readTime: "5 min read",
    date: "November 18, 2026",
    author: "Elena Rostova",
  },
  {
    title: "Why Continuous Autosave is Critical for Coding Challenge UX",
    excerpt:
      "Analyzing 10,000+ candidate test dropouts: how real-time keystroke persistence prevents candidate panic and eliminates test disputes.",
    category: "Engineering UX",
    readTime: "4 min read",
    date: "November 14, 2026",
    author: "Marcus Chen",
  },
  {
    title: "Designing Coding Problems that Predict Real On-the-Job Performance",
    excerpt:
      "Moving beyond obscure algorithmic puzzles to real-world code architecture: caching, concurrency, and API contracts.",
    category: "Assessment Design",
    readTime: "6 min read",
    date: "November 08, 2026",
    author: "Alex Vance",
  },
  {
    title: "Hybrid Evaluation: Combining Zero-Latency Auto-Grading with Rubrics",
    excerpt:
      "How to save 60% of hiring committee time by pairing instant MCQ verification with structured scoring matrices for written designs.",
    category: "Recruitment Efficiency",
    readTime: "5 min read",
    date: "October 29, 2026",
    author: "Sadia Islam",
  },
];

export function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div
            aria-hidden
            className="landing-grid-bg absolute inset-0 -z-10 opacity-60"
          />
          <div
            aria-hidden
            className="landing-hero-glow absolute inset-x-0 -top-32 -z-10 h-96"
          />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <Badge
              variant="outline"
              className="border-[#E6DCD0] bg-white/90 px-3.5 py-1 text-xs font-semibold text-[#B8621B] shadow-sm backdrop-blur-sm"
            >
              <ArticleIcon weight="bold" className="size-3.5 text-[#B8621B]" />
              AssessFlow Engineering &amp; Hiring Journal
            </Badge>

            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-[#111322] sm:text-6xl sm:leading-tight">
              Insights on modern engineering,{" "}
              <span className="bg-gradient-to-r from-[#B8621B] via-[#9B5115] to-[#262A56] bg-clip-text text-transparent">
                assessments &amp; hiring.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5A5D70] sm:text-lg">
              Explore best practices, technical interview guides, algorithmic problem design, and product engineering updates from our team.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="border-t border-[#E6DCD0] bg-white/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2">
              {BLOG_ARTICLES.map((article) => (
                <article
                  key={article.title}
                  className="flex flex-col justify-between rounded-2xl border border-[#E6DCD0] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B8621B]/40 hover:shadow-xl hover:shadow-[#262A56]/5"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#5A5D70]">
                      <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[10px] font-bold text-[#B8621B] uppercase ring-1 ring-[#E6DCD0]">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <ClockIcon className="size-3 text-[#B8621B]" />
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className="mt-4 font-heading text-xl font-bold tracking-tight text-[#111322] sm:text-2xl">
                      {article.title}
                    </h2>

                    <p className="mt-3 text-xs leading-relaxed text-[#5A5D70] sm:text-sm">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#E6DCD0]/60 pt-4 text-xs">
                    <div>
                      <p className="font-bold text-[#111322]">{article.author}</p>
                      <p className="text-[11px] text-[#5A5D70]">{article.date}</p>
                    </div>

                    <span className="flex items-center gap-1 font-semibold text-[#B8621B] transition-colors hover:text-[#9B5115]">
                      <span>Read Guide</span>
                      <ArrowRightIcon className="size-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter Box */}
            <div className="mt-14 rounded-2xl border border-[#E6DCD0] bg-[#181B38] p-8 text-white shadow-xl text-center sm:p-12">
              <Badge className="bg-[#B8621B] text-white">
                Monthly Digest
              </Badge>
              <h3 className="mt-4 font-heading text-2xl font-bold sm:text-3xl">
                Get technical interview insights in your inbox
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-[#E3CCAE]/80 sm:text-sm">
                Join 5,000+ engineering managers and talent leaders. No marketing spam, strictly technical hiring architecture.
              </p>
              <div className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-xs text-white placeholder-white/50 focus:border-[#B8621B] focus:outline-none"
                />
                <button
                  type="button"
                  className="h-11 rounded-xl bg-[#B8621B] px-6 text-xs font-bold text-white transition-all hover:bg-[#9B5115]"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
