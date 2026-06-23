"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import type {
  FinancialIndicators,
  IndicatorView,
  Signal,
  StockAnalysis
} from "@/types/finance";
import {
  analysisPreferencesStorageKey,
  analysisWidgets,
  defaultAnalysisProfile,
  profileWidgetPresets
} from "@/data/analysisWidgets";
import { cn } from "@/utils/cn";

type WidgetStatus = "favorable" | "équilibré" | "prudent" | "à surveiller";

interface PersonalizedAnalysisWidgetsProps {
  analysis: StockAnalysis;
}

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

const statusClasses: Record<WidgetStatus, string> = {
  favorable: "border-mint/25 bg-mint/10 text-mint",
  équilibré: "border-white/10 bg-white/[0.07] text-ink",
  prudent: "border-amber/25 bg-amber/10 text-amber",
  "à surveiller": "border-rose/25 bg-rose/10 text-rose"
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

    return selectedIds.length > 0
      ? selectedIds
      : profileWidgetPresets[defaultAnalysisProfile];
  } catch {
    return profileWidgetPresets[defaultAnalysisProfile];
  }
}

function statusFromSignal(signal: Signal | null): WidgetStatus {
  if (signal === "green") return "favorable";
  if (signal === "orange") return "équilibré";
  if (signal === "red") return "prudent";
  return "à surveiller";
}

function resolveIndicator(widgetMetricKey: string, indicators: IndicatorView[]) {
  const indicatorKey = metricToIndicatorKey[widgetMetricKey];

  if (!indicatorKey) {
    return null;
  }

  return indicators.find((indicator) => indicator.key === indicatorKey) ?? null;
}

export function PersonalizedAnalysisWidgets({
  analysis
}: PersonalizedAnalysisWidgetsProps) {
  const [selectedWidgetIds] = useState(readSelectedWidgetIds);

  const selectedWidgets = useMemo(
    () => analysisWidgets.filter((widget) => selectedWidgetIds.includes(widget.id)),
    [selectedWidgetIds]
  );

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-mint">
            Ma grille
          </p>
          <h2 className="text-xl font-black text-ink">Widgets personnalisés</h2>
        </div>
        <Link
          href="/my-analysis"
          className="tap-feedback inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-3 text-xs font-black text-ink"
        >
          <Settings2 size={15} />
          Modifier ma grille
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {selectedWidgets.map((widget) => {
          const indicator = resolveIndicator(widget.metricKey, analysis.indicators);
          const hasValue = Boolean(indicator?.isAvailable);
          const status = hasValue
            ? statusFromSignal(indicator?.signal ?? null)
            : "à surveiller";

          return (
            <article key={widget.id} className="premium-card rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-ink">{widget.label}</p>
                  <p className="mt-1 text-xs font-bold text-mint">{widget.category}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-1 text-[11px] font-black",
                    statusClasses[status]
                  )}
                >
                  {status}
                </span>
              </div>

              <p className="mt-3 text-2xl font-black text-ink">
                {hasValue ? indicator?.value : "Donnée indisponible"}
              </p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-graphite">
                {widget.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
