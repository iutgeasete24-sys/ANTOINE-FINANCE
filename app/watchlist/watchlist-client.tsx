"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatCurrency, formatPercent } from "@/utils/format";
import { SignalBadge } from "@/components/SignalBadge";
import { TickerSearch } from "@/components/TickerSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { useWatchlist } from "@/hooks/useWatchlist";

type SortMode = "score" | "variation" | "decision";

export function WatchlistClient() {
  const { items, setItems } = useWatchlist();
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortMode === "variation") return b.dayChangePercent - a.dayChangePercent;
      if (sortMode === "decision") return a.decision.localeCompare(b.decision);
      return b.score - a.score;
    });
  }, [items, sortMode]);

  function removeTicker(ticker: string) {
    const next = items.filter((item) => item.ticker !== ticker);
    setItems(next);
  }

  return (
    <main>
      <header className="pt-2">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Watchlist
        </p>
        <h1 className="mt-1 text-3xl font-black text-ink">Actions à suivre</h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-graphite/70">
          Ajoutez une société depuis sa fiche pour la garder sous surveillance.
        </p>
      </header>

      <div className="mt-5">
        <TickerSearch compact />
      </div>

      <section className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState
            title="Aucune action suivie"
            description="Ajoutez ASML, AVGO ou AIR.PA depuis une fiche action pour construire votre watchlist."
          />
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                ["score", "Score"],
                ["variation", "Variation"],
                ["decision", "Décision"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSortMode(value as SortMode)}
                  className={`tap-feedback shrink-0 rounded-full border px-3 py-2 text-xs font-black ${
                    sortMode === value
                      ? "border-mint/40 bg-mint/15 text-mint"
                      : "border-white/10 bg-white/[0.07] text-graphite"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          {sortedItems.map((item) => (
            <article
              key={item.ticker}
              className="premium-card rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <Link href={`/stock/${item.ticker}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-black text-ink">{item.ticker}</p>
                    <SignalBadge signal={item.signal} compact label={`${item.score}/100`} />
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-graphite/70">
                    {item.name}
                  </p>
                  <p className="mt-3 text-sm font-bold text-ink">{item.decision}</p>
                </Link>
                <button
                  type="button"
                  onClick={() => removeTicker(item.ticker)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-mist text-graphite"
                  aria-label={`Retirer ${item.ticker}`}
                  title={`Retirer ${item.ticker}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-sm font-black text-ink">
                  {formatCurrency(item.price)}
                </span>
                <span
                  className={`text-sm font-black ${
                    item.dayChangePercent >= 0 ? "text-mint" : "text-rose"
                  }`}
                >
                  {formatPercent(item.dayChangePercent)}
                </span>
              </div>
            </article>
          ))}
          </>
        )}
      </section>
    </main>
  );
}
