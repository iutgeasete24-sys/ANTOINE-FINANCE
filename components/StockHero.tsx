import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Database,
  FileSearch,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import type { StockAnalysis } from "@/types/finance";
import { formatCurrency, formatPercent } from "@/utils/format";
import { scoreSignal } from "@/utils/signals";
import { DataQualityBadge } from "./DataQualityBadge";
import { ScoreRing } from "./ScoreRing";
import { SignalBadge } from "./SignalBadge";
import { WatchButton } from "./WatchButton";

interface StockHeroProps {
  analysis: StockAnalysis;
}

export function StockHero({ analysis }: StockHeroProps) {
  const scoreTone = scoreSignal(analysis.score);
  const TrendIcon = analysis.dayChangePercent >= 0 ? TrendingUp : TrendingDown;
  const strengths = analysis.summary.strengths.slice(0, 3);
  const weaknesses = analysis.summary.weaknesses.slice(0, 3);

  return (
    <section className="premium-card rounded-3xl p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-normal text-mint">
            {analysis.ticker}
          </p>
          <h1 className="mt-1 text-3xl font-black leading-tight text-ink">
            {analysis.name}
          </h1>
          <p className="mt-2 text-sm font-semibold text-graphite">
            {analysis.sector} · {analysis.country}
          </p>
        </div>
        <WatchButton analysis={analysis} />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-3xl border border-ink/10 bg-mist/70 p-4">
        <ScoreRing score={analysis.score} signal={scoreTone} />
        <div className="min-w-0 flex-1 text-right">
          <p className="text-sm font-semibold text-graphite/65">Prix actuel</p>
          <p className="mt-1 text-3xl font-black text-ink">
            {formatCurrency(analysis.price, analysis.currency)}
          </p>
          <p
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-bold ${
              analysis.dayChangePercent >= 0
                ? "bg-mint/10 text-mint"
                : "bg-rose/10 text-rose"
            }`}
          >
            <TrendIcon size={16} />
            {formatPercent(analysis.dayChangePercent)}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-graphite/60">
              Décision
            </p>
            <p className="mt-1 text-lg font-black text-ink">{analysis.decision}</p>
          </div>
          <SignalBadge signal={scoreTone} />
        </div>
      </div>

      <div className="mt-3">
        <DataQualityBadge dataQuality={analysis.dataQuality} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <QuickRead
          icon={<CheckCircle2 size={17} />}
          title="Forces"
          tone="green"
          items={strengths}
        />
        <QuickRead
          icon={<AlertTriangle size={17} />}
          title="Vigilances"
          tone="amber"
          items={weaknesses}
        />
      </div>

      <Link
        href={`/stock/${analysis.ticker}/details`}
        className="tap-feedback mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-ink text-sm font-black text-night"
      >
        <FileSearch size={17} />
        Voir le détail du score
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-2 text-xs font-semibold text-graphite">
        <div className="flex items-center gap-2">
          <Database size={15} />
          <span>{analysis.dataQuality.source}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock size={15} />
          <span>Mis à jour le {analysis.dataQuality.lastUpdated}</span>
        </div>
        <div className="flex items-center gap-2 text-amber">
          <AlertTriangle size={15} />
          <span>
            Données gratuites, potentiellement différées. Utilisation personnelle.
          </span>
        </div>
      </div>
    </section>
  );
}

function QuickRead({
  icon,
  title,
  tone,
  items
}: {
  icon: React.ReactNode;
  title: string;
  tone: "green" | "amber";
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-mist/70 p-3">
      <p
        className={`flex items-center gap-2 text-xs font-black uppercase tracking-normal ${
          tone === "green" ? "text-mint" : "text-amber"
        }`}
      >
        {icon}
        {title}
      </p>
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
