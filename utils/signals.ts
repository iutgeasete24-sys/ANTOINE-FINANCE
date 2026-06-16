import type { Signal } from "@/types/finance";

export function scoreSignal(score: number, max = 100): Signal {
  const ratio = score / max;
  if (ratio >= 0.72) return "green";
  if (ratio >= 0.48) return "orange";
  return "red";
}

export function signalClasses(signal: Signal) {
  switch (signal) {
    case "green":
      return "border-emerald-300/25 bg-emerald-300/12 text-emerald-200";
    case "orange":
      return "border-amber-300/25 bg-amber-300/12 text-amber-200";
    case "red":
      return "border-rose-300/25 bg-rose-300/12 text-rose-200";
  }
}

export function signalDotClasses(signal: Signal) {
  switch (signal) {
    case "green":
      return "bg-emerald-500";
    case "orange":
      return "bg-amber-500";
    case "red":
      return "bg-rose-500";
  }
}

export function signalText(signal: Signal) {
  switch (signal) {
    case "green":
      return "Profil favorable";
    case "orange":
      return "À surveiller";
    case "red":
      return "Profil prudent";
  }
}
