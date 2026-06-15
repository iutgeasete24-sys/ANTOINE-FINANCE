import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Search, Star } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { TickerSearch } from "@/components/TickerSearch";
import { LinkButton } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { mockPortfolioLines } from "@/data/mockPortfolio";
import { mockStocks } from "@/data/mockStocks";
import { enrichPortfolio } from "@/lib/portfolio";
import { analyzeStock } from "@/lib/scoring";
import { formatCurrency, formatPercent } from "@/utils/format";
import { scoreSignal } from "@/utils/signals";

export default function HomePage() {
  const portfolio = enrichPortfolio(mockPortfolioLines);
  const opportunities = mockStocks
    .map((stock) => analyzeStock(stock))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const alert =
    portfolio.alerts[0] ??
    `Votre portefeuille est noté ${portfolio.portfolioScore.score}/100. Continuez à surveiller la diversification.`;

  return (
    <main>
      <header className="pt-2">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Aujourd’hui
        </p>
        <h1 className="mt-2 text-4xl font-black leading-[1.02] text-ink">
          Ce qui mérite votre attention.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Une vue courte pour décider quoi analyser, sans bruit.
        </p>
      </header>

      <SectionCard className="mt-6 rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-graphite">Total portefeuille</p>
            <p className="mt-1 text-4xl font-black text-ink">
              {formatCurrency(portfolio.totalValue, "EUR")}
            </p>
            <p
              className={`mt-2 text-sm font-black ${
                portfolio.totalGainPercent >= 0 ? "text-mint" : "text-rose"
              }`}
            >
              {formatCurrency(portfolio.totalGain, "EUR")} ·{" "}
              {formatPercent(portfolio.totalGainPercent)}
            </p>
          </div>
          <ScoreRing
            score={portfolio.portfolioScore.score}
            signal={scoreSignal(portfolio.portfolioScore.score)}
            size="sm"
          />
        </div>
        <div className="mt-4 flex gap-3 rounded-2xl border border-amber/20 bg-amber/10 p-3 text-amber">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm font-semibold leading-relaxed">{alert}</p>
        </div>
      </SectionCard>

      <div className="mt-5">
        <TickerSearch />
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <LinkButton href="/analysis" className="min-h-20 flex-col rounded-2xl">
          <Search size={20} />
          Rechercher
        </LinkButton>
        <LinkButton href="/explorer" variant="secondary" className="min-h-20 flex-col rounded-2xl">
          <Star size={20} />
          Meilleurs scores
        </LinkButton>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              À surveiller
            </p>
            <h2 className="text-xl font-black text-ink">Scores solides</h2>
          </div>
          <Link href="/explorer" className="text-xs font-black text-graphite">
            Explorer
          </Link>
        </div>
        <div className="space-y-3">
          {opportunities.map((analysis) => (
            <Link
              key={analysis.ticker}
              href={`/stock/${analysis.ticker}`}
              className="tap-feedback premium-card flex items-center justify-between rounded-2xl p-4"
            >
              <div>
                <p className="text-lg font-black text-ink">{analysis.ticker}</p>
                <p className="mt-1 text-xs font-semibold text-graphite">{analysis.name}</p>
                <p className="mt-2 text-xs font-black text-mint">{analysis.decision}</p>
              </div>
              <div className="flex items-center gap-3">
                <ScoreRing
                  score={analysis.score}
                  signal={scoreSignal(analysis.score)}
                  size="sm"
                />
                <ArrowUpRight size={18} className="text-graphite" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
