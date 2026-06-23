import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import type { StockAnalysis } from "@/types/finance";
import { formatCurrency, formatPercent } from "@/utils/format";
import { scoreSignal } from "@/utils/signals";

interface StockScoreCardProps {
  analysis: StockAnalysis;
}

export function StockScoreCard({ analysis }: StockScoreCardProps) {
  return (
    <Link
      href={`/stock/${analysis.ticker}`}
      className="tap-feedback premium-card flex items-center justify-between gap-3 rounded-2xl p-4"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-lg font-black text-ink">{analysis.ticker}</p>
          <ArrowUpRight size={16} className="text-graphite" />
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-graphite">
          {analysis.name}
        </p>
        <p className="mt-2 text-xs font-black text-mint">
          {formatCurrency(analysis.price, analysis.currency)} ·{" "}
          {formatPercent(analysis.dayChangePercent)}
        </p>
        <p className="mt-1 truncate text-xs font-semibold text-graphite">
          {analysis.decision}
        </p>
      </div>
      <ScoreRing score={analysis.score} signal={scoreSignal(analysis.score)} size="sm" />
    </Link>
  );
}
