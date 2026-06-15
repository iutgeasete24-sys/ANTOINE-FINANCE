"use client";

import {
  type CSSProperties,
  FormEvent,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Clock,
  Loader2,
  Search,
  X
} from "lucide-react";
import { searchStockUniverse, stockUniverse } from "@/data/stockUniverse";
import { SearchOverlay } from "@/components/SearchOverlay";
import type { StockUniverseItem } from "@/types/universe";
import { cn } from "@/utils/cn";

const RECENTS_KEY = "aca-recent-searches";
const searchDockStyle: CSSProperties = {
  top: "calc(var(--search-viewport-top, 0px) + env(safe-area-inset-top) + 0.75rem)"
};
const suggestionsPanelStyle: CSSProperties = {
  maxHeight:
    "calc(var(--search-viewport-height, 100dvh) - var(--search-viewport-top, 0px) - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 7.25rem)"
};

export interface TickerSearchAutocompleteProps {
  compact?: boolean;
  autoFocus?: boolean;
}

function readRecents() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENTS_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function TickerSearchAutocomplete({
  compact = false,
  autoFocus = false
}: TickerSearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loadingTicker, setLoadingTicker] = useState<string | null>(null);
  const [recentTickers, setRecentTickers] = useState<string[]>(readRecents);
  const deferredQuery = useDeferredValue(query);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputWasActiveRef = useRef(false);
  const router = useRouter();
  const hasQuery = deferredQuery.trim().length > 0;

  const suggestions = useMemo(() => {
    if (!hasQuery) return [];
    return searchStockUniverse(deferredQuery, compact ? 8 : 10);
  }, [compact, deferredQuery, hasQuery]);

  const recentItems = useMemo(
    () =>
      recentTickers
        .map((ticker) => stockUniverse.find((item) => item.ticker === ticker))
        .filter(Boolean) as StockUniverseItem[],
    [recentTickers]
  );

  const showPanel = isFocused;

  const closeSearch = useCallback((clearQuery = false) => {
    if (clearQuery) setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeSearch(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [closeSearch]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSearch(false);
      }
    }

    if (!showPanel) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeSearch, showPanel]);

  useEffect(() => {
    if (!showPanel) return;

    function syncVisualViewport() {
      const viewport = window.visualViewport;
      rootRef.current?.style.setProperty(
        "--search-viewport-height",
        `${viewport?.height ?? window.innerHeight}px`
      );
      rootRef.current?.style.setProperty(
        "--search-viewport-top",
        `${viewport?.offsetTop ?? 0}px`
      );
    }

    syncVisualViewport();
    window.visualViewport?.addEventListener("resize", syncVisualViewport);
    window.visualViewport?.addEventListener("scroll", syncVisualViewport);
    window.addEventListener("resize", syncVisualViewport);

    return () => {
      window.visualViewport?.removeEventListener("resize", syncVisualViewport);
      window.visualViewport?.removeEventListener("scroll", syncVisualViewport);
      window.removeEventListener("resize", syncVisualViewport);
    };
  }, [showPanel]);

  function saveRecent(ticker: string) {
    const next = [ticker, ...recentTickers.filter((item) => item !== ticker)].slice(0, 8);
    setRecentTickers(next);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  }

  function openTicker(ticker: string) {
    const normalized = ticker.trim().toUpperCase();
    if (!normalized) return;
    const asset = stockUniverse.find((item) => item.ticker === normalized);
    setLoadingTicker(normalized);
    closeSearch(false);
    saveRecent(normalized);
    router.push(
      asset?.assetType === "etf"
        ? `/etf/${encodeURIComponent(normalized)}`
        : `/stock/${encodeURIComponent(normalized)}`
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = suggestions[0]?.ticker ?? query;
    openTicker(first);
  }

  function togglePanel() {
    if (isFocused) {
      closeSearch(false);
      return;
    }

    setIsFocused(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeAndClear() {
    closeSearch(true);
  }

  return (
    <>
      <SearchOverlay open={showPanel} onClose={() => closeSearch(false)} />
      <div
        ref={rootRef}
        style={showPanel ? searchDockStyle : undefined}
        className={cn(
          "w-full transition-all duration-300 ease-out",
          showPanel
            ? "fixed left-1/2 z-[70] w-[calc(100vw-1.5rem)] max-w-xl -translate-x-1/2 motion-safe:animate-soft-enter"
            : "relative"
        )}
      >
        <form
          onSubmit={onSubmit}
          className={cn(
            "premium-card flex w-full items-center gap-2 rounded-2xl p-2 transition-all duration-300 ease-out",
            showPanel && "border-white/20 shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
          )}
        >
          <button
            type="button"
            onClick={togglePanel}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-mint"
            aria-label={isFocused ? "Fermer la recherche" : "Ouvrir la recherche"}
            title={isFocused ? "Fermer la recherche" : "Ouvrir la recherche"}
          >
            <Search size={20} />
          </button>
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              value={query}
              onPointerDown={() => {
                inputWasActiveRef.current = document.activeElement === inputRef.current;
              }}
              onFocus={() => setIsFocused(true)}
              onClick={() => {
                if (inputWasActiveRef.current && isFocused && !query) {
                  closeSearch(false);
                } else {
                  setIsFocused(true);
                }
              }}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsFocused(true);
              }}
              placeholder={compact ? "Ticker ou entreprise" : "Rechercher Airbus, ASML, Apple..."}
              className="w-full min-w-0 bg-transparent text-base font-black text-ink outline-none placeholder:font-semibold placeholder:text-graphite/65"
              autoCapitalize="characters"
              aria-label="Rechercher un ticker ou une entreprise"
              autoFocus={autoFocus}
            />
          </div>
          {(showPanel || query) && (
            <button
              type="button"
              onClick={closeAndClear}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-graphite transition hover:bg-white/10 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint/60"
              aria-label="Fermer la recherche"
              title="Fermer"
            >
              <X size={16} />
            </button>
          )}
        </form>

      {showPanel && (
        <div
          style={suggestionsPanelStyle}
          className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-[80] overflow-x-hidden overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] shadow-soft backdrop-blur-2xl animate-soft-enter"
          onMouseDown={(event) => event.preventDefault()}
        >
          {!hasQuery && recentItems.length > 0 && (
            <SuggestionSection
              title="Recherches récentes"
              icon={<Clock size={15} />}
              items={recentItems.slice(0, 3)}
              loadingTicker={loadingTicker}
              onSelect={openTicker}
            />
          )}
          {!hasQuery && recentItems.length === 0 && (
            <div className="p-5 text-center">
              <p className="text-sm font-black text-ink">Commencez à taper un nom ou un ticker.</p>
              <p className="mt-1 text-xs font-semibold text-graphite">
                Les résultats apparaissent uniquement pendant la saisie.
              </p>
            </div>
          )}
          {hasQuery && (
            <SuggestionSection
              title="Résultats"
              icon={<Building2 size={15} />}
              items={suggestions}
              loadingTicker={loadingTicker}
              onSelect={openTicker}
              emptyLabel="Aucun titre trouvé."
            />
          )}
        </div>
      )}
      </div>
    </>
  );
}

function SuggestionSection({
  title,
  icon,
  items,
  loadingTicker,
  onSelect,
  emptyLabel
}: {
  title: string;
  icon: React.ReactNode;
  items: StockUniverseItem[];
  loadingTicker: string | null;
  onSelect: (ticker: string) => void;
  emptyLabel?: string;
}) {
  return (
    <div className="border-b border-white/10 p-2 last:border-b-0">
      <p className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-normal text-graphite">
        {icon}
        {title}
      </p>
      {items.length === 0 ? (
        <p className="px-3 pb-3 text-sm font-semibold text-graphite">
          {emptyLabel}
        </p>
      ) : (
        <div className="space-y-1">
          {items.map((item) => (
            <button
              key={`${item.ticker}-${item.exchange}`}
              type="button"
              onClick={() => onSelect(item.ticker)}
              className="tap-feedback flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left hover:bg-white/[0.08]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-black text-ink">{item.ticker}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-black",
                      item.type === "ETF"
                        ? "bg-amber/15 text-amber"
                        : "bg-mint/15 text-mint"
                    )}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm font-semibold text-graphite">
                  {item.name}
                </p>
                <p className="mt-1 truncate text-[11px] font-semibold text-graphite/70">
                  Sources gratuites : {item.sourcePossible.join(" · ")}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-black text-ink">{item.market}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-graphite">
                  {item.country}
                </p>
              </div>
              {loadingTicker === item.ticker && (
                <Loader2 size={15} className="shrink-0 animate-spin text-mint" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
