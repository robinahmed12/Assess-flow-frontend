import type { Metadata } from "next";

import { LandingPage } from "@/src/features/landing";

export const metadata: Metadata = {
  title: "AssessFlow — Online Assessment & Recruitment Platform",
  description:
    "AssessFlow is the complete platform for creating assessments, inviting candidates, and evaluating results. Built for recruiters and candidates alike.",
};

export default function Page() {
  return <LandingPage />;
}