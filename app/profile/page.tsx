import Link from "next/link";
import { BookOpen, Compass, GitCompare, ShieldCheck, Star } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";

const links = [
  {
    href: "/explorer",
    label: "Explorer",
    detail: "Scores fondamentaux et filtres",
    icon: Compass
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    detail: "Actions suivies et tri par score",
    icon: Star
  },
  {
    href: "/compare",
    label: "Comparaison",
    detail: "Comparer jusqu'à 3 actions",
    icon: GitCompare
  },
  {
    href: "/stock/ASML/details",
    label: "Exemple détaillé",
    detail: "Comprendre le calcul du score",
    icon: BookOpen
  }
];

export default function ProfilePage() {
  return (
    <main>
      <header className="pt-2">
        <p className="text-xs font-bold uppercase tracking-normal text-mint">
          Profil
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink">
          Réglages et transparence.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Les outils secondaires restent accessibles ici pour garder l’app simple au quotidien.
        </p>
      </header>

      <SectionCard className="mt-6">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-mint/15 text-mint">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-ink">Données et sécurité</h2>
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              L’app privilégie les sources gratuites, le cache local et le stockage sur cet
              appareil. Aucune API payante n’est nécessaire pour démarrer.
            </p>
          </div>
        </div>
      </SectionCard>

      <section className="mt-6 space-y-3">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="tap-feedback premium-card flex items-center justify-between rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.08] text-ink">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-black text-ink">{item.label}</p>
                  <p className="mt-1 text-xs font-semibold text-graphite">{item.detail}</p>
                </div>
              </div>
              <span className="text-xl font-black text-graphite">›</span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
