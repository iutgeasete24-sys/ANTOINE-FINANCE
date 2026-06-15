"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { ArrowUpRight, RotateCcw, Search, ShieldCheck } from "lucide-react";
import { mockStocks } from "@/data/mockStocks";
import { searchStockUniverse, stockUniverse } from "@/data/stockUniverse";
import { analyzeETF, etfScoreSignal } from "@/lib/etf";
import { analyzeStock } from "@/lib/scoring";
import type { StockUniverseItem } from "@/types/universe";
import { PremiumSelect } from "@/components/ui/PremiumSelect";
import { SignalBadge } from "@/components/SignalBadge";
import { ScoreRing } from "@/components/ScoreRing";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatPercent } from "@/utils/format";
import { scoreSignal } from "@/utils/signals";

type SortMode =
  | "score"
  | "valuation"
  | "growth"
  | "profitability"
  | "dividend"
  | "popularity";

const countryOptions = [
  "Monde",
  "France",
  "États-Unis",
  "Europe",
  "Pays-Bas",
  "Allemagne",
  "Suisse",
  "Danemark",
  "Royaume-Uni",
  "Japon",
  "Canada",
  "Italie",
  "Espagne"
];

const sectorOptions = [
  "Tous",
  "Technologie",
  "Santé",
  "Finance",
  "Industrie",
  "Automobile",
  "Consommation discrétionnaire",
  "Consommation défensive",
  "Énergie",
  "Matériaux",
  "Immobilier",
  "Services de communication",
  "Utilities",
  "Luxe",
  "Transport",
  "Défense",
  "ETF"
];

const typeOptions = ["Tous", "Actions", "ETF"];

const sortOptions: Array<{ value: SortMode; label: string; description: string }> = [
  { value: "score", label: "Meilleur score", description: "Score global disponible" },
  { value: "valuation", label: "Valorisation raisonnable", description: "Bloc valorisation" },
  { value: "growth", label: "Croissance forte", description: "Bloc croissance" },
  { value: "profitability", label: "Rentabilité élevée", description: "Bloc rentabilité" },
  { value: "dividend", label: "Dividende", description: "Rendement du dividende" },
  { value: "popularity", label: "Popularité", description: "Titres connus et liquides" }
];

const mockAnalysisByTicker = new Map(
  mockStocks.flatMap((stock) => {
    const analysis = analyzeStock(stock);
    return [
      [stock.ticker, analysis],
      [stock.name.toLowerCase(), analysis]
    ] as const;
  })
);

function initialParam(name: string, fallback = "") {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(name) ?? fallback;
}

function getStockAnalysisForItem(item: StockUniverseItem) {
  return (
    mockAnalysisByTicker.get(item.ticker) ??
    mockAnalysisByTicker.get(item.name.toLowerCase()) ??
    null
  );
}

function scoreForItem(item: StockUniverseItem) {
  if (item.assetType === "etf") return analyzeETF(item.ticker)?.score ?? null;
  return getStockAnalysisForItem(item)?.score ?? null;
}

function metricForItem(item: StockUniverseItem, sort: SortMode) {
  if (item.assetType === "etf") {
    const etf = analyzeETF(item.ticker);
    if (!etf) return item.popularityScore ?? 0;
    if (sort === "score") return etf.score;
    if (sort === "valuation") return 100 - (item.expenseRatio ?? 0.5) * 100;
    if (sort === "dividend") return item.distributionPolicy === "Distribuant" ? 80 : 40;
    if (sort === "popularity") return item.popularityScore ?? 60;
    return etf.score * 0.75;
  }

  const analysis = getStockAnalysisForItem(item);
  if (!analysis) {
    return sort === "popularity" ? item.popularityScore ?? 45 : 0;
  }

  if (sort === "score") return analysis.score;
  if (sort === "valuation") {
    return analysis.scoreBlocks.find((block) => block.key === "valuation")?.score ?? 0;
  }
  if (sort === "growth") {
    return analysis.scoreBlocks.find((block) => block.key === "growth")?.score ?? 0;
  }
  if (sort === "profitability") {
    return analysis.scoreBlocks.find((block) => block.key === "profitability")?.score ?? 0;
  }
  if (sort === "dividend") {
    return analysis.indicators.find((indicator) => indicator.key === "dividendYield")?.rawValue ?? 0;
  }
  return item.popularityScore ?? analysis.score;
}

export function ExplorerClient() {
  const [query, setQuery] = useState(() => initialParam("q"));
  const [country, setCountry] = useState(() => initialParam("country", "Monde"));
  const [sector, setSector] = useState(() => initialParam("sector", "Tous"));
  const [subSector, setSubSector] = useState(() => initialParam("subSector"));
  const [assetType, setAssetType] = useState(() => initialParam("type", "Tous"));
  const [exchange, setExchange] = useState("Tous");
  const [sort, setSort] = useState<SortMode>("score");
  const deferredQuery = useDeferredValue(query);

  const exchangeOptions = useMemo(
    () => ["Tous", ...Array.from(new Set(stockUniverse.map((item) => item.exchange))).sort()],
    []
  );

  const subSectorOptions = useMemo(() => {
    const filtered = stockUniverse.filter((item) => sector === "Tous" || item.sector === sector);
    return Array.from(new Set(filtered.map((item) => item.subSector))).sort();
  }, [sector]);

  const results = useMemo(() => {
    const hasSearch = deferredQuery.trim().length > 0;
    const queryResults = deferredQuery.trim()
      ? searchStockUniverse(deferredQuery, 80)
      : stockUniverse;

    return queryResults
      .filter((item) => country === "Monde" || item.country === country || item.region === country)
      .filter((item) => sector === "Tous" || item.sector === sector)
      .filter((item) => !subSector || item.subSector === subSector)
      .filter((item) =>
        assetType === "Tous"
          ? true
          : assetType === "ETF"
            ? item.assetType === "etf"
            : item.assetType === "stock"
      )
      .filter((item) => exchange === "Tous" || item.exchange === exchange)
      .sort((a, b) => metricForItem(b, sort) - metricForItem(a, sort))
      .slice(0, hasSearch ? 24 : 12);
  }, [assetType, country, deferredQuery, exchange, sector, sort, subSector]);

  function resetFilters() {
    setQuery("");
    setCountry("Monde");
    setSector("Tous");
    setSubSector("");
    setAssetType("Tous");
    setExchange("Tous");
    setSort("score");
  }

  return (
    <main>
      <header className="pt-2">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Explorer
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink">
          Explorer simplement.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Filtrez par zone, secteur ou type d’actif. Les scores structurent l’analyse,
          sans promettre de performance.
        </p>
      </header>

      <section className="mt-6 space-y-3">
        <div className="premium-card flex items-center gap-2 rounded-2xl p-2">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.08] text-mint">
            <Search size={19} />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher Vinci, Nvidia, ETF World..."
            className="min-w-0 flex-1 bg-transparent text-base font-black text-ink outline-none placeholder:font-semibold placeholder:text-graphite"
          />
        </div>
        <p className="px-1 text-xs font-semibold leading-relaxed text-graphite">
          La sélection reste courte par défaut pour garder la lecture rapide.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <PremiumSelect
            label="Pays"
            value={country}
            options={countryOptions.map((item) => ({ value: item, label: item }))}
            onChange={setCountry}
          />
          <PremiumSelect
            label="Type"
            value={assetType}
            options={typeOptions.map((item) => ({ value: item, label: item }))}
            onChange={setAssetType}
          />
          <PremiumSelect
            label="Secteur"
            value={sector}
            options={sectorOptions.map((item) => ({ value: item, label: item }))}
            onChange={(value) => {
              setSector(value);
              setSubSector("");
            }}
          />
          <PremiumSelect
            label="Marché"
            value={exchange}
            options={exchangeOptions.map((item) => ({ value: item, label: item }))}
            onChange={setExchange}
          />
        </div>

        <PremiumSelect
          label="Tri"
          value={sort}
          options={sortOptions}
          onChange={(value) => setSort(value as SortMode)}
        />

        {subSectorOptions.length > 0 && sector !== "Tous" && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-normal text-graphite">
              Sous-secteurs
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Chip active={!subSector} label="Tous" onClick={() => setSubSector("")} />
              {subSectorOptions.map((item) => (
                <Chip
                  key={item}
                  active={subSector === item}
                  label={item}
                  onClick={() => setSubSector(item)}
                />
              ))}
            </div>
          </div>
        )}

        <Button variant="secondary" className="w-full" onClick={resetFilters}>
          <RotateCcw size={16} />
          Réinitialiser les filtres
        </Button>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Résultats
            </p>
            <h2 className="text-xl font-black text-ink">
              {results.length} titre{results.length > 1 ? "s" : ""}
            </h2>
          </div>
          <p className="text-right text-xs font-semibold text-graphite">
            Tri : {sortOptions.find((item) => item.value === sort)?.label}
          </p>
        </div>

        {results.length === 0 ? (
          <EmptyState
            title="Aucun résultat"
            description="Essayez de retirer un filtre ou d’élargir la recherche."
          />
        ) : (
          <div className="space-y-3">
            {results.map((item) => (
              <ExplorerCard key={`${item.ticker}-${item.exchange}`} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="premium-card mt-6 rounded-3xl p-4">
        <div className="flex gap-3">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-mint" />
          <p className="text-sm font-semibold leading-relaxed text-graphite">
            Les classements utilisent les données disponibles et ne remplacent pas une analyse personnelle.
          </p>
        </div>
      </section>
    </main>
  );
}

function Chip({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap-feedback shrink-0 rounded-full border px-3 py-2 text-xs font-black ${
        active
          ? "border-mint/40 bg-mint/15 text-mint"
          : "border-white/10 bg-white/[0.07] text-graphite"
      }`}
    >
      {label}
    </button>
  );
}

function ExplorerCard({ item }: { item: StockUniverseItem }) {
  const stockAnalysis = item.assetType === "stock" ? getStockAnalysisForItem(item) : null;
  const etfAnalysis = item.assetType === "etf" ? analyzeETF(item.ticker) : null;
  const score = stockAnalysis?.score ?? etfAnalysis?.score ?? null;
  const signal = score === null ? "orange" : scoreSignal(score);
  const href =
    item.assetType === "etf"
      ? `/etf/${encodeURIComponent(item.ticker)}`
      : `/stock/${encodeURIComponent(item.ticker)}`;

  return (
    <Link
      href={href}
      className="tap-feedback premium-card flex items-center justify-between gap-4 rounded-3xl p-4"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xl font-black text-ink">{item.ticker}</p>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-black ${
              item.assetType === "etf" ? "bg-amber/15 text-amber" : "bg-mint/15 text-mint"
            }`}
          >
            {item.type}
          </span>
          {score === null ? (
            <span className="rounded-full bg-white/[0.07] px-2 py-1 text-[10px] font-black text-graphite">
              Score N/D
            </span>
          ) : (
            <SignalBadge signal={signal} compact label={`${score}/100`} />
          )}
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-graphite">
          {item.name}
        </p>
        <p className="mt-1 text-xs font-semibold text-graphite">
          {item.country} · {item.sector} · {item.subSector}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-graphite/70">
          Sources gratuites : {item.sourcePossible.join(" · ")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-white/[0.07] px-2 py-1 text-graphite">
            {item.exchange}
          </span>
          {stockAnalysis && (
            <>
              <span className="rounded-full bg-white/[0.07] px-2 py-1 text-ink">
                {stockAnalysis.decision}
              </span>
              <span className="rounded-full bg-white/[0.07] px-2 py-1 text-graphite">
                {formatCurrency(stockAnalysis.price, stockAnalysis.currency)}
              </span>
              <span
                className={`rounded-full px-2 py-1 ${
                  stockAnalysis.dayChangePercent >= 0
                    ? "bg-mint/12 text-mint"
                    : "bg-rose/12 text-rose"
                }`}
              >
                {formatPercent(stockAnalysis.dayChangePercent)}
              </span>
            </>
          )}
          {etfAnalysis && (
            <>
              <span className="rounded-full bg-white/[0.07] px-2 py-1 text-ink">
                {etfAnalysis.riskLevel}
              </span>
              <span className="rounded-full bg-white/[0.07] px-2 py-1 text-graphite">
                {item.expenseRatio === undefined ? "Frais N/D" : `${item.expenseRatio.toFixed(2)} %`}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {score !== null && (
          <ScoreRing
            score={score}
            signal={item.assetType === "etf" ? etfScoreSignal(score) : scoreSignal(score)}
            size="sm"
          />
        )}
        <ArrowUpRight size={18} className="text-graphite" />
      </div>
    </Link>
  );
}
