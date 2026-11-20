import type { Metadata } from "next";
import { BlogPage } from "@/src/features/public-pages/components/blog-page";

export const metadata: Metadata = {
  title: "Blog & Hiring Insights — AssessFlow",
  description:
    "Engineering interview guides, objective assessment design tips, and technical talent acquisition research.",
};

export default function Page() {
  return <BlogPage />;
}
