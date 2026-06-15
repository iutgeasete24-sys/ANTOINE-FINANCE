import Link from "next/link";
import { ArrowUpRight, Compass, GitCompare, Star } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { TickerSearch } from "@/components/TickerSearch";
import { LinkButton } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { mockStocks } from "@/data/mockStocks";
import { analyzeStock } from "@/lib/scoring";
import { formatCurrency } from "@/utils/format";
import { scoreSignal } from "@/utils/signals";

const quickThemes = [
  { label: "France", href: "/explorer?country=France" },
  { label: "États-Unis", href: "/explorer?country=%C3%89tats-Unis" },
  { label: "Europe", href: "/explorer?country=Europe" },
  { label: "Technologie", href: "/explorer?sector=Technologie" },
  { label: "Santé", href: "/explorer?sector=Sant%C3%A9" },
  { label: "Semi-conducteurs", href: "/explorer?sector=Technologie&subSector=Semi-conducteurs" },
  { label: "ETF", href: "/explorer?type=ETF" }
];

export default function AnalysisPage() {
  const topScores = mockStocks
    .map((stock) => analyzeStock(stock))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <main>
      <header className="pt-2">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Analyse
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink">
          Comprendre une valeur.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Recherchez une action ou un ETF, puis ouvrez le détail si le dossier mérite du temps.
        </p>
      </header>

      <div className="mt-6">
        <TickerSearch />
      </div>

      <section className="mt-6 grid grid-cols-3 gap-3">
        <LinkButton href="/explorer" variant="secondary" className="min-h-20 flex-col rounded-2xl px-2">
          <Compass size={20} />
          Explorer
        </LinkButton>
        <LinkButton href="/compare" variant="secondary" className="min-h-20 flex-col rounded-2xl">
          <GitCompare size={20} />
          Comparer
        </LinkButton>
        <LinkButton href="/watchlist" variant="secondary" className="min-h-20 flex-col rounded-2xl">
          <Star size={20} />
          Watchlist
        </LinkButton>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Repères rapides
            </p>
            <h2 className="text-xl font-black text-ink">Thèmes fréquents</h2>
          </div>
          <Link href="/explorer" className="text-xs font-black text-graphite">
            Tout voir
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickThemes.map((theme) => (
            <Link
              key={theme.label}
              href={theme.href}
              className="tap-feedback shrink-0 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-black text-graphite"
            >
              {theme.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-normal text-mint">
            Fondamentaux
          </p>
          <h2 className="text-xl font-black text-ink">Scores solides</h2>
        </div>
        <div className="space-y-3">
          {topScores.map((analysis) => (
            <Link
              key={analysis.ticker}
              href={`/stock/${analysis.ticker}`}
              className="tap-feedback premium-card flex items-center justify-between gap-4 rounded-2xl p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-black text-ink">{analysis.ticker}</p>
                  <ArrowUpRight size={16} className="text-graphite" />
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-graphite">
                  {analysis.name}
                </p>
                <p className="mt-2 text-xs font-black text-mint">
                  {formatCurrency(analysis.price, analysis.currency)} · {analysis.decision}
                </p>
              </div>
              <ScoreRing
                score={analysis.score}
                signal={scoreSignal(analysis.score)}
                size="sm"
              />
            </Link>
          ))}
        </div>
      </section>

      <SectionCard className="mt-6 rounded-3xl">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Transparence
        </p>
        <h2 className="mt-1 text-xl font-black text-ink">Le score cadre l’analyse.</h2>
        <p className="mt-2 text-sm leading-relaxed text-graphite">
          Il résume qualité, valorisation et risques avec les données disponibles.
          Une donnée absente reste visible.
        </p>
        <Link
          href="/stock/ASML"
          className="mt-4 inline-flex text-sm font-black text-mint"
        >
          Voir un exemple avec ASML
        </Link>
      </SectionCard>
    </main>
  );
}
