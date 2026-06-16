import type { Metadata } from "next";
import { PricingClient } from "@/app/pricing/pricing-client";

export const metadata: Metadata = {
  title: "Pricing | Antoine Capital Analyzer",
  description:
    "Comparer les offres Free, Plus et Pro sans paiement réel."
};

export default function PricingPage() {
  return <PricingClient />;
}
