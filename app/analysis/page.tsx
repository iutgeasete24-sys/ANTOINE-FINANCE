import Link from "next/link";
import { ArrowRight, Compass, Plus } from "lucide-react";
import { AlertCard } from "@/components/AlertCard";
import { PortfolioSummaryCard } from "@/components/PortfolioSummaryCard";
import { PortfolioScoreCard } from "@/components/PortfolioScoreCard";
import { StockScoreCard } from "@/components/StockScoreCard";
import { TickerSearch } from "@/components/TickerSearch";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mockPortfolioLines } from "@/data/mockPortfolio";
import { mockStocks } from "@/data/mockStocks";
import { enrichPortfolio } from "@/lib/portfolio";
import { analyzeStock } from "@/lib/scoring";

const quickThemes = [
  { label: "Technologie", href: "/explorer?sector=Technologie" },
  { label: "Santé", href: "/explorer?sector=Sant%C3%A9" },
  { label: "Europe", href: "/explorer?country=Europe" },
  { label: "ETF", href: "/explorer?type=ETF" }
];

export default function AnalysisPage() {
  const portfolio = enrichPortfolio(mockPortfolioLines);
  const analyses = mockStocks
    .map((stock) => analyzeStock(stock))
    .sort((a, b) => b.score - a.score);
  const topScores = analyses.slice(0, 3);
  const watchCandidates = analyses
    .filter(
      (analysis) =>
        analysis.decision === "Valorisation exigeante" &&
        !topScores.some((topScore) => topScore.ticker === analysis.ticker)
    )
    .slice(0, 2);

  return (
    <main>
      <header className="pt-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Aujourd’hui
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-ink">
              Votre vue du jour.
            </h1>
          </div>
          <Link
            href="/portfolio?add=1"
            className="tap-feedback inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl bg-ink px-3 text-sm font-black text-night shadow-glow"
          >
            <Plus size={17} />
            Ajouter
          </Link>
        </div>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Le portefeuille, les points à surveiller et les recherches utiles, réunis au
          même endroit.
        </p>
      </header>

      <div className="mt-5">
        <TickerSearch compact />
      </div>

      <div className="mt-5">
        <PortfolioSummaryCard
          totalValue={portfolio.totalValue}
          totalGain={portfolio.totalGain}
          totalGainPercent={portfolio.totalGainPercent}
          lineCount={portfolio.lines.length}
        />
      </div>

      <div className="mt-5">
        <PortfolioScoreCard portfolioScore={portfolio.portfolioScore} />
      </div>

      <section className="mt-6">
        <SectionHeader
          eyebrow="Attention"
          title="À surveiller"
          action={{ href: "/portfolio", label: "Voir" }}
        />
        <AlertCard alerts={portfolio.alerts} />
        {portfolio.alerts.length === 0 && (
          <div className="rounded-3xl border border-mint/20 bg-mint/10 p-4 text-sm font-semibold text-mint">
            Aucun point prioritaire n’est remonté par les données disponibles.
          </div>
        )}
      </section>

      <section className="mt-6">
        <SectionHeader
          eyebrow="Scores"
          title="Meilleurs scores"
          action={{ href: "/compare", label: "Comparer" }}
        />
        <div className="space-y-3">
          {topScores.map((analysis) => (
            <StockScoreCard key={analysis.ticker} analysis={analysis} />
          ))}
        </div>
      </section>

      {watchCandidates.length > 0 && (
        <section className="mt-6">
          <SectionHeader
            eyebrow="Lecture"
            title="À approfondir"
            action={{ href: "/explorer", label: "Explorer" }}
          />
          <div className="space-y-3">
            {watchCandidates.map((analysis) => (
              <StockScoreCard key={analysis.ticker} analysis={analysis} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <SectionHeader eyebrow="Recherche" title="Explorer un thème" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickThemes.map((theme) => (
            <Link
              key={theme.label}
              href={theme.href}
              className="tap-feedback inline-flex min-h-11 shrink-0 items-center rounded-full border border-white/10 bg-white/[0.07] px-4 text-xs font-black text-graphite"
            >
              {theme.label}
            </Link>
          ))}
        </div>
        <Link
          href="/explorer"
          className="tap-feedback mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
        >
          <Compass size={18} />
          Rechercher une entreprise
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
