import type { Metadata } from "next";
import { PricingPage } from "@/src/features/public-pages/components/pricing-page";

export const metadata: Metadata = {
  title: "Credit-Based Pricing — AssessFlow",
  description:
    "Pay-as-you-go assessment credit packages. Free for candidates, flexible credits for recruiters, volume tiers for enterprises.",
};

export default function Page() {
  return <PricingPage />;
}
