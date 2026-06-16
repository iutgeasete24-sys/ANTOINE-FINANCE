import {
  ComparisonPreview,
  DisclaimerBlock,
  FAQSection,
  HeroSection,
  LandingFinalActions,
  PricingSection,
  ProblemSection,
  ReportPreview,
  SolutionSection,
  TrustSection,
  WidgetShowcase
} from "@/components/landing/LandingSections";

export default function HomePage() {
  return (
    <main className="pb-4">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ReportPreview />
      <WidgetShowcase />
      <ComparisonPreview />
      <PricingSection />
      <TrustSection />
      <FAQSection />
      <DisclaimerBlock />
      <LandingFinalActions />
    </main>
  );
}
