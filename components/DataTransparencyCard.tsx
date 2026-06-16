import { AlertTriangle, CheckCircle2, Database, Info } from "lucide-react";
import type { DataQualityLevel, StockAnalysis } from "@/types/finance";
import { cn } from "@/utils/cn";

export interface DataTransparencySource {
  name: string;
  detail?: string;
  url?: string;
  lastUpdated?: string;
}

export interface DataTransparencyCardProps {
  analysis: StockAnalysis;
  sources?: DataTransparencySource[];
}

function reliabilityLabel(level: DataQualityLevel) {
  if (level === "élevée") return "élevé";
  if (level === "moyenne") return "moyen";
  return "limité";
}

function reliabilityClasses(level: DataQualityLevel) {
  if (level === "élevée") return "border-mint/25 bg-mint/10 text-mint";
  if (level === "moyenne") return "border-amber/25 bg-amber/10 text-amber";
  return "border-rose/25 bg-rose/10 text-rose";
}

function displaySources(analysis: StockAnalysis, sources?: DataTransparencySource[]) {
  if (sources && sources.length > 0) return sources;
  if (analysis.dataQuality.source) {
    return [
      {
        name: analysis.dataQuality.source,
        lastUpdated: analysis.dataQuality.lastUpdated
      }
    ];
  }

  return [];
}

export function DataTransparencyCard({
  analysis,
  sources
}: DataTransparencyCardProps) {
  const availableIndicators = analysis.indicators.filter((indicator) => indicator.isAvailable);
  const missingIndicators = analysis.indicators.filter((indicator) => !indicator.isAvailable);
  const resolvedSources = displaySources(analysis, sources);
  const reliability = reliabilityLabel(analysis.dataQuality.level);

  return (
    <section className="premium-card mt-5 rounded-3xl p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">
          <Database size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-normal text-mint">
            Transparence
          </p>
          <h2 className="mt-1 text-xl font-black text-ink">Données du rapport</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-graphite">
            Cette carte indique ce qui est disponible dans cette version du rapport.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoTile label="Devise" value={analysis.currency} />
        <InfoTile label="Date de mise à jour" value={analysis.dataQuality.lastUpdated} />
        <InfoTile
          label="Données disponibles"
          value={`${availableIndicators.length}/${analysis.indicators.length}`}
        />
        <div
          className={cn(
            "rounded-2xl border p-3",
            reliabilityClasses(analysis.dataQuality.level)
          )}
        >
          <p className="text-xs font-black uppercase">Fiabilité</p>
          <p className="mt-1 text-lg font-black">{reliability}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
        <p className="flex items-center gap-2 text-sm font-black text-ink">
          <Info size={16} className="text-mint" />
          Source des données
        </p>
        {resolvedSources.length > 0 ? (
          <div className="mt-2 space-y-2">
            {resolvedSources.map((source) => (
              <p
                key={`${source.name}-${source.lastUpdated ?? ""}`}
                className="text-xs font-semibold leading-relaxed text-graphite"
              >
                {source.name}
                {source.detail ? ` · ${source.detail}` : ""}
                {source.lastUpdated ? ` · mise à jour ${source.lastUpdated}` : ""}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs font-semibold leading-relaxed text-graphite">
            Source non renseignée pour cette version de démonstration.
          </p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        <DataList
          title="Données disponibles"
          items={availableIndicators.map((indicator) => indicator.label)}
          empty="Aucune donnée disponible dans le rapport actuel."
          tone="available"
        />
        <DataList
          title="Données manquantes"
          items={missingIndicators.map((indicator) => indicator.label)}
          empty="Aucune donnée manquante signalée dans les indicateurs clés."
          tone="missing"
        />
      </div>
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-xs font-black uppercase text-graphite/65">{label}</p>
      <p className="mt-1 text-lg font-black text-ink">{value}</p>
    </div>
  );
}

function DataList({
  title,
  items,
  empty,
  tone
}: {
  title: string;
  items: string[];
  empty: string;
  tone: "available" | "missing";
}) {
  const visibleItems = items.slice(0, 10);
  const hiddenCount = Math.max(items.length - visibleItems.length, 0);
  const Icon = tone === "available" ? CheckCircle2 : AlertTriangle;
  const toneClass = tone === "available" ? "text-mint" : "text-amber";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="flex items-center gap-2 text-sm font-black text-ink">
        <Icon size={16} className={toneClass} />
        {title}
      </p>
      {items.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {visibleItems.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.07] px-2 py-1 text-[11px] font-bold text-graphite"
            >
              {item}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="rounded-full border border-white/10 bg-white/[0.07] px-2 py-1 text-[11px] font-bold text-graphite">
              +{hiddenCount}
            </span>
          )}
        </div>
      ) : (
        <p className="mt-2 text-xs font-semibold leading-relaxed text-graphite">
          {empty}
        </p>
      )}
    </div>
  );
}
