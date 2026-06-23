import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarClock,
  Database,
  FileText,
  Gauge,
  Globe2,
  Layers3,
  Scale,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DataTransparencyCard } from "@/components/DataTransparencyCard";
import { MetricHelpCard } from "@/components/MetricHelpCard";
import { PersonalizedAnalysisWidgets } from "@/components/PersonalizedAnalysisWidgets";
import { ScoreRing } from "@/components/ScoreRing";
import { SignalBadge } from "@/components/SignalBadge";
import { WatchButton } from "@/components/WatchButton";
import { mockStocks } from "@/data/mockStocks";
import { getStockAnalysis } from "@/lib/free-data";
import { analyzeStock } from "@/lib/scoring";
import type {
  FinancialIndicators,
  IndicatorView,
  ScoreBlock,
  ScoreBlockKey,
  StockAnalysis
} from "@/types/finance";
import { cn } from "@/utils/cn";
import { scoreSignal } from "@/utils/signals";

interface ReportPageProps {
  params: Promise<{
    ticker: string;
  }>;
}

interface ReportMetric {
  label: string;
  value: string;
  detail: string;
  indicator?: IndicatorView | null;
}

const blockLabels: Partial<Record<ScoreBlockKey, string>> = {
  growth: "Croissance",
  profitability: "Rentabilité",
  cashflow: "Free cash-flow",
  balanceSheet: "Solidité financière",
  valuation: "Valorisation",
  risks: "Risques"
};

function getIndicator(analysis: StockAnalysis, key: keyof FinancialIndicators) {
  return analysis.indicators.find((indicator) => indicator.key === key) ?? null;
}

function getBlock(analysis: StockAnalysis, key: ScoreBlockKey) {
  return analysis.scoreBlocks.find((block) => block.key === key) ?? null;
}

function indicatorValue(indicator: IndicatorView | null) {
  return indicator?.isAvailable ? indicator.value : "Donnée indisponible";
}

function indicatorDetail(indicator: IndicatorView | null, fallback: string) {
  if (!indicator) return fallback;
  return indicator.isAvailable
    ? indicator.explanation
    : `${fallback} Donnée indisponible.`;
}

function unavailableMetric(label: string, detail: string): ReportMetric {
  return {
    label,
    value: "Donnée indisponible",
    detail
  };
}

function keyMetrics(analysis: StockAnalysis): ReportMetric[] {
  const revenueGrowth = getIndicator(analysis, "revenueGrowth5Y");
  const operatingMargin = getIndicator(analysis, "operatingMargin");
  const freeCashFlow = getIndicator(analysis, "freeCashFlow");
  const netDebtToEbitda = getIndicator(analysis, "netDebtToEbitda");
  const pe = getIndicator(analysis, "pe");

  return [
    unavailableMetric(
      "Chiffre d’affaires",
      "Le montant absolu du chiffre d’affaires n’est pas présent dans les données actuelles."
    ),
    {
      label: "Croissance",
      value: indicatorValue(revenueGrowth),
      detail: indicatorDetail(
        revenueGrowth,
        "Croissance du chiffre d’affaires sur la période disponible."
      ),
      indicator: revenueGrowth
    },
    {
      label: "Marge",
      value: indicatorValue(operatingMargin),
      detail: indicatorDetail(
        operatingMargin,
        "Marge opérationnelle disponible dans le rapport."
      ),
      indicator: operatingMargin
    },
    unavailableMetric(
      "Résultat",
      "Le résultat net absolu n’est pas présent dans les données actuelles."
    ),
    {
      label: "Free cash-flow",
      value: indicatorValue(freeCashFlow),
      detail: indicatorDetail(
        freeCashFlow,
        "Cash disponible après investissements nécessaires."
      ),
      indicator: freeCashFlow
    },
    {
      label: "Dette",
      value: indicatorValue(netDebtToEbitda),
      detail: indicatorDetail(
        netDebtToEbitda,
        "Dette nette comparée à la capacité bénéficiaire."
      ),
      indicator: netDebtToEbitda
    },
    {
      label: "Valorisation",
      value: indicatorValue(pe),
      detail: indicatorDetail(pe, "Prix payé par euro de bénéfice."),
      indicator: pe
    }
  ];
}

function sectionIndicators(
  analysis: StockAnalysis,
  keys: Array<keyof FinancialIndicators>
) {
  return keys
    .map((key) => getIndicator(analysis, key))
    .filter(Boolean) as IndicatorView[];
}

function sectorComparisons(analysis: StockAnalysis) {
  return mockStocks
    .filter(
      (stock) => stock.sector === analysis.sector && stock.ticker !== analysis.ticker
    )
    .map((stock) => analyzeStock(stock))
    .slice(0, 3);
}

function ReportSection({
  children,
  eyebrow,
  title,
  icon: Icon,
  className
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <section className={cn("premium-card mt-5 rounded-3xl p-4", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-mint" />}
        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              {eyebrow}
            </p>
          )}
          <h2 className="text-xl font-black text-ink">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function ReportMetricCard({ metric }: { metric: ReportMetric }) {
  const signal = metric.indicator?.signal;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-black text-ink">{metric.label}</h3>
        {signal && <SignalBadge signal={signal} compact />}
      </div>
      <p className="mt-3 text-2xl font-black text-ink">{metric.value}</p>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-graphite">
        {metric.detail}
      </p>
      {metric.indicator && <MetricHelpCard metricKey={metric.indicator.key} />}
    </article>
  );
}

function IndicatorList({ indicators }: { indicators: IndicatorView[] }) {
  if (indicators.length === 0) {
    return (
      <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-sm font-semibold text-graphite">
        Donnée indisponible pour cette section.
      </p>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {indicators.map((indicator) => (
        <ReportMetricCard
          key={indicator.key}
          metric={{
            label: indicator.label,
            value: indicatorValue(indicator),
            detail: indicator.explanation,
            indicator
          }}
        />
      ))}
    </div>
  );
}

function BlockRead({ block }: { block: ScoreBlock | null }) {
  if (!block) {
    return (
      <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-sm font-semibold text-graphite">
        Donnée indisponible pour cette section.
      </p>
    );
  }

  const width = `${Math.round((block.score / block.max) * 100)}%`;

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-ink">
            {blockLabels[block.key] ?? block.label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-graphite">
            {block.explanation}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-black text-ink">
            {block.score}/{block.max}
          </p>
          <SignalBadge signal={block.signal} compact />
        </div>
      </div>
      {block.drivers.length > 0 && (
        <p className="mt-3 text-xs font-semibold leading-relaxed text-graphite">
          Points à comprendre : {block.drivers.join(" · ")}
        </p>
      )}
      {block.missingData.length > 0 && (
        <p className="mt-3 text-xs font-semibold leading-relaxed text-amber">
          Données indisponibles exclues du calcul : {block.missingData.join(", ")}.
        </p>
      )}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-ink" style={{ width }} />
      </div>
    </div>
  );
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { ticker } = await params;

  if (!ticker) {
    notFound();
  }

  const analysis = await getStockAnalysis(decodeURIComponent(ticker));
  const comparisons = sectorComparisons(analysis);
  const signal = scoreSignal(analysis.score);

  return (
    <main>
      <Link
        href={`/stock/${analysis.ticker}`}
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-black text-graphite"
      >
        <ArrowLeft size={17} />
        Retour à la fiche
      </Link>

      <header className="premium-card rounded-3xl p-4 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Rapport premium
            </p>
            <h1 className="mt-1 text-3xl font-black leading-tight text-ink">
              {analysis.name}
            </h1>
            <p className="mt-2 text-sm font-semibold text-graphite">
              {analysis.ticker} · {analysis.country} · {analysis.sector}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <ScoreRing score={analysis.score} signal={signal} size="sm" />
            <WatchButton analysis={analysis} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetaPill icon={Globe2} label="Devise" value={analysis.currency} />
          <MetaPill
            icon={CalendarClock}
            label="Mise à jour"
            value={analysis.dataQuality.lastUpdated}
          />
          <MetaPill
            icon={Database}
            label="Fiabilité"
            value={analysis.dataQuality.level}
          />
          <MetaPill icon={FileText} label="Source" value={analysis.dataQuality.source} />
        </div>
      </header>

      <DataTransparencyCard analysis={analysis} />

      <PersonalizedAnalysisWidgets analysis={analysis} />

      <ReportSection title="Résumé en 30 secondes" icon={Gauge}>
        <div className="mt-4 space-y-3">
          <SummaryItem
            title="Activité"
            text={`${analysis.name} est classée dans le secteur ${analysis.sector}, avec une exposition géographique principale : ${analysis.country}.`}
          />
          <SummaryList title="Points forts" items={analysis.summary.strengths} />
          <SummaryList title="Points de vigilance" items={analysis.summary.weaknesses} />
          <SummaryItem
            title="Lecture générale neutre"
            text={analysis.summary.conclusion}
          />
        </div>
      </ReportSection>

      <ReportSection title="Activité" icon={Building2}>
        <p className="mt-4 text-sm font-semibold leading-relaxed text-graphite">
          Description détaillée du business model indisponible dans les données actuelles.
          Le rapport peut seulement confirmer que {analysis.name} appartient au secteur{" "}
          {analysis.sector} et que l’analyse ci-dessous repose sur les indicateurs
          financiers disponibles.
        </p>
      </ReportSection>

      <ReportSection title="Chiffres clés" icon={BarChart3}>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {keyMetrics(analysis).map((metric) => (
            <ReportMetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </ReportSection>

      <ReportSection title="Rentabilité" icon={Gauge}>
        <BlockRead block={getBlock(analysis, "profitability")} />
        <IndicatorList
          indicators={sectionIndicators(analysis, [
            "roic",
            "roic5YAvg",
            "grossMargin",
            "operatingMargin",
            "netMargin",
            "roe"
          ])}
        />
      </ReportSection>

      <ReportSection title="Croissance" icon={TrendingUp}>
        <BlockRead block={getBlock(analysis, "growth")} />
        <IndicatorList
          indicators={sectionIndicators(analysis, [
            "revenueGrowth5Y",
            "epsGrowth5Y",
            "fcfGrowth5Y",
            "shareCountChange"
          ])}
        />
      </ReportSection>

      <ReportSection title="Solidité financière" icon={ShieldCheck}>
        <BlockRead block={getBlock(analysis, "balanceSheet")} />
        <IndicatorList
          indicators={sectionIndicators(analysis, [
            "netDebtToEbitda",
            "debtToEquity",
            "interestCoverage"
          ])}
        />
      </ReportSection>

      <ReportSection title="Valorisation" icon={Scale}>
        <BlockRead block={getBlock(analysis, "valuation")} />
        <IndicatorList
          indicators={sectionIndicators(analysis, [
            "pe",
            "peg",
            "evToEbitda",
            "priceToFcf",
            "priceToSales"
          ])}
        />
      </ReportSection>

      <ReportSection title="Risques" icon={AlertTriangle}>
        <BlockRead block={getBlock(analysis, "risks")} />
        <p className="mt-4 text-sm font-semibold leading-relaxed text-graphite">
          {analysis.summary.mainRisk}
        </p>
      </ReportSection>

      <ReportSection title="Comparaison sectorielle" icon={Layers3}>
        {comparisons.length > 0 ? (
          <div className="mt-4 space-y-3">
            {comparisons.map((peer) => (
              <article
                key={peer.ticker}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-ink">{peer.ticker}</p>
                    <p className="mt-1 text-xs font-semibold text-graphite">
                      {peer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-ink">{peer.score}/100</p>
                    <p className="text-xs font-bold text-mint">{peer.decision}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-sm font-semibold leading-relaxed text-graphite">
            Comparaison sectorielle indisponible : aucune entreprise comparable du même
            secteur n’est disponible dans les données locales actuelles.
          </p>
        )}
      </ReportSection>

      <ReportSection title="Score explicable" icon={FileText}>
        <p className="mt-4 text-sm font-semibold leading-relaxed text-graphite">
          {analysis.scoreExplanation.text}
        </p>
        <div className="mt-4 space-y-2">
          {analysis.scoreBlocks.map((block) => (
            <BlockRead key={block.key} block={block} />
          ))}
        </div>
      </ReportSection>

      <ReportSection title="Sources et données manquantes" icon={Database}>
        <div className="mt-4 grid grid-cols-1 gap-3">
          <SourceLine label="Source principale" value={analysis.dataQuality.source} />
          <SourceLine
            label="Dernière mise à jour"
            value={analysis.dataQuality.lastUpdated}
          />
          <SourceLine
            label="Complétude"
            value={`${analysis.dataQuality.completenessScore} % des données clés disponibles`}
          />
        </div>
        {analysis.dataQuality.warnings.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-amber/20 bg-amber/10 p-3 text-xs font-semibold leading-relaxed text-amber">
            {analysis.dataQuality.warnings.join(" · ")}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-sm font-semibold text-graphite">
            Aucune indisponibilité majeure n’est signalée dans les données clés du
            rapport.
          </p>
        )}
      </ReportSection>

      <section className="mt-5 rounded-3xl border border-amber/20 bg-amber/10 p-4 text-amber">
        <div className="flex gap-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">
            Les informations fournies sont générales et pédagogiques. Elles ne constituent
            pas un conseil en investissement personnalisé, une recommandation d’achat ou
            de vente, ni une garantie de performance. Investir comporte un risque de perte
            en capital.
          </p>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3">
        <Link
          href={`/stock/${analysis.ticker}`}
          className="tap-feedback flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
        >
          Revenir à la fiche action
        </Link>
      </section>
    </main>
  );
}

function MetaPill({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-black uppercase text-graphite/65">
        <Icon size={13} />
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-ink">{value}</p>
    </div>
  );
}

function SummaryItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-sm font-black text-ink">{title}</p>
      <p className="mt-1 text-sm font-semibold leading-relaxed text-graphite">{text}</p>
    </div>
  );
}

function SummaryList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-sm font-black text-ink">{title}</p>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <p key={item} className="text-sm font-semibold leading-relaxed text-graphite">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function SourceLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-sm font-bold text-graphite">{label}</p>
      <p className="text-right text-sm font-black text-ink">{value}</p>
    </div>
  );
}
