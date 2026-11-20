import type { Metadata } from "next";
import { ServicesPage } from "@/src/features/public-pages/components/services-page";

export const metadata: Metadata = {
  title: "Services & Capabilities — AssessFlow",
  description:
    "Explore AssessFlow's assessment builder, continuous autosave, hybrid grading, and proctoring integrity services.",
};

export default function Page() {
  return <ServicesPage />;
}
