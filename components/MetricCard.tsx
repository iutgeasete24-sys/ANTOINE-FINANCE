import type { IndicatorView } from "@/types/finance";
import { SignalBadge } from "./SignalBadge";

interface MetricCardProps {
  indicator: IndicatorView;
}

export function MetricCard({ indicator }: MetricCardProps) {
  return (
    <article className="premium-card rounded-2xl p-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-tight text-ink">{indicator.label}</h3>
        <SignalBadge signal={indicator.signal} compact />
      </div>
      <p className="mt-3 text-2xl font-black text-ink">{indicator.value}</p>
      <p className="mt-2 text-xs leading-relaxed text-graphite/75">
        {indicator.explanation}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">
        <span className="rounded-full bg-mist px-2 py-1 text-graphite/70">
          {indicator.scoreImpact}
        </span>
        <span className="rounded-full bg-mist px-2 py-1 text-graphite/70">
          {indicator.isAvailable
            ? indicator.isEstimated
              ? "Donnée estimée"
              : "Donnée réelle"
            : "Donnée indisponible"}
        </span>
      </div>
    </article>
  );
}
