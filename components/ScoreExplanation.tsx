import { CircleAlert } from "lucide-react";
import type { ScoreExplanation as ScoreExplanationType } from "@/types/finance";

interface ScoreExplanationProps {
  explanation: ScoreExplanationType;
}

export function ScoreExplanation({ explanation }: ScoreExplanationProps) {
  return (
    <section className="premium-card mt-5 rounded-3xl p-4">
      <div className="flex items-center gap-2">
        <CircleAlert size={18} className="text-amber" />
        <h2 className="text-lg font-black text-ink">Pourquoi ce score ?</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-graphite/75">{explanation.text}</p>
      {explanation.mainLostPoints.length > 0 && (
        <div className="mt-4 space-y-2">
          {explanation.mainLostPoints.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3"
            >
              <div>
                <p className="text-sm font-black text-ink">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-graphite/70">
                  {item.reason}
                </p>
              </div>
              <p className="shrink-0 text-sm font-black text-rose">-{item.lostPoints}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
