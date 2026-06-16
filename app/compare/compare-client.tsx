"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GitCompare, Loader2, Settings2 } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { SignalBadge } from "@/components/SignalBadge";
import {
  analysisPreferencesStorageKey,
  analysisWidgets,
  defaultAnalysisProfile,
  profileWidgetPresets,
  type AnalysisWidget
} from "@/data/analysisWidgets";
import type {
  FinancialIndicators,
  IndicatorView,
  ScoreBlockKey,
  Signal,
  StockAnalysis
} from "@/types/finance";
import { formatCurrency, formatPercent } from "@/utils/format";
import { scoreSignal } from "@/utils/signals";

const defaultTickers = ["ASML", "AVGO", "NOVO-B.CO"];

const rows: Array<{ key: ScoreBlockKey; label: string }> = [
  { key: "growth", label: "Croissance" },
  { key: "profitability", label: "Rentabilité" },
  { key: "cashflow", label: "Cash-flow" },
  { key: "balanceSheet", label: "Dette" },
  { key: "valuation", label: "Valorisation" },
  { key: "risks", label: "Risque" }
];

interface StoredAnalysisPreferences {
  selectedWidgetIds?: unknown;
}

const metricToIndicatorKey: Partial<Record<string, keyof FinancialIndicators>> = {
  roic: "roic",
  operatingMargin: "operatingMargin",
  grossMargin: "grossMargin",
  freeCashFlowMargin: "fcfMargin",
  revenueGrowth: "revenueGrowth5Y",
  earningsGrowth: "epsGrowth5Y",
  freeCashFlowGrowth: "fcfGrowth5Y",
  peRatio: "pe",
  evToEbitda: "evToEbitda",
  netDebtToEbitda: "netDebtToEbitda",
  debtToEquity: "debtToEquity",
  interestCoverage: "interestCoverage",
  dividendYield: "dividendYield",
  payoutRatio: "payoutRatio"
};

function readSelectedWidgetIds() {
  if (typeof window === "undefined") {
    return profileWidgetPresets[defaultAnalysisProfile];
  }

  const storedValue = window.localStorage.getItem(analysisPreferencesStorageKey);

  if (!storedValue) {
    return profileWidgetPresets[defaultAnalysisProfile];
  }

  try {
    const storedPreferences = JSON.parse(storedValue) as StoredAnalysisPreferences;
    if (!Array.isArray(storedPreferences.selectedWidgetIds)) {
      return profileWidgetPresets[defaultAnalysisProfile];
    }

    const availableWidgetIds = new Set(analysisWidgets.map((widget) => widget.id));
    const selectedIds = Array.from(new Set(storedPreferences.selectedWidgetIds)).filter(
      (id): id is string => typeof id === "string" && availableWidgetIds.has(id)
    );

    return selectedIds.length > 0 ? selectedIds : profileWidgetPresets[defaultAnalysisProfile];
  } catch {
    return profileWidgetPresets[defaultAnalysisProfile];
  }
}

function resolveIndicator(widget: AnalysisWidget, analysis: StockAnalysis) {
  const indicatorKey = metricToIndicatorKey[widget.metricKey];
  if (!indicatorKey) return null;
  return analysis.indicators.find((indicator) => indicator.key === indicatorKey) ?? null;
}

function indicatorValue(indicator: IndicatorView | null) {
  return indicator?.isAvailable ? indicator.value : "Donnée indisponible";
}

function indicatorSignal(indicator: IndicatorView | null): Signal {
  return indicator?.isAvailable ? indicator.signal : "orange";
}

function availableIndicator(analysis: StockAnalysis, key: keyof FinancialIndicators) {
  const indicator = analysis.indicators.find((item) => item.key === key);
  return indicator?.isAvailable ? indicator : null;
}

function bestHigher(
  analyses: StockAnalysis[],
  keys: Array<keyof FinancialIndicators>
) {
  for (const key of keys) {
    const values = analyses
      .map((analysis) => ({
        analysis,
        indicator: availableIndicator(analysis, key)
      }))
      .filter((item): item is { analysis: StockAnalysis; indicator: IndicatorView } =>
        Boolean(item.indicator)
      );

    if (values.length > 0) {
      return values.sort((a, b) => (b.indicator.rawValue ?? 0) - (a.indicator.rawValue ?? 0))[0];
    }
  }

  return null;
}

function bestLower(
  analyses: StockAnalysis[],
  keys: Array<keyof FinancialIndicators>
) {
  for (const key of keys) {
    const values = analyses
      .map((analysis) => ({
        analysis,
        indicator: availableIndicator(analysis, key)
      }))
      .filter((item): item is { analysis: StockAnalysis; indicator: IndicatorView } =>
        Boolean(item.indicator)
      );

    if (values.length > 0) {
      return values.sort((a, b) => (a.indicator.rawValue ?? 0) - (b.indicator.rawValue ?? 0))[0];
    }
  }

  return null;
}

export function CompareClient() {
  const [inputs, setInputs] = useState(defaultTickers);
  const [activeTickers, setActiveTickers] = useState(defaultTickers);
  const [analyses, setAnalyses] = useState<StockAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWidgetIds] = useState(readSelectedWidgetIds);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const results = await Promise.all(
        activeTickers
          .filter(Boolean)
          .slice(0, 3)
          .map(async (ticker) => {
            const response = await fetch(`/api/stocks/${encodeURIComponent(ticker)}`);
            return (await response.json()) as StockAnalysis;
          })
      );
      if (!cancelled) {
        setAnalyses(results);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [activeTickers]);

  const bestTicker = useMemo(() => {
    return [...analyses].sort((a, b) => b.score - a.score)[0]?.ticker;
  }, [analyses]);

  const selectedWidgets = useMemo(
    () =>
      analysisWidgets.filter((widget) =>
        selectedWidgetIds.includes(widget.id)
      ),
    [selectedWidgetIds]
  );

  const summary = useMemo(() => {
    const profitability = bestHigher(analyses, ["roic", "operatingMargin", "netMargin"]);
    const balance = bestLower(analyses, ["netDebtToEbitda", "debtToEquity"]);
    const valuation = bestHigher(analyses, ["pe", "evToEbitda", "priceToFcf"]);
    const missingByTicker = analyses
      .map((analysis) => {
        const missing = selectedWidgets
          .filter((widget) => {
            const indicator = resolveIndicator(widget, analysis);
            return !indicator?.isAvailable;
          })
          .map((widget) => widget.label);

        return {
          ticker: analysis.ticker,
          missing
        };
      })
      .filter((item) => item.missing.length > 0);

    return {
      profitability,
      balance,
      valuation,
      missingByTicker
    };
  }, [analyses, selectedWidgets]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveTickers(inputs.map((ticker) => ticker.trim().toUpperCase()).filter(Boolean));
  }

  return (
    <main>
      <header className="pt-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-bold text-ink">
          <GitCompare size={14} />
          Jusqu&apos;à 3 actions
        </div>
        <h1 className="mt-4 text-3xl font-black text-ink">Comparaison</h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-graphite/70">
          Comparez la qualité, la valorisation et le risque de trois valeurs maximum.
        </p>
      </header>

      <form onSubmit={submit} className="premium-card mt-5 rounded-2xl p-3">
        <div className="grid grid-cols-3 gap-2">
          {inputs.map((value, index) => (
            <input
              key={index}
              value={value}
              onChange={(event) => {
                const next = [...inputs];
                next[index] = event.target.value;
                setInputs(next);
              }}
              className="field mt-0 text-center uppercase"
              aria-label={`Ticker ${index + 1}`}
            />
          ))}
        </div>
        <button
          type="submit"
          className="tap-feedback mt-3 h-11 w-full rounded-xl bg-ink text-sm font-black text-night"
        >
          Comparer
        </button>
      </form>

      {loading ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm font-bold text-graphite/70">
          <Loader2 className="animate-spin" size={18} />
          Analyse en cours
        </div>
      ) : (
        <>
          <section className="mt-5 grid grid-cols-1 gap-3">
            {analyses.map((analysis) => (
              <article
                key={analysis.ticker}
                className="premium-card rounded-2xl p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-ink">{analysis.ticker}</h2>
                      {analysis.ticker === bestTicker && (
                        <span className="rounded-full border border-mint/20 bg-mint/10 px-2 py-1 text-[11px] font-black text-mint">
                          score le plus haut
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-graphite/70">
                      {analysis.name}
                    </p>
                    <p className="mt-3 text-sm font-black text-ink">
                      {analysis.decision}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-graphite/65">
                      {formatCurrency(analysis.price, analysis.currency)} ·{" "}
                      {formatPercent(analysis.dayChangePercent)}
                    </p>
                  </div>
                  <ScoreRing
                    score={analysis.score}
                    signal={scoreSignal(analysis.score)}
                    size="sm"
                  />
                </div>
              </article>
            ))}
          </section>

          <section className="premium-card mt-6 overflow-hidden rounded-2xl">
            <div className="grid grid-cols-[1.25fr_repeat(3,minmax(0,1fr))] border-b border-white/10 bg-white/[0.07] p-3 text-xs font-black uppercase tracking-normal text-graphite">
              <span>Critère</span>
              {analyses.map((analysis) => (
                <span key={analysis.ticker} className="text-center">
                  {analysis.ticker}
                </span>
              ))}
            </div>

            <ComparisonRow
              label="Score global"
              values={analyses.map((analysis) => `${analysis.score}/100`)}
              signals={analyses.map((analysis) => scoreSignal(analysis.score))}
            />
            {rows.map((row) => (
              <ComparisonRow
                key={row.key}
                label={row.label}
                values={analyses.map((analysis) => {
                  const block = analysis.scoreBlocks.find((item) => item.key === row.key);
                  return block ? `${block.score}/${block.max}` : "-";
                })}
                signals={analyses.map((analysis) => {
                  const block = analysis.scoreBlocks.find((item) => item.key === row.key);
                  return block?.signal ?? "orange";
                })}
              />
            ))}
            <ComparisonRow
              label="Décision"
              values={analyses.map((analysis) => analysis.decision)}
              signals={analyses.map((analysis) => scoreSignal(analysis.score))}
              wrap
            />
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-mint">
                  Grille personnalisée
                </p>
                <h2 className="text-xl font-black text-ink">
                  Comparaison selon votre grille d’analyse
                </h2>
              </div>
              <Link
                href="/my-analysis"
                className="tap-feedback inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-3 text-xs font-black text-ink"
              >
                <Settings2 size={15} />
                Modifier
              </Link>
            </div>

            <section className="premium-card overflow-hidden rounded-2xl">
              <div className="grid grid-cols-[1.25fr_repeat(3,minmax(0,1fr))] border-b border-white/10 bg-white/[0.07] p-3 text-xs font-black uppercase tracking-normal text-graphite">
                <span>Indicateur</span>
                {analyses.map((analysis) => (
                  <span key={analysis.ticker} className="text-center">
                    {analysis.ticker}
                  </span>
                ))}
              </div>

              {selectedWidgets.map((widget) => (
                <ComparisonRow
                  key={widget.id}
                  label={widget.label}
                  values={analyses.map((analysis) =>
                    indicatorValue(resolveIndicator(widget, analysis))
                  )}
                  signals={analyses.map((analysis) =>
                    indicatorSignal(resolveIndicator(widget, analysis))
                  )}
                  wrap
                />
              ))}
            </section>
          </section>

          <section className="premium-card mt-6 rounded-2xl p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Synthèse neutre
            </p>
            <h2 className="mt-1 text-xl font-black text-ink">Points à approfondir</h2>
            <div className="mt-4 space-y-3">
              <NeutralSummaryLine
                label="Entreprise la plus rentable"
                item={summary.profitability}
                empty="À approfondir : donnée indisponible sur la rentabilité."
                text={(item) =>
                  `${item.analysis.ticker} semble plus favorable sur ce critère (${item.indicator.label} : ${item.indicator.value}).`
                }
              />
              <NeutralSummaryLine
                label="Entreprise la moins endettée"
                item={summary.balance}
                empty="À approfondir : donnée indisponible sur l’endettement."
                text={(item) =>
                  `${item.analysis.ticker} semble plus favorable sur ce critère (${item.indicator.label} : ${item.indicator.value}).`
                }
              />
              <NeutralSummaryLine
                label="Valorisation la plus exigeante"
                item={summary.valuation}
                empty="À approfondir : donnée indisponible sur la valorisation."
                text={(item) =>
                  `${item.analysis.ticker} affiche la valorisation la plus exigeante sur ce critère (${item.indicator.label} : ${item.indicator.value}).`
                }
              />
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                <p className="text-sm font-black text-ink">Données manquantes éventuelles</p>
                {summary.missingByTicker.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {summary.missingByTicker.map((item) => (
                      <p
                        key={item.ticker}
                        className="text-xs font-semibold leading-relaxed text-amber"
                      >
                        {item.ticker} : {item.missing.join(", ")} donnée indisponible.
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-graphite">
                    Aucune donnée indisponible dans la grille personnalisée affichée.
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function NeutralSummaryLine({
  label,
  item,
  empty,
  text
}: {
  label: string;
  item: { analysis: StockAnalysis; indicator: IndicatorView } | null;
  empty: string;
  text: (item: { analysis: StockAnalysis; indicator: IndicatorView }) => string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-sm font-black text-ink">{label}</p>
      <p className="mt-1 text-xs font-semibold leading-relaxed text-graphite">
        {item ? text(item) : empty}
      </p>
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  signals,
  wrap = false
}: {
  label: string;
  values: string[];
  signals: Array<"green" | "orange" | "red">;
  wrap?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1.25fr_repeat(3,minmax(0,1fr))] border-b border-white/10 p-3 last:border-b-0">
      <p className="text-sm font-bold text-ink">{label}</p>
      {values.map((value, index) => (
        <div key={`${label}-${index}`} className="flex justify-center px-1 text-center">
          {wrap ? (
            <span className="text-[11px] font-black leading-tight text-ink">{value}</span>
          ) : (
            <SignalBadge signal={signals[index]} label={value} compact />
          )}
        </div>
      ))}
    </div>
  );
}
