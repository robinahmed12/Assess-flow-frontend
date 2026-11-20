import type { Metadata } from "next";
import { ContactPage } from "@/src/features/public-pages/components/contact-page";

export const metadata: Metadata = {
  title: "Contact & Demo Booking — AssessFlow",
  description:
    "Schedule an enterprise assessment demo, inquire about volume pricing tiers, or get in touch with AssessFlow support.",
};

export default function Page() {
  return <ContactPage />;
}
