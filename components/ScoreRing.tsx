import type { Signal } from "@/types/finance";
import { cn } from "@/utils/cn";

const colorBySignal: Record<Signal, string> = {
  green: "#0A7A5A",
  orange: "#B56B16",
  red: "#B42336"
};

interface ScoreRingProps {
  score: number;
  signal: Signal;
  size?: "sm" | "lg";
}

export function ScoreRing({ score, signal, size = "lg" }: ScoreRingProps) {
  const degrees = Math.max(0, Math.min(score, 100)) * 3.6;
  const dimension = size === "lg" ? "h-32 w-32" : "h-20 w-20";
  const textSize = size === "lg" ? "text-4xl" : "text-xl";

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full",
        dimension
      )}
      style={{
        background: `conic-gradient(${colorBySignal[signal]} ${degrees}deg, #E5E7DF ${degrees}deg)`
      }}
    >
      <div className="grid h-[78%] w-[78%] place-items-center rounded-full bg-paper shadow-inner">
        <div className="text-center">
          <div className={cn("font-black leading-none text-ink", textSize)}>
            {score}
          </div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-normal text-graphite/70">
            /100
          </div>
        </div>
      </div>
    </div>
  );
}
