import Link from "next/link";
import { GitCompare, PieChart, Star } from "lucide-react";

const actions = [
  {
    href: "/watchlist",
    label: "Watchlist",
    detail: "Suivre les meilleurs dossiers",
    icon: Star
  },
  {
    href: "/portfolio",
    label: "Portefeuille",
    detail: "Suivi par broker",
    icon: PieChart
  },
  {
    href: "/compare",
    label: "Comparer",
    detail: "Jusqu'à 3 actions",
    icon: GitCompare
  }
];

export function HomeQuickActions() {
  return (
    <section className="mt-5 grid grid-cols-1 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={action.href}
            className="tap-feedback premium-card flex items-center justify-between rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.08] text-ink">
                <Icon size={20} />
              </div>
              <div>
                <h2 className="font-black text-ink">{action.label}</h2>
                <p className="mt-0.5 text-sm font-medium text-graphite/65">
                  {action.detail}
                </p>
              </div>
            </div>
            <span className="text-xl font-black text-graphite/35">›</span>
          </Link>
        );
      })}
    </section>
  );
}
