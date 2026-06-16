import {
  ComparisonPreview,
  DisclaimerBlock,
  FAQSection,
  FreeReportsSection,
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
      <FreeReportsSection />
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
