import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { PersonalizedAnalysisWidgets } from "@/components/PersonalizedAnalysisWidgets";
import { SignalBadge } from "@/components/SignalBadge";
import { getStockAnalysis } from "@/lib/free-data";

interface StockDetailsPageProps {
  params: Promise<{
    ticker: string;
  }>;
}

export default async function StockDetailsPage({ params }: StockDetailsPageProps) {
  const { ticker } = await params;
  const analysis = await getStockAnalysis(decodeURIComponent(ticker));

  return (
    <main>
      <Link
        href={`/stock/${analysis.ticker}`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-black text-graphite"
      >
        <ArrowLeft size={17} />
        Retour à la fiche
      </Link>

      <header className="premium-card rounded-3xl p-4 text-ink">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Analyse détaillée
        </p>
        <h1 className="mt-1 text-3xl font-black">{analysis.ticker}</h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-graphite">
          Chaque ligne indique sa valeur, son niveau de lecture, son impact sur le score
          et la source.
        </p>
      </header>

      <PersonalizedAnalysisWidgets analysis={analysis} />

      <section className="premium-card mt-5 rounded-3xl p-4">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-mint" />
          <h2 className="text-lg font-black text-ink">Qualité des données</h2>
        </div>
        <p className="mt-2 text-sm font-semibold text-graphite/75">
          {analysis.dataQuality.completenessScore} % disponibles · qualité{" "}
          {analysis.dataQuality.level} · {analysis.dataQuality.source}
        </p>
        {analysis.dataQuality.warnings.length > 0 && (
          <div className="mt-3 rounded-2xl bg-amber/10 p-3 text-xs font-semibold leading-relaxed text-amber">
            {analysis.dataQuality.warnings.slice(0, 6).join(" · ")}
            {analysis.dataQuality.warnings.length > 6 ? " · ..." : ""}
          </div>
        )}
      </section>

      <section className="mt-5 space-y-3">
        {analysis.indicators.map((indicator) => (
          <article key={indicator.key} className="premium-card rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-ink">{indicator.label}</h2>
                <p className="mt-1 text-sm leading-relaxed text-graphite/70">
                  {indicator.explanation}
                </p>
              </div>
              <SignalBadge signal={indicator.signal} compact />
            </div>
            <p className="mt-3 text-2xl font-black text-ink">{indicator.value}</p>
            <div className="mt-3 grid grid-cols-1 gap-2 text-xs font-semibold text-graphite/70">
              <p>Impact : {indicator.scoreImpact}</p>
              <p>Source : {indicator.source}</p>
              <p>
                Statut :{" "}
                {indicator.isAvailable
                  ? indicator.isEstimated
                    ? "donnée estimée"
                    : "donnée disponible"
                  : "donnée indisponible"}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
