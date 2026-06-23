import { AlertTriangle, Flag, ShieldQuestion } from "lucide-react";
import type { StockAnalysis } from "@/types/finance";

interface SummaryPanelProps {
  summary: StockAnalysis["summary"];
}

export function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <section className="premium-card mt-5 rounded-3xl p-4 text-ink">
      <p className="text-xs font-bold uppercase tracking-normal text-mint">Synthèse</p>
      <h2 className="mt-1 text-xl font-black">Lecture long terme</h2>
      <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.08] p-3 text-sm font-semibold leading-relaxed text-graphite">
        {summary.short}
      </p>
      <div className="mt-4 space-y-4">
        <div className="flex gap-3">
          <ShieldQuestion className="mt-0.5 shrink-0 text-rose" size={19} />
          <div>
            <h3 className="text-sm font-bold">Risque principal</h3>
            <p className="mt-1 text-sm leading-relaxed text-graphite">
              {summary.mainRisk}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber" size={19} />
          <div>
            <h3 className="text-sm font-bold">Valorisation</h3>
            <p className="mt-1 text-sm leading-relaxed text-graphite">
              {summary.valuationRead}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Flag className="mt-0.5 shrink-0 text-ink" size={19} />
          <div>
            <h3 className="text-sm font-bold">Conclusion · {summary.finalDecision}</h3>
            <p className="mt-1 text-sm leading-relaxed text-graphite">
              {summary.conclusion}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
