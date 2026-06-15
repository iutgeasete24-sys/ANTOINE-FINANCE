import type { IndicatorView } from "@/types/finance";
import { MetricCard } from "./MetricCard";

interface IndicatorGridProps {
  indicators: IndicatorView[];
}

export function IndicatorGrid({ indicators }: IndicatorGridProps) {
  return (
    <section className="mt-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-mint">
            Indicateurs
          </p>
          <h2 className="text-xl font-black text-ink">Lecture financière</h2>
        </div>
        <p className="text-right text-xs font-medium text-graphite/65">
          Vert, orange, rouge
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {indicators.map((indicator) => (
          <MetricCard key={indicator.key} indicator={indicator} />
        ))}
      </div>
    </section>
  );
}
