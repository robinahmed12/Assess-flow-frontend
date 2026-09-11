import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";

type Feature = {
  label: string;
  title: string;
  description: string;
  points: readonly string[];
};

const FEATURES: readonly Feature[] = [
  {
    label: "For Candidates",
    title: "Take assessments with confidence",
    description:
      "Receive invitations by email, answer MCQ, written, and coding questions at your own pace, and submit when ready. Your progress is autosaved so you can resume anytime.",
    points: [
      "MCQ, written & coding question types",
      "Autosave — resume from where you left off",
      "Results shown after recruiter evaluation",
    ],
  },
  {
    label: "For Recruiters",
    title: "Build and manage assessments easily",
    description:
      "Create a company problem library, build assessments from your problems, invite active candidates by email, and track every submission from a single view.",
    points: [
      "Problem library with full CRUD",
      "Draft → Publish → Archive lifecycle",
      "Invite candidates with optional expiry",
    ],
  },
  {
    label: "Smart Evaluation",
    title: "Accurate scoring, every time",
    description:
      "MCQ answers are scored automatically on submission. Written and coding answers go through structured manual scoring. Finalize and notify candidates instantly.",
    points: [
      "Automatic MCQ scoring on submit",
      "Per-answer manual scoring for open answers",
      "Result email sent on finalization",
    ],
  },
];

export function LandingFeatures() {
  return (
    <section
      aria-labelledby="features-heading"
      className="border-t bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 text-center">
          <h2
            id="features-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Everything you need to assess talent
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Purpose-built workflows for candidates, recruiters, and administrators.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.label}>
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {feature.label}
                </p>
                <CardTitle className="mt-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" aria-label={`${feature.label} highlights`}>
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span
                        className="mt-0.5 shrink-0 font-semibold text-primary"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}