import type { Signal } from "@/types/finance";
import { cn } from "@/utils/cn";
import { signalClasses, signalDotClasses, signalText } from "@/utils/signals";

interface SignalBadgeProps {
  signal: Signal;
  label?: string;
  compact?: boolean;
}

export function SignalBadge({ signal, label, compact = false }: SignalBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-semibold",
        compact ? "text-[11px]" : "text-xs",
        signalClasses(signal)
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", signalDotClasses(signal))} />
      {label ?? signalText(signal)}
    </span>
  );
}
