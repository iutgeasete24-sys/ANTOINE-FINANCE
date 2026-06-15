import { SearchX } from "lucide-react";
import { SectionCard } from "./SectionCard";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <SectionCard className="text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.08] text-graphite">
        <SearchX size={22} />
      </div>
      <h2 className="mt-4 text-xl font-black text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-graphite">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </SectionCard>
  );
}
