"use client";

import { useSyncExternalStore } from "react";
import type { WatchlistItem } from "@/types/finance";

const STORAGE_KEY = "aca-watchlist";
const WATCHLIST_EVENT = "aca-watchlist-change";
const EMPTY_WATCHLIST: WatchlistItem[] = [];
let cachedRaw = "";
let cachedItems: WatchlistItem[] = EMPTY_WATCHLIST;

function readSnapshot(): WatchlistItem[] {
  if (typeof window === "undefined") return EMPTY_WATCHLIST;

  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  if (raw === cachedRaw) {
    return cachedItems;
  }

  try {
    cachedRaw = raw;
    cachedItems = JSON.parse(raw);
    return cachedItems;
  } catch {
    cachedRaw = raw;
    cachedItems = EMPTY_WATCHLIST;
    return cachedItems;
  }
}

function serverSnapshot(): WatchlistItem[] {
  return EMPTY_WATCHLIST;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(WATCHLIST_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(WATCHLIST_EVENT, callback);
  };
}

export function useWatchlist() {
  const items = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot);

  function setItems(next: WatchlistItem[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(WATCHLIST_EVENT));
  }

  return { items, setItems };
}
