import { cn } from "@/utils/cn";

const colors = ["#4FD69C", "#E4A94F", "#8DB5FF", "#F17486", "#C8D2C8"];

interface AllocationChartProps {
  title: string;
  items: Array<{ label: string; weight: number; value?: number }>;
  compact?: boolean;
}

export function AllocationChart({ title, items, compact = false }: AllocationChartProps) {
  const topItems = items.slice(0, 5);
  let cursor = 0;
  const gradient =
    topItems.length === 0
      ? "#1C211F"
      : `conic-gradient(${topItems
          .map((item, index) => {
            const start = cursor;
            cursor += item.weight;
            return `${colors[index % colors.length]} ${start}% ${cursor}%`;
          })
          .join(", ")}, rgba(255,255,255,0.08) ${cursor}% 100%)`;

  return (
    <div className="premium-card rounded-2xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-mint">{title}</p>
          <p className="mt-1 text-sm font-semibold text-graphite">
            {topItems[0]?.label ?? "Aucune donnée"}
          </p>
        </div>
        <div
          className={cn(
            "grid place-items-center rounded-full",
            compact ? "h-16 w-16" : "h-20 w-20"
          )}
          style={{ background: gradient }}
        >
          <div
            className={cn("rounded-full bg-paper", compact ? "h-9 w-9" : "h-12 w-12")}
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {topItems.map((item, index) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-3 text-xs font-bold">
              <span className="flex min-w-0 items-center gap-2 text-ink">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: colors[index % colors.length] }}
                />
                <span className="truncate">{item.label}</span>
              </span>
              <span className="text-graphite">{item.weight.toFixed(1)} %</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(item.weight, 100)}%`,
                  background: colors[index % colors.length]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
