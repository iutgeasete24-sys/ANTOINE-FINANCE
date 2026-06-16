"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Sparkles,
  X
} from "lucide-react";
import {
  pricingComparisonRows,
  pricingIntentStorageKey,
  pricingPlans,
  type PricingPlan,
  type PricingPlanId
} from "@/data/pricingPlans";
import { cn } from "@/utils/cn";

interface PricingIntent {
  plan: PricingPlanId;
  source: "pricing-page";
  clickedAt: string;
}

function recordPricingIntent(plan: PricingPlanId) {
  const nextIntent: PricingIntent = {
    plan,
    source: "pricing-page",
    clickedAt: new Date().toISOString()
  };

  try {
    const storedValue = window.localStorage.getItem(pricingIntentStorageKey);
    const storedIntents = storedValue ? JSON.parse(storedValue) : [];
    const intents = Array.isArray(storedIntents) ? storedIntents : [];
    window.localStorage.setItem(
      pricingIntentStorageKey,
      JSON.stringify([...intents, nextIntent].slice(-50))
    );
  } catch {
    window.localStorage.setItem(pricingIntentStorageKey, JSON.stringify([nextIntent]));
  }
}

export function PricingClient() {
  const router = useRouter();
  const [interestedPlan, setInterestedPlan] = useState<PricingPlan | null>(null);

  function handlePlanClick(plan: PricingPlan) {
    recordPricingIntent(plan.id);

    if (plan.id === "free") {
      router.push("/my-analysis");
      return;
    }

    setInterestedPlan(plan);
  }

  return (
    <main>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 text-sm font-black text-graphite"
      >
        <ArrowLeft size={17} />
        Retour à l’accueil
      </Link>

      <header className="premium-card rounded-3xl p-4 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Pricing
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink">
          Choisissez votre niveau d’analyse.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Les offres Plus et Pro sont en test d’intérêt. Aucun paiement réel n’est
          activé pour le moment.
        </p>
      </header>

      <section className="mt-6 space-y-3">
        {pricingPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={() => handlePlanClick(plan)} />
        ))}
      </section>

      <section className="premium-card mt-6 rounded-3xl p-4">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Comparatif
        </p>
        <h2 className="mt-1 text-xl font-black text-ink">Tableau des plans</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead className="bg-white/[0.06] text-xs uppercase text-graphite">
              <tr>
                <th className="p-3 font-black">Fonction</th>
                <th className="p-3 font-black">Free</th>
                <th className="p-3 font-black">Plus</th>
                <th className="p-3 font-black">Pro</th>
              </tr>
            </thead>
            <tbody>
              {pricingComparisonRows.map((row) => (
                <tr key={row.feature} className="border-t border-white/10">
                  <td className="p-3 font-black text-ink">{row.feature}</td>
                  <td className="p-3 font-semibold text-graphite">{row.free}</td>
                  <td className="p-3 font-semibold text-graphite">{row.plus}</td>
                  <td className="p-3 font-semibold text-graphite">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-amber/20 bg-amber/10 p-4 text-amber">
        <div className="flex gap-3">
          <Clock3 size={18} className="mt-0.5 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">
            Plus et Pro sont présentés pour mesurer l’intérêt produit. Les clics sont
            enregistrés uniquement dans le localStorage de ce navigateur.
          </p>
        </div>
      </section>

      {interestedPlan && (
        <InterestModal
          plan={interestedPlan}
          onClose={() => setInterestedPlan(null)}
        />
      )}
    </main>
  );
}

function PlanCard({
  plan,
  onSelect
}: {
  plan: PricingPlan;
  onSelect: () => void;
}) {
  return (
    <article
      className={cn(
        "rounded-3xl border p-4",
        plan.highlighted
          ? "border-mint/35 bg-mint/[0.08] shadow-glow"
          : "border-white/10 bg-white/[0.06]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black text-ink">{plan.name}</p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-graphite">
            {plan.description}
          </p>
        </div>
        {plan.highlighted && (
          <span className="rounded-full border border-mint/25 bg-mint/10 px-2 py-1 text-[11px] font-black text-mint">
            Plus demandé
          </span>
        )}
      </div>

      <p className="mt-4 text-3xl font-black text-ink">{plan.price}</p>
      <div className="mt-4 space-y-2">
        {plan.features.map((feature) => (
          <p
            key={feature}
            className="flex gap-2 text-sm font-semibold leading-relaxed text-graphite"
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-mint" />
            {feature}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "tap-feedback mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black outline-none focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night",
          plan.highlighted
            ? "bg-ink text-night shadow-glow"
            : "border border-white/10 bg-white/[0.07] text-ink"
        )}
      >
        {plan.cta}
        <ArrowRight size={16} />
      </button>
    </article>
  );
}

function InterestModal({
  plan,
  onClose
}: {
  plan: PricingPlan;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-end bg-black/55 p-3 backdrop-blur-md sm:place-items-center">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-night/90 p-4 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-mint">
                Bientôt disponible
              </p>
              <h2 className="mt-1 text-xl font-black text-ink">
                Intérêt enregistré pour {plan.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tap-feedback grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-ink"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm font-semibold leading-relaxed text-graphite">
          Aucun paiement n’a été lancé. Ce clic est simplement sauvegardé dans ce
          navigateur pour mesurer l’intérêt manuellement.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="tap-feedback flex h-12 items-center justify-center rounded-2xl bg-ink text-sm font-black text-night shadow-glow"
          >
            Continuer
          </button>
          <Link
            href="/my-analysis"
            className="tap-feedback flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
          >
            Personnaliser ma grille
          </Link>
        </div>
      </div>
    </div>
  );
}
