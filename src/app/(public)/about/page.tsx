import type { Metadata } from "next";
import { AboutPage } from "@/src/features/public-pages/components/about-page";

export const metadata: Metadata = {
  title: "About Us — AssessFlow",
  description:
    "Learn about AssessFlow's mission, fair-hiring philosophy, assessment security, and leadership team.",
};

export default function Page() {
  return <AboutPage />;
}
