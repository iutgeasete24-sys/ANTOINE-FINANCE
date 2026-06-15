"use client";

import { Check, Star } from "lucide-react";
import type { StockAnalysis } from "@/types/finance";
import { useWatchlist } from "@/hooks/useWatchlist";
import { scoreSignal } from "@/utils/signals";

interface WatchButtonProps {
  analysis: StockAnalysis;
}

export function WatchButton({ analysis }: WatchButtonProps) {
  const { items, setItems } = useWatchlist();
  const saved = items.some((item) => item.ticker === analysis.ticker);

  function toggleWatchlist() {
    const next = saved
      ? items.filter((item) => item.ticker !== analysis.ticker)
      : [
          ...items,
          {
            ticker: analysis.ticker,
            name: analysis.name,
            score: analysis.score,
            decision: analysis.decision,
            price: analysis.price,
            dayChangePercent: analysis.dayChangePercent,
            signal: scoreSignal(analysis.score)
          }
        ];

    setItems(next);
  }

  const Icon = saved ? Check : Star;

  return (
    <button
      type="button"
      onClick={toggleWatchlist}
      className="tap-feedback grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-ink transition hover:bg-white/15"
      aria-label={saved ? "Retirer de la watchlist" : "Ajouter à la watchlist"}
      title={saved ? "Retirer de la watchlist" : "Ajouter à la watchlist"}
    >
      <Icon size={20} />
    </button>
  );
}
