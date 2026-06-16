"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, Compass, Trash2 } from "lucide-react";
import { formatCurrency, formatPercent } from "@/utils/format";
import { SignalBadge } from "@/components/SignalBadge";
import { TickerSearch } from "@/components/TickerSearch";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { WatchlistItem } from "@/types/finance";

type SortMode = "score" | "variation" | "decision";

function decisionLabel(item: WatchlistItem) {
  if (item.decision === "Profil favorable") return "favorable";
  if (item.decision === "Profil équilibré") return "équilibré";
  if (item.decision === "Profil prudent") return "prudent";
  if (item.decision === "Valorisation exigeante") return "à surveiller";
  if (item.score >= 78) return "favorable";
  if (item.score >= 56) return "équilibré";
  return "prudent";
}

function sortLabel(item: WatchlistItem) {
  return decisionLabel(item);
}

function formatAddedAt(addedAt?: string) {
  if (!addedAt) return "Date d’ajout indisponible";

  const date = new Date(addedAt);
  if (Number.isNaN(date.getTime())) return "Date d’ajout indisponible";

  return `Ajouté le ${new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date)}`;
}

export function WatchlistClient() {
  const { items, setItems } = useWatchlist();
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortMode === "variation") return b.dayChangePercent - a.dayChangePercent;
      if (sortMode === "decision") {
        return sortLabel(a).localeCompare(sortLabel(b));
      }
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
          Ajoutez une société depuis sa fiche ou son rapport pour la garder sous surveillance.
        </p>
      </header>

      <div className="mt-5">
        <TickerSearch compact />
      </div>

      <section className="mt-5 space-y-3">
        {items.length === 0 ? (
          <section className="premium-card rounded-3xl p-4 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-mint/15 text-mint">
              <Compass size={22} />
            </div>
            <h2 className="mt-4 text-xl font-black text-ink">
              Ajoutez vos premières entreprises à suivre.
            </h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-graphite">
              Explorez les sociétés disponibles, ouvrez une fiche ou un rapport, puis
              ajoutez les dossiers utiles à votre suivi personnel.
            </p>
            <Link
              href="/explorer"
              className="tap-feedback mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-black text-night shadow-glow"
            >
              Explorer les entreprises
              <ArrowRight size={16} />
            </Link>
          </section>
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
                    <p className="mt-1 text-xs font-bold text-graphite/60">
                      {item.sector ?? "Secteur non renseigné"}
                    </p>
                    <p className="mt-3 text-sm font-bold text-ink">
                      {decisionLabel(item)}
                    </p>
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
                <div className="mt-4 grid grid-cols-1 gap-2 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-ink">
                      {formatCurrency(item.price, item.currency ?? "EUR")}
                    </span>
                    <span
                      className={`text-sm font-black ${
                        item.dayChangePercent >= 0 ? "text-mint" : "text-rose"
                      }`}
                    >
                      {formatPercent(item.dayChangePercent)}
                    </span>
                  </div>
                  <p className="flex items-center gap-2 text-xs font-semibold text-graphite/65">
                    <CalendarClock size={14} />
                    {formatAddedAt(item.addedAt)}
                  </p>
                </div>
              </article>
            ))}
          </>
        )}
      </section>
    </main>
  );
}
