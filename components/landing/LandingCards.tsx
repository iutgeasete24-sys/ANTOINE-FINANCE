import { CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface LandingSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function LandingSectionHeader({
  eyebrow,
  title,
  description
}: LandingSectionHeaderProps) {
  return (
    <div>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-normal text-mint">{eyebrow}</p>
      )}
      <h2 className="mt-1 text-2xl font-black leading-tight text-ink">{title}</h2>
      {description && (
        <p className="mt-2 text-sm font-semibold leading-relaxed text-graphite">
          {description}
        </p>
      )}
    </div>
  );
}

export function LandingCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("premium-card rounded-3xl p-4", className)}>
      {children}
    </article>
  );
}

export function MiniInsight({
  label,
  value,
  detail,
  tone = "neutral"
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "amber" | "rose" | "neutral";
}) {
  const toneClass = {
    green: "text-mint",
    amber: "text-amber",
    rose: "text-rose",
    neutral: "text-ink"
  }[tone];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3">
      <p className="text-xs font-bold uppercase tracking-normal text-graphite/65">
        {label}
      </p>
      <p className={cn("mt-1 text-lg font-black", toneClass)}>{value}</p>
      <p className="mt-1 text-xs font-semibold leading-relaxed text-graphite/70">
        {detail}
      </p>
    </div>
  );
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-3xl border p-4",
        highlighted
          ? "border-mint/35 bg-mint/[0.08] shadow-glow"
          : "border-white/10 bg-white/[0.06]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black text-ink">{name}</p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-graphite">
            {description}
          </p>
        </div>
        {highlighted && (
          <span className="rounded-full border border-mint/25 bg-mint/10 px-2 py-1 text-[11px] font-black text-mint">
            Populaire
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-black text-ink">{price}</p>
      <div className="mt-4 space-y-2">
        {features.map((feature) => (
          <p
            key={feature}
            className="flex gap-2 text-sm font-semibold leading-relaxed text-graphite"
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-mint" />
            {feature}
          </p>
        ))}
      </div>
    </article>
  );
}
