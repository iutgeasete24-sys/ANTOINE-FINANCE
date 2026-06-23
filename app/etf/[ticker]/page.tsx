import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Globe2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { ScoreRing } from "@/components/ScoreRing";
import { SignalBadge } from "@/components/SignalBadge";
import { analyzeETF, etfScoreSignal } from "@/lib/etf";

interface ETFPageProps {
  params: Promise<{
    ticker: string;
  }>;
}

export default async function ETFPage({ params }: ETFPageProps) {
  const { ticker } = await params;
  const analysis = analyzeETF(decodeURIComponent(ticker));
  if (!analysis) notFound();

  const { etf } = analysis;

  return (
    <main>
      <Link
        href="/explorer"
        className="mb-4 inline-flex items-center gap-2 text-sm font-black text-graphite"
      >
        <ArrowLeft size={17} />
        Retour Explorer
      </Link>

      <section className="premium-card rounded-3xl p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-amber">
              ETF · {etf.ticker}
            </p>
            <h1 className="mt-1 text-3xl font-black leading-tight text-ink">
              {etf.name}
            </h1>
            <p className="mt-2 text-sm font-semibold text-graphite">
              {etf.indexTracked ?? etf.subSector} ·{" "}
              {etf.geographicExposure ?? etf.country}
            </p>
          </div>
          <ScoreRing
            score={analysis.score}
            signal={etfScoreSignal(analysis.score)}
            size="sm"
          />
        </div>

        <p className="mt-5 rounded-2xl bg-white/[0.07] p-3 text-sm font-semibold leading-relaxed text-graphite">
          {analysis.summary}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Fact label="Risque" value={analysis.riskLevel} />
          <Fact label="Horizon" value={analysis.horizon} />
          <Fact label="Investisseur" value={analysis.investorType} />
          <Fact
            label="Frais"
            value={
              etf.expenseRatio === undefined ? "N/D" : `${etf.expenseRatio.toFixed(2)} %`
            }
          />
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3">
        <InfoCard icon={<Building2 size={18} />} title="Informations">
          <InfoLine label="Émetteur" value={etf.issuer ?? "Non renseigné"} />
          <InfoLine label="Indice suivi" value={etf.indexTracked ?? "Non renseigné"} />
          <InfoLine label="Classe d’actifs" value={etf.assetClass ?? "Actions"} />
          <InfoLine label="Devise" value={etf.currency} />
          <InfoLine label="Politique" value={etf.distributionPolicy ?? "Non renseigné"} />
          <InfoLine
            label="Positions"
            value={etf.positionsCount ? String(etf.positionsCount) : "Non renseigné"}
          />
        </InfoCard>

        <InfoCard icon={<Globe2 size={18} />} title="Top holdings">
          <p className="text-sm font-semibold leading-relaxed text-graphite">
            {etf.holdingsSummary ??
              "Composition détaillée indisponible avec les données actuelles."}
          </p>
          {etf.topHoldings && (
            <div className="mt-3 flex flex-wrap gap-2">
              {etf.topHoldings.map((holding) => (
                <span
                  key={holding}
                  className="rounded-full bg-white/[0.07] px-3 py-1 text-xs font-black text-ink"
                >
                  {holding}
                </span>
              ))}
            </div>
          )}
        </InfoCard>

        <InfoCard icon={<ShieldAlert size={18} />} title="Score ETF">
          <div className="space-y-3">
            {analysis.blocks.map((block) => (
              <div key={block.label} className="rounded-2xl bg-white/[0.07] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-ink">{block.label}</p>
                  <SignalBadge
                    signal={etfScoreSignal((block.score / block.max) * 100)}
                    label={`${block.score}/${block.max}`}
                    compact
                  />
                </div>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-graphite">
                  {block.explanation}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>

        <div className="premium-card rounded-3xl p-4 text-sm font-semibold leading-relaxed text-graphite">
          {analysis.mainRisk} Cette fiche aide à cadrer l’analyse, sans constituer un
          conseil en investissement.
        </div>
      </section>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.07] p-3">
      <p className="text-xs font-bold uppercase tracking-normal text-graphite">{label}</p>
      <p className="mt-1 text-sm font-black text-ink">{value}</p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="premium-card rounded-3xl p-4">
      <div className="mb-3 flex items-center gap-2 text-mint">
        {icon}
        <h2 className="text-lg font-black text-ink">{title}</h2>
      </div>
      {children}
    </article>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2 text-sm last:border-b-0">
      <span className="font-semibold text-graphite">{label}</span>
      <span className="text-right font-black text-ink">{value}</span>
    </div>
  );
}
