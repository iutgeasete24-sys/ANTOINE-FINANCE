import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileText,
  Handshake,
  Megaphone,
  ShieldCheck,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";

export const metadata: Metadata = {
  title: "Programme ambassadeur | Antoine Capital Analyzer",
  description:
    "Tester Antoine Capital Analyzer comme créateur finance avec un programme ambassadeur pédagogique."
};

const ownerEmail = "antoineguichon@gmail.com";

const ambassadorBenefits = [
  "Accès Pro gratuit",
  "Lien affilié personnalisé",
  "Page dédiée",
  "Rapports exemples pour créer du contenu",
  "Commission par abonné qualifié plus tard"
];

const contentFormats = [
  "Analyse d’une action en 5 minutes",
  "Comparaison de deux entreprises",
  "Construction d’une grille d’analyse",
  "Live “j’analyse vos actions”"
];

const conditions = [
  "Contenu transparent",
  "Mention partenariat ou lien affilié",
  "Pas de promesse de gains",
  "Pas de conseil personnalisé",
  "Rappeler le risque de perte en capital"
];

function ambassadorMailto() {
  const subject = encodeURIComponent("Demande d’accès ambassadeur");
  const body = encodeURIComponent(
    [
      "Bonjour Antoine,",
      "",
      "Je souhaite demander un accès ambassadeur pour Antoine Capital Analyzer.",
      "",
      "Nom / pseudo :",
      "Lien vers mon contenu :",
      "Audience principale :",
      "Format envisagé :",
      "",
      "Je comprends que le programme ne promet aucun gain, ne donne pas de conseil personnalisé et demande une communication transparente."
    ].join("\n")
  );

  return `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
}

export default function AmbassadorsPage() {
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
          <Handshake size={22} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-normal text-mint">
          Programme ambassadeur
        </p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-ink sm:text-4xl">
          Devenez ambassadeur d’un outil d’analyse financière pédagogique.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Aidez votre audience à comprendre les entreprises cotées avec des rapports
          clairs, personnalisés et sourcés.
        </p>
        <a
          href={ambassadorMailto()}
          className="tap-feedback mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-black text-night shadow-glow"
        >
          Demander un accès ambassadeur
          <ArrowRight size={16} />
        </a>
      </header>

      <SectionCard className="mt-6 rounded-3xl">
        <SectionTitle
          icon={BadgeCheck}
          eyebrow="Avantages"
          title="Ce que l’ambassadeur obtient"
        />
        <div className="mt-4 space-y-2">
          {ambassadorBenefits.map((item) => (
            <ListItem key={item}>{item}</ListItem>
          ))}
        </div>
      </SectionCard>

      <SectionCard className="mt-6 rounded-3xl">
        <SectionTitle
          icon={Megaphone}
          eyebrow="Création"
          title="Formats de contenu proposés"
        />
        <div className="mt-4 grid grid-cols-1 gap-3">
          {contentFormats.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
            >
              <div className="flex items-start gap-3">
                <FileText size={18} className="mt-0.5 shrink-0 text-mint" />
                <p className="text-sm font-black leading-relaxed text-ink">{item}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard className="mt-6 rounded-3xl">
        <SectionTitle
          icon={ShieldCheck}
          eyebrow="Cadre"
          title="Conditions de communication"
        />
        <div className="mt-4 space-y-2">
          {conditions.map((item) => (
            <ListItem key={item}>{item}</ListItem>
          ))}
        </div>
      </SectionCard>

      <SectionCard className="mt-6 rounded-3xl">
        <SectionTitle
          icon={Users}
          eyebrow="Transparence"
          title="Programme en construction"
        />
        <p className="mt-4 text-sm font-semibold leading-relaxed text-graphite">
          Aucun système d’affiliation réel n’est encore connecté. L’objectif est de
          sélectionner quelques créateurs finance sérieux, tester les formats et
          construire un partenariat propre avant toute automatisation.
        </p>
      </SectionCard>

      <section className="mt-6 rounded-3xl border border-amber/20 bg-amber/10 p-4 text-amber">
        <p className="text-xs font-semibold leading-relaxed">
          Les contenus doivent rester pédagogiques. Ils ne doivent pas promettre de gains,
          donner de conseil personnalisé ou minimiser le risque de perte en capital.
        </p>
      </section>
    </main>
  );
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-normal text-mint">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-black text-ink">{title}</h2>
      </div>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3 text-sm font-bold leading-relaxed text-graphite">
      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-mint" />
      {children}
    </p>
  );
}
