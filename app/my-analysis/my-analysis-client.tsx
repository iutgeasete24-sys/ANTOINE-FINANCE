"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, SlidersHorizontal } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import {
  analysisProfiles,
  analysisWidgets,
  defaultAnalysisProfile,
  profileWidgetPresets,
  widgetCategories,
  type AnalysisProfile
} from "@/data/analysisWidgets";
import { cn } from "@/utils/cn";

const STORAGE_KEY = "antoine-capital-analysis-preferences";

interface StoredAnalysisPreferences {
  profile: AnalysisProfile;
  selectedWidgetIds: string[];
  updatedAt: string;
}

interface AnalysisPreferences {
  profile: AnalysisProfile;
  selectedWidgetIds: string[];
}

const validWidgetIds = new Set(analysisWidgets.map((widget) => widget.id));
const defaultSelectedWidgetIds = profileWidgetPresets[defaultAnalysisProfile];

function isAnalysisProfile(value: unknown): value is AnalysisProfile {
  return analysisProfiles.includes(value as AnalysisProfile);
}

function sanitizeWidgetIds(value: unknown): string[] {
  if (!Array.isArray(value)) return defaultSelectedWidgetIds;

  const uniqueIds = Array.from(new Set(value));
  const validIds = uniqueIds.filter(
    (id): id is string => typeof id === "string" && validWidgetIds.has(id)
  );

  return validIds.length > 0 ? validIds : defaultSelectedWidgetIds;
}

function readStoredPreferences(): AnalysisPreferences {
  if (typeof window === "undefined") {
    return {
      profile: defaultAnalysisProfile,
      selectedWidgetIds: defaultSelectedWidgetIds
    };
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return {
      profile: defaultAnalysisProfile,
      selectedWidgetIds: defaultSelectedWidgetIds
    };
  }

  try {
    const storedPreferences = JSON.parse(storedValue) as Partial<StoredAnalysisPreferences>;
    const profile = isAnalysisProfile(storedPreferences.profile)
      ? storedPreferences.profile
      : defaultAnalysisProfile;

    return {
      profile,
      selectedWidgetIds: sanitizeWidgetIds(storedPreferences.selectedWidgetIds)
    };
  } catch {
    return {
      profile: defaultAnalysisProfile,
      selectedWidgetIds: defaultSelectedWidgetIds
    };
  }
}

export function MyAnalysisClient() {
  const [preferences, setPreferences] = useState<AnalysisPreferences>(
    readStoredPreferences
  );
  const { profile, selectedWidgetIds } = preferences;

  useEffect(() => {
    const preferences: StoredAnalysisPreferences = {
      profile,
      selectedWidgetIds,
      updatedAt: new Date().toISOString()
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [profile, selectedWidgetIds]);

  const selectedWidgets = useMemo(
    () =>
      analysisWidgets.filter((widget) =>
        selectedWidgetIds.includes(widget.id)
      ),
    [selectedWidgetIds]
  );

  function selectProfile(nextProfile: AnalysisProfile) {
    setPreferences({
      profile: nextProfile,
      selectedWidgetIds: profileWidgetPresets[nextProfile]
    });
  }

  function toggleWidget(widgetId: string) {
    setPreferences((currentPreferences) => {
      if (currentPreferences.selectedWidgetIds.includes(widgetId)) {
        return {
          ...currentPreferences,
          selectedWidgetIds: currentPreferences.selectedWidgetIds.filter(
            (id) => id !== widgetId
          )
        };
      }

      return {
        ...currentPreferences,
        selectedWidgetIds: [...currentPreferences.selectedWidgetIds, widgetId]
      };
    });
  }

  function resetProfile() {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      selectedWidgetIds: profileWidgetPresets[currentPreferences.profile]
    }));
  }

  return (
    <main>
      <header className="pt-2">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Grille personnelle
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink">
          Construisez votre analyse.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Choisissez un profil, activez vos widgets, puis gardez une grille cohérente
          pour lire chaque entreprise avec la même méthode.
        </p>
      </header>

      <SectionCard className="mt-6">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">
            <SlidersHorizontal size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Profil
            </p>
            <h2 className="mt-1 text-xl font-black text-ink">Point de départ</h2>
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              Le profil prépare une sélection de widgets. Vous pouvez ensuite l’ajuster
              librement.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {analysisProfiles.map((item) => {
            const active = item === profile;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => selectProfile(item)}
                className={cn(
                  "tap-feedback min-h-11 rounded-2xl border px-3 text-sm font-black outline-none focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night",
                  active
                    ? "border-mint/35 bg-mint/15 text-mint shadow-glow"
                    : "border-white/10 bg-white/[0.07] text-graphite"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-ink">
              {selectedWidgets.length} widgets sélectionnés
            </p>
            <p className="mt-1 text-xs font-semibold text-graphite">
              Sauvegardé sur ce navigateur
            </p>
          </div>
          <button
            type="button"
            onClick={resetProfile}
            className="tap-feedback inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-3 text-xs font-black text-ink"
          >
            <RotateCcw size={15} />
            Réinitialiser
          </button>
        </div>
      </SectionCard>

      <section className="mt-6 space-y-4">
        {widgetCategories.map((category) => {
          const Icon = category.icon;
          const categoryWidgets = analysisWidgets.filter(
            (widget) => widget.category === category.id
          );

          return (
            <SectionCard key={category.id}>
              <div className="flex gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.08] text-mint">
                  <Icon size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-ink">{category.id}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-graphite">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {categoryWidgets.map((widget) => {
                  const active = selectedWidgetIds.includes(widget.id);
                  return (
                    <button
                      key={widget.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleWidget(widget.id)}
                      className={cn(
                        "tap-feedback flex w-full items-start gap-3 rounded-2xl border p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night",
                        active
                          ? "border-mint/30 bg-mint/[0.09]"
                          : "border-white/10 bg-white/[0.05]"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border",
                          active
                            ? "border-mint/40 bg-mint/15 text-mint"
                            : "border-white/15 bg-white/[0.04] text-transparent"
                        )}
                      >
                        <CheckCircle2 size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black text-ink">
                          {widget.label}
                        </span>
                        <span className="mt-1 block text-xs font-semibold leading-relaxed text-graphite">
                          {widget.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          );
        })}
      </section>

      <SectionCard className="mt-6">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Aperçu
        </p>
        <h2 className="mt-1 text-xl font-black text-ink">Votre grille sélectionnée</h2>
        <p className="mt-2 text-sm leading-relaxed text-graphite">
          Cette grille est enregistrée gratuitement dans le navigateur. Elle pourra servir
          de base à vos prochains rapports personnalisés.
        </p>

        {selectedWidgets.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {selectedWidgets.map((widget) => (
              <article
                key={widget.id}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-ink">{widget.label}</p>
                    <p className="mt-1 text-xs font-bold text-mint">{widget.category}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.07] px-2 py-1 text-[11px] font-black uppercase text-graphite">
                    {widget.planRequired}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-graphite">
                  {widget.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-sm font-bold text-graphite">
              Aucun widget sélectionné pour le moment.
            </p>
          </div>
        )}
      </SectionCard>
    </main>
  );
}
