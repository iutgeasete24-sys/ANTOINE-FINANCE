import { notFound } from "next/navigation";
import { DataTransparencyCard } from "@/components/DataTransparencyCard";
import { IndicatorGrid } from "@/components/IndicatorGrid";
import { PersonalizedAnalysisWidgets } from "@/components/PersonalizedAnalysisWidgets";
import { ScoreExplanation } from "@/components/ScoreExplanation";
import { ScoreBlocks } from "@/components/ScoreBlocks";
import { StockHero } from "@/components/StockHero";
import { SummaryPanel } from "@/components/SummaryPanel";
import { TickerSearch } from "@/components/TickerSearch";
import { getStockAnalysis } from "@/lib/free-data";

interface StockPageProps {
  params: Promise<{
    ticker: string;
  }>;
}

export default async function StockPage({ params }: StockPageProps) {
  const { ticker } = await params;

  if (!ticker) {
    notFound();
  }

  const analysis = await getStockAnalysis(decodeURIComponent(ticker));

  return (
    <main>
      <div className="mb-4">
        <TickerSearch compact />
      </div>
      <StockHero analysis={analysis} />
      <DataTransparencyCard analysis={analysis} />
      <PersonalizedAnalysisWidgets analysis={analysis} />
      <SummaryPanel summary={analysis.summary} />
      <ScoreExplanation explanation={analysis.scoreExplanation} />
      <ScoreBlocks blocks={analysis.scoreBlocks} />
      <IndicatorGrid indicators={analysis.indicators} />
    </main>
  );
}
