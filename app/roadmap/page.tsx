import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Map,
  Rocket
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";

export const metadata: Metadata = {
  title: "Roadmap | Antoine Capital Analyzer",
  description:
    "Consulter les fonctionnalités disponibles, en préparation et envisagées pour Antoine Capital Analyzer."
};

const ownerEmail = "antoineguichon@gmail.com";

const roadmapStages = [
  {
    title: "Disponible maintenant",
    description:
      "Ces fonctionnalités sont déjà accessibles dans l’application aujourd’hui.",
    icon: CheckCircle2,
    iconClassName: "bg-mint/15 text-mint",
    dotClassName: "bg-mint",
    items: [
      "Rapports d’analyse",
      "Widgets personnalisés",
      "Comparaison",
      "Watchlist"
    ]
  },
  {
    title: "En cours",
    description:
      "Ces évolutions sont en préparation. Leur ordre de sortie peut évoluer avec les retours reçus.",
    icon: Rocket,
    iconClassName: "bg-amber/15 text-amber",
    dotClassName: "bg-amber",
    items: [
      "Rapports PDF",
      "Historique des scores",
      "Alertes personnalisées",
      "Portefeuille avancé"
    ]
  },
  {
    title: "Plus tard",
    description:
      "Des pistes à approfondir lorsque la base produit sera plus mature.",
    icon: Clock3,
    iconClassName: "bg-white/[0.08] text-graphite",
    dotClassName: "bg-graphite",
    items: [
      "Données financières plus complètes",
      "Multilingue",
      "Programme ambassadeur",
      "Intégrations avancées"
    ]
  }
] satisfies RoadmapStage[];

interface RoadmapStage {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  dotClassName: string;
  items: string[];
}

function featureMailto() {
  const subject = encodeURIComponent("Suggestion de fonctionnalité");
  const body = encodeURIComponent(
    [
      "Bonjour Antoine,",
      "",
      "Je souhaite proposer une fonctionnalité pour Antoine Capital Analyzer.",
      "",
      "Fonctionnalité :",
      "Pourquoi elle me serait utile :",
      "Contexte d’utilisation :",
      "",
      "Merci."
    ].join("\n")
  );

  return `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
}

export default function RoadmapPage() {
  return (
    <main>
      <Link
        href="/"
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-black text-graphite"
      >
        <ArrowLeft size={17} />
        Retour à l’accueil
      </Link>

      <header className="premium-card rounded-3xl p-4 shadow-soft">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint/15 text-mint">
          <Map size={22} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-normal text-mint">
          Roadmap produit
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-4xl">
          Construisons la suite avec transparence.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Cette roadmap montre ce qui est déjà accessible, ce qui est en préparation et
          les pistes envisagées. Elle évolue avec les retours utiles.
        </p>
      </header>

      <div className="mt-6 space-y-4">
        {roadmapStages.map((stage) => (
          <RoadmapSection key={stage.title} stage={stage} />
        ))}
      </div>

      <SectionCard className="mt-6 rounded-3xl">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">
            <Lightbulb size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Vos retours
            </p>
            <h2 className="mt-1 text-xl font-black text-ink">Une idée à partager ?</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-graphite">
              Les suggestions les plus concrètes aident à prioriser les prochaines
              améliorations.
            </p>
          </div>
        </div>
        <a
          href={featureMailto()}
          className="tap-feedback mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-black text-night shadow-glow"
        >
          Proposer une fonctionnalité
          <ArrowRight size={16} />
        </a>
      </SectionCard>
    </main>
  );
}

function RoadmapSection({ stage }: { stage: RoadmapStage }) {
  const Icon = stage.icon;

  return (
    <SectionCard className="rounded-3xl">
      <div className="flex items-start gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${stage.iconClassName}`}>
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-ink">{stage.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-graphite">{stage.description}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {stage.items.map((item) => (
          <p
            key={item}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3 text-sm font-bold text-ink"
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${stage.dotClassName}`} />
            {item}
          </p>
        ))}
      </div>
    </SectionCard>
  );
}
