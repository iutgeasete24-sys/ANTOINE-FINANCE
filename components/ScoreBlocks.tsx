import type { ScoreBlock } from "@/types/finance";
import { SignalBadge } from "./SignalBadge";

interface ScoreBlocksProps {
  blocks: ScoreBlock[];
}

export function ScoreBlocks({ blocks }: ScoreBlocksProps) {
  return (
    <section className="mt-5">
      <p className="text-xs font-bold uppercase tracking-normal text-mint">
        Scoring
      </p>
      <h2 className="text-xl font-black text-ink">Sous-scores</h2>
      <div className="mt-3 space-y-3">
        {blocks.map((block) => {
          const width = `${Math.round((block.score / block.max) * 100)}%`;

          return (
            <article
              key={block.key}
              className="premium-card rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-ink">{block.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-graphite/75">
                    {block.explanation}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-ink">
                    {block.score}/{block.max}
                  </p>
                  <p className="text-[11px] font-bold text-rose">
                    -{block.lostPoints} pts
                  </p>
                  <SignalBadge signal={block.signal} compact />
                </div>
              </div>
              {block.drivers.length > 0 && (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3">
                  <p className="text-xs font-black uppercase tracking-normal text-graphite/55">
                    Points perdus
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-graphite/75">
                    {block.drivers.join(" · ")}
                  </p>
                </div>
              )}
              {block.missingData.length > 0 && (
                <p className="mt-3 text-xs font-semibold leading-relaxed text-amber">
                  Données exclues du calcul : {block.missingData.join(", ")}.
                </p>
              )}
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-ink" style={{ width }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
