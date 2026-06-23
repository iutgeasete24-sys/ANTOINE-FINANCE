"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X
} from "lucide-react";
import { AllocationChart } from "@/components/AllocationChart";
import { PortfolioScoreCard } from "@/components/PortfolioScoreCard";
import { PremiumSelect } from "@/components/ui/PremiumSelect";
import { brokerOptions, mockPortfolioLines } from "@/data/mockPortfolio";
import { enrichPortfolio } from "@/lib/portfolio";
import type { BrokerName, PortfolioLine } from "@/types/finance";
import { formatCurrency, formatPercent } from "@/utils/format";

const STORAGE_KEY = "aca-portfolio";
const BROKERS_STORAGE_KEY = "aca-brokers";

const emptyLine = {
  broker: "Trade Republic" as BrokerName,
  ticker: "",
  name: "",
  sector: "",
  country: "",
  currency: "EUR",
  quantity: "1",
  averagePrice: "",
  currentPrice: "",
  fees: "0",
  purchaseDate: new Date().toISOString().slice(0, 10)
};

export function PortfolioClient() {
  const [lines, setLines] = useState<PortfolioLine[]>(mockPortfolioLines);
  const [brokers, setBrokers] = useState<BrokerName[]>([...brokerOptions]);
  const [draft, setDraft] = useState(emptyLine);
  const [customBroker, setCustomBroker] = useState("");
  const [brokerError, setBrokerError] = useState("");
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [lineModalOpen, setLineModalOpen] = useState(false);
  const [lineErrors, setLineErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");

  const portfolio = useMemo(() => enrichPortfolio(lines), [lines]);
  const availableBrokers = Array.from(
    new Set(
      [...brokers, ...lines.map((line) => line.broker), customBroker].filter(Boolean)
    )
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedLines = window.localStorage.getItem(STORAGE_KEY);
        const savedBrokers = window.localStorage.getItem(BROKERS_STORAGE_KEY);

        if (savedLines) {
          setLines(JSON.parse(savedLines));
        }
        if (savedBrokers) {
          setBrokers(JSON.parse(savedBrokers));
        }
      } catch {
        setLines(mockPortfolioLines);
        setBrokers([...brokerOptions]);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("add") !== "1") return;

    openNewLineModal();
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  useEffect(() => {
    if (!lineModalOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLineModal();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [lineModalOpen]);

  function persist(next: PortfolioLine[]) {
    setLines(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function persistBrokers(next: BrokerName[]) {
    setBrokers(next);
    window.localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify(next));
  }

  function saveLine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const quantity = Number(draft.quantity);
    const averagePrice = Number(draft.averagePrice);
    const fees = Number(draft.fees || 0);

    if (!draft.broker) nextErrors.broker = "Broker requis.";
    if (!draft.ticker.trim()) nextErrors.ticker = "Ticker requis.";
    if (!Number.isFinite(quantity) || quantity <= 0) {
      nextErrors.quantity = "Quantité requise.";
    }
    if (!Number.isFinite(averagePrice) || averagePrice <= 0) {
      nextErrors.averagePrice = "Prix moyen requis.";
    }
    if (!draft.purchaseDate) nextErrors.purchaseDate = "Date requise.";
    if (draft.fees && !Number.isFinite(fees)) {
      nextErrors.fees = "Frais invalides.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setLineErrors(nextErrors);
      return;
    }

    const previousLine = lines.find((line) => line.id === editingLineId);
    const nextLine: PortfolioLine = {
      id: editingLineId ?? `line-${Date.now()}`,
      broker: draft.broker,
      ticker: draft.ticker.trim().toUpperCase(),
      name: draft.name.trim() || draft.ticker.trim().toUpperCase(),
      sector: draft.sector.trim() || "Non renseigné",
      country: draft.country.trim() || "Non renseigné",
      currency: draft.currency.trim().toUpperCase() || "EUR",
      quantity,
      averagePrice,
      currentPrice: Number(draft.currentPrice || draft.averagePrice),
      fees,
      purchaseDate: draft.purchaseDate,
      score: previousLine?.score,
      valuationScore: previousLine?.valuationScore,
      riskScore: previousLine?.riskScore,
      dataQualityScore: previousLine?.dataQualityScore
    };

    persist(
      editingLineId
        ? lines.map((line) => (line.id === editingLineId ? nextLine : line))
        : [...lines, nextLine]
    );
    setLineModalOpen(false);
    setLineErrors({});
    setDraft(emptyLine);
    setEditingLineId(null);
    setToast(editingLineId ? "Ligne modifiée." : "Ligne ajoutée au portefeuille.");
    window.setTimeout(() => setToast(""), 2600);
  }

  function removeLine(id: string) {
    persist(lines.filter((line) => line.id !== id));
  }

  function resetDemo() {
    persist(mockPortfolioLines);
    persistBrokers([...brokerOptions]);
    setEditingLineId(null);
    setDraft(emptyLine);
    setCustomBroker("");
    setLineErrors({});
    setLineModalOpen(false);
  }

  function openNewLineModal() {
    setEditingLineId(null);
    setDraft(emptyLine);
    setLineErrors({});
    setLineModalOpen(true);
  }

  function startEdit(line: PortfolioLine) {
    setEditingLineId(line.id);
    setDraft({
      broker: line.broker,
      ticker: line.ticker,
      name: line.name,
      sector: line.sector,
      country: line.country,
      currency: line.currency,
      quantity: String(line.quantity),
      averagePrice: String(line.averagePrice),
      currentPrice: String(line.currentPrice),
      fees: String(line.fees),
      purchaseDate: line.purchaseDate
    });
    setCustomBroker("");
    setLineErrors({});
    setLineModalOpen(true);
  }

  function closeLineModal() {
    setLineModalOpen(false);
    setEditingLineId(null);
    setDraft(emptyLine);
    setLineErrors({});
  }

  function addBroker() {
    const broker = customBroker.trim();
    if (!broker) {
      setBrokerError("Nom du broker requis.");
      return;
    }
    if (!brokers.includes(broker)) {
      persistBrokers([...brokers, broker]);
    }
    setDraft({ ...draft, broker });
    setCustomBroker("");
    setBrokerError("");
  }

  function removeBroker(broker: BrokerName) {
    if (lines.some((line) => line.broker === broker)) {
      setBrokerError("Impossible de supprimer un broker qui contient encore des lignes.");
      return;
    }
    persistBrokers(brokers.filter((item) => item !== broker));
    setBrokerError("");
  }

  return (
    <main>
      <header className="pt-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Portefeuille
            </p>
            <h1 className="mt-1 text-3xl font-black text-ink">Votre allocation</h1>
          </div>
          <button
            type="button"
            onClick={openNewLineModal}
            className="tap-feedback inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl bg-ink px-3 text-sm font-black text-night shadow-glow"
          >
            <Plus size={17} />
            Ajouter
          </button>
        </div>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-graphite">
          Valeur, performance et concentration en un seul endroit.
        </p>
      </header>

      <section className="premium-card mt-5 rounded-3xl p-4 text-ink">
        <p className="text-sm font-semibold text-graphite">Valeur totale</p>
        <p className="mt-1 text-4xl font-black">
          {formatCurrency(portfolio.totalValue, "EUR")}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.08] p-3">
            <p className="text-xs font-semibold text-graphite">Performance</p>
            <p
              className={`mt-1 text-lg font-black ${
                portfolio.totalGain >= 0 ? "text-mint" : "text-rose"
              }`}
            >
              {formatCurrency(portfolio.totalGain, "EUR")}
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.08] p-3">
            <p className="text-xs font-semibold text-graphite">Rendement</p>
            <p
              className={`mt-1 text-lg font-black ${
                portfolio.totalGainPercent >= 0 ? "text-mint" : "text-rose"
              }`}
            >
              {formatPercent(portfolio.totalGainPercent)}
            </p>
          </div>
        </div>
      </section>

      <PortfolioScoreCard portfolioScore={portfolio.portfolioScore} />

      {portfolio.alerts.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber/20 bg-amber/10 p-4 text-amber">
          <div className="flex gap-3">
            <AlertTriangle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-black">Point de vigilance</p>
              <div className="mt-2 space-y-1 text-sm font-semibold leading-relaxed">
                {portfolio.alerts.slice(0, 2).map((alert) => (
                  <p key={alert}>{alert}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="mt-5 grid grid-cols-2 gap-3">
        <StatCard
          label="Meilleure ligne"
          value={portfolio.bestLine?.ticker ?? "-"}
          detail={
            portfolio.bestLine ? formatPercent(portfolio.bestLine.gainPercent) : "-"
          }
        />
        <StatCard
          label="Pire ligne"
          value={portfolio.worstLine?.ticker ?? "-"}
          detail={
            portfolio.worstLine ? formatPercent(portfolio.worstLine.gainPercent) : "-"
          }
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3">
        <AllocationChart title="Secteurs" items={portfolio.bySector} />
        <AllocationChart title="Pays" items={portfolio.byCountry} compact />
        <AllocationChart title="Devises" items={portfolio.byCurrency} compact />
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Lignes
            </p>
            <h2 className="text-xl font-black text-ink">Positions</h2>
          </div>
          <button
            type="button"
            onClick={resetDemo}
            className="tap-feedback grid h-11 w-11 place-items-center rounded-xl bg-white/[0.08] text-graphite shadow-soft"
            aria-label="Réinitialiser les exemples"
            title="Réinitialiser les exemples"
          >
            <RotateCcw size={17} />
          </button>
        </div>
        <div className="space-y-3">
          {portfolio.lines.map((line) => (
            <article key={line.id} className="premium-card rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-ink">{line.ticker}</p>
                  <p className="mt-1 text-sm font-medium text-graphite/70">
                    {line.name} · {line.broker}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(line)}
                    className="tap-feedback grid h-11 w-11 place-items-center rounded-xl bg-white/[0.08] text-graphite"
                    aria-label={`Modifier ${line.ticker}`}
                    title={`Modifier ${line.ticker}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="tap-feedback grid h-11 w-11 place-items-center rounded-xl bg-white/[0.08] text-graphite"
                    aria-label={`Retirer ${line.ticker}`}
                    title={`Retirer ${line.ticker}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <LineMetric label="Valeur" value={formatCurrency(line.value, "EUR")} />
                <LineMetric label="Poids" value={`${line.weight.toFixed(1)} %`} />
                <LineMetric
                  label="Plus-value"
                  value={formatCurrency(line.gain, "EUR")}
                  tone={line.gain >= 0 ? "green" : "red"}
                />
                <LineMetric
                  label="Performance"
                  value={formatPercent(line.gainPercent)}
                  tone={line.gainPercent >= 0 ? "green" : "red"}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">Brokers</p>
        <h2 className="text-xl font-black text-ink">Comptes disponibles</h2>
        <div className="premium-card mt-3 rounded-2xl p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-2">
            <input
              value={customBroker}
              onChange={(event) => setCustomBroker(event.target.value)}
              className="field field-flush h-11"
              placeholder="Nouveau broker"
              aria-label="Nouveau broker"
            />
            <button
              type="button"
              onClick={addBroker}
              className="tap-feedback grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-night"
              aria-label="Créer un broker"
              title="Créer un broker"
            >
              <Plus size={18} />
            </button>
          </div>
          {brokerError && (
            <p className="mt-2 text-xs font-semibold text-rose">{brokerError}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {brokers.map((broker) => (
              <span
                key={broker}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-black text-graphite"
              >
                {broker}
                <button
                  type="button"
                  onClick={() => removeBroker(broker)}
                  aria-label={`Supprimer ${broker}`}
                  title={`Supprimer ${broker}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4">
        <button
          type="button"
          onClick={openNewLineModal}
          className="tap-feedback flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-sm font-black text-ink shadow-soft transition hover:bg-white/[0.11]"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </section>

      {lineModalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 backdrop-blur-xl sm:items-center"
          onMouseDown={closeLineModal}
          role="presentation"
        >
          <div
            className="animate-soft-enter w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.12] bg-paper/90 shadow-soft backdrop-blur-2xl"
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="line-modal-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-mint">
                  {editingLineId ? "Modifier" : "Ajouter"}
                </p>
                <h2 id="line-modal-title" className="mt-1 text-xl font-black text-ink">
                  {editingLineId ? "Modifier la ligne" : "Nouvelle ligne"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeLineModal}
                className="tap-feedback grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.08] text-graphite"
                aria-label="Fermer"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={saveLine}
              className="max-h-[calc(100dvh-8.5rem)] overflow-y-auto px-4 py-4 sm:max-h-[min(76dvh,680px)] sm:px-5"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <PremiumSelect
                    label="Broker"
                    value={draft.broker}
                    options={availableBrokers.map((broker) => ({
                      value: broker,
                      label: broker
                    }))}
                    onChange={(value) =>
                      setDraft({ ...draft, broker: value as BrokerName })
                    }
                  />
                  {lineErrors.broker && (
                    <p className="mt-1 text-xs font-semibold text-rose">
                      {lineErrors.broker}
                    </p>
                  )}
                </div>
                <Field label="Ticker" error={lineErrors.ticker}>
                  <input
                    value={draft.ticker}
                    onChange={(event) =>
                      setDraft({ ...draft, ticker: event.target.value })
                    }
                    className="field"
                    placeholder="ASML"
                  />
                </Field>
                <Field label="Nom">
                  <input
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    className="field"
                    placeholder="ASML Holding"
                  />
                </Field>
                <Field label="Quantité" error={lineErrors.quantity}>
                  <input
                    value={draft.quantity}
                    onChange={(event) =>
                      setDraft({ ...draft, quantity: event.target.value })
                    }
                    className="field"
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Prix moyen" error={lineErrors.averagePrice}>
                  <input
                    value={draft.averagePrice}
                    onChange={(event) =>
                      setDraft({ ...draft, averagePrice: event.target.value })
                    }
                    className="field"
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Frais" error={lineErrors.fees}>
                  <input
                    value={draft.fees}
                    onChange={(event) => setDraft({ ...draft, fees: event.target.value })}
                    className="field"
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Devise">
                  <input
                    value={draft.currency}
                    onChange={(event) =>
                      setDraft({ ...draft, currency: event.target.value })
                    }
                    className="field"
                    placeholder="EUR"
                  />
                </Field>
                <Field label="Date d’achat" error={lineErrors.purchaseDate}>
                  <input
                    type="date"
                    value={draft.purchaseDate}
                    onChange={(event) =>
                      setDraft({ ...draft, purchaseDate: event.target.value })
                    }
                    className="field"
                  />
                </Field>
              </div>

              <div className="sticky bottom-0 -mx-4 mt-5 border-t border-white/10 bg-paper/95 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 backdrop-blur-xl sm:-mx-5 sm:px-5">
                <button
                  type="submit"
                  className="tap-feedback flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-black text-night"
                >
                  <Plus size={18} />
                  {editingLineId ? "Enregistrer la ligne" : "Ajouter la ligne"}
                </button>
                {editingLineId && (
                  <button
                    type="button"
                    onClick={closeLineModal}
                    className="tap-feedback mt-2 h-11 w-full rounded-xl bg-white/[0.08] text-sm font-black text-graphite"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-ink px-4 py-3 text-sm font-black text-night shadow-soft">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}

      <Distribution
        title="Performance par broker"
        items={portfolio.byBroker}
        performance
      />
      <Distribution title="Répartition par secteur" items={portfolio.bySector} />
      <Distribution title="Répartition par devise" items={portfolio.byCurrency} />
      <Distribution title="Exposition par pays" items={portfolio.byCountry} />
      <Distribution
        title="Top 5 positions"
        items={portfolio.topPositions.map((line) => ({
          label: line.ticker,
          value: line.value,
          weight: line.weight
        }))}
      />
    </main>
  );
}

function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="premium-card rounded-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-normal text-graphite/55">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-ink">{value}</p>
      <p className="mt-1 text-sm font-bold text-graphite/70">{detail}</p>
    </div>
  );
}

function LineMetric({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone?: "green" | "red";
}) {
  return (
    <div className="rounded-2xl bg-white/[0.07] p-3">
      <p className="text-xs font-semibold text-graphite/60">{label}</p>
      <p
        className={`mt-1 font-black ${
          tone === "green" ? "text-mint" : tone === "red" ? "text-rose" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="text-xs font-bold uppercase tracking-normal text-graphite/65">
      <span>{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-xs font-semibold text-rose">{error}</span>
      )}
    </label>
  );
}

function Distribution({
  title,
  items,
  performance = false
}: {
  title: string;
  items: Array<{ label: string; value: number; weight?: number; gainPercent?: number }>;
  performance?: boolean;
}) {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="premium-card rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-ink">{item.label}</p>
              <p className="text-sm font-black text-graphite/75">
                {performance && item.gainPercent !== undefined
                  ? formatPercent(item.gainPercent)
                  : `${(item.weight ?? 0).toFixed(1)} %`}
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-mint"
                style={{ width: `${Math.min(item.weight ?? 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-graphite/65">
              {formatCurrency(item.value, "EUR")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
