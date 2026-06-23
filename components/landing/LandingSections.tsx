import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Gauge,
  GitCompare,
  HelpCircle,
  Layers3,
  PieChart,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";
import {
  LandingCard,
  LandingSectionHeader,
  MiniInsight,
  PricingCard
} from "@/components/landing/LandingCards";
import { productFaqs } from "@/data/productFaqs";
import { pricingPlans } from "@/data/pricingPlans";

interface ReportItem {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "amber" | "rose" | "neutral";
}

interface WidgetItem {
  label: string;
  icon: LucideIcon;
  detail: string;
}

interface FreeReportItem {
  ticker: string;
  company: string;
  sector: string;
  href: string;
  indicators: string[];
}

const reportItems: ReportItem[] = [
  {
    label: "Activité",
    value: "Semi-conducteurs",
    detail: "Positionnement, marché final et dépendances clés."
  },
  {
    label: "Rentabilité",
    value: "Marges élevées",
    detail: "Lecture pédagogique des marges et du retour sur capital.",
    tone: "green"
  },
  {
    label: "Solidité",
    value: "Bilan robuste",
    detail: "Dette, cash-flow et marge de sécurité financière.",
    tone: "green"
  },
  {
    label: "Valorisation",
    value: "Exigeante",
    detail: "Multiples comparés à la qualité et à la croissance.",
    tone: "amber"
  },
  {
    label: "Risques",
    value: "À surveiller",
    detail: "Cycle industriel, concentration clients et attentes du marché.",
    tone: "amber"
  }
];

const widgets: WidgetItem[] = [
  { label: "Qualité", icon: Gauge, detail: "Rentabilité et avantage concurrentiel." },
  {
    label: "Croissance",
    icon: TrendingUp,
    detail: "Chiffre d'affaires, bénéfices et cash-flow."
  },
  { label: "Valorisation", icon: BarChart3, detail: "Multiples et niveau d'exigence." },
  { label: "Dividendes", icon: Layers3, detail: "Rendement et soutenabilité." },
  { label: "Risques", icon: ShieldCheck, detail: "Dette, cyclicité et visibilité." },
  { label: "Portefeuille", icon: PieChart, detail: "Poids, exposition et concentration." }
];

const freeReports: FreeReportItem[] = [
  {
    ticker: "ASML",
    company: "ASML Holding",
    sector: "Semi-conducteurs",
    href: "/report/ASML",
    indicators: ["ROIC", "Marge opérationnelle", "Valorisation"]
  },
  {
    ticker: "NVDA",
    company: "Nvidia",
    sector: "Semi-conducteurs",
    href: "/report/NVDA",
    indicators: ["Croissance", "Free cash-flow", "Risques"]
  },
  {
    ticker: "LVMH",
    company: "LVMH",
    sector: "Luxe",
    href: "/report/LVMH",
    indicators: ["Marge", "Dette", "Sources disponibles"]
  }
];

const trustItems = [
  "Sources affichées",
  "Date de mise à jour",
  "Score expliqué",
  "Données manquantes signalées",
  "Pas de conseil personnalisé"
];

export function HeroSection() {
  return (
    <section className="pt-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-black text-mint">
        <Image src="/icon.svg" alt="" width={18} height={18} className="rounded-md" />
        Rapport financier pédagogique
      </div>

      <h1 className="mt-5 text-5xl font-black leading-[0.98] text-ink">
        Comprenez une action en 5 minutes.
      </h1>
      <p className="mt-4 text-base font-semibold leading-relaxed text-graphite">
        Obtenez un rapport clair, personnalisé et sourcé sur la santé financière, la
        rentabilité, la valorisation et les risques d’une entreprise cotée.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/analysis"
          className="tap-feedback flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-black text-night shadow-glow"
        >
          Tester un rapport gratuit
          <ArrowRight size={17} />
        </Link>
        <Link
          href="/stock/ASML"
          className="tap-feedback flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
        >
          Voir un exemple
        </Link>
      </div>

      <div className="mt-7 rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-soft">
        <div className="rounded-[1.5rem] bg-paper/90 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-mint">
                Exemple ASML
              </p>
              <p className="mt-1 text-2xl font-black text-ink">Rapport synthèse</p>
              <p className="mt-1 text-sm font-semibold text-graphite">
                Sources gratuites affichées · méthode expliquée
              </p>
            </div>
            <div className="bg-mint/12 grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-mint">
              <Sparkles size={26} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MiniInsight
              label="Qualité"
              value="82/100"
              detail="Profil favorable"
              tone="green"
            />
            <MiniInsight
              label="Valorisation"
              value="À surveiller"
              detail="Niveau d'exigence élevé"
              tone="amber"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="mt-10">
      <LandingSectionHeader
        eyebrow="Problème"
        title="Trop d'informations financières, pas assez de méthode."
        description="Entre rapports annuels, ratios, articles, réseaux sociaux et tableaux de prix, il devient difficile de savoir quoi regarder en premier."
      />
    </section>
  );
}

export function SolutionSection() {
  return (
    <section className="mt-8">
      <LandingSectionHeader
        eyebrow="Solution"
        title="Des rapports pédagogiques pour comprendre l'activité, les chiffres, les risques et la valorisation d'une entreprise."
        description="Chaque rapport transforme les données disponibles en lecture structurée, avec les limites clairement indiquées."
      />
    </section>
  );
}

export function ReportPreview() {
  return (
    <section className="mt-8">
      <LandingSectionHeader
        eyebrow="Exemple de rapport"
        title="Un aperçu lisible avant d'aller plus loin."
        description="L'objectif n'est pas de conclure à votre place, mais de vous donner une base claire pour approfondir."
      />
      <div className="mt-4 space-y-3">
        {reportItems.map((item) => (
          <MiniInsight
            key={item.label}
            label={item.label}
            value={item.value}
            detail={item.detail}
            tone={item.tone}
          />
        ))}
      </div>
    </section>
  );
}

export function FreeReportsSection() {
  return (
    <section className="mt-8">
      <LandingSectionHeader
        eyebrow="Rapports exemples gratuits"
        title="Essayez un rapport gratuit"
        description="Ouvrez un rapport complet pour voir la méthode, les widgets personnalisés et les données indiquées quand elles sont indisponibles."
      />
      <div className="mt-4 space-y-3">
        {freeReports.map((report) => (
          <LandingCard key={report.ticker} className="rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="bg-mint/12 grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-mint">
                <FileText size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-normal text-mint">
                  Rapport {report.ticker}
                </p>
                <h3 className="mt-1 text-lg font-black text-ink">{report.company}</h3>
                <p className="mt-1 text-sm font-semibold text-graphite">
                  {report.sector}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {report.indicators.map((indicator) => (
                <p
                  key={indicator}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-bold text-graphite"
                >
                  <CheckCircle2 size={15} className="shrink-0 text-mint" />
                  {indicator}
                </p>
              ))}
            </div>

            <Link
              href={report.href}
              className="tap-feedback mt-4 flex h-11 items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-black text-night shadow-glow"
            >
              Voir le rapport
              <ArrowRight size={16} />
            </Link>
          </LandingCard>
        ))}
      </div>
    </section>
  );
}

export function WidgetShowcase() {
  return (
    <section className="mt-8">
      <LandingSectionHeader
        eyebrow="Widgets personnalisés"
        title="Des widgets façon iOS pour lire vite, sans perdre le contexte."
        description="Chaque module isole un angle d'analyse et peut devenir une brique de suivi personnel."
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {widgets.map((widget) => {
          const Icon = widget.icon;
          return (
            <LandingCard key={widget.label} className="rounded-2xl p-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.08] text-mint">
                <Icon size={18} />
              </div>
              <p className="mt-3 text-sm font-black text-ink">{widget.label}</p>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-graphite">
                {widget.detail}
              </p>
            </LandingCard>
          );
        })}
      </div>
    </section>
  );
}

export function ComparisonPreview() {
  return (
    <section className="mt-8">
      <LandingCard>
        <div className="flex gap-3">
          <div className="bg-mint/12 grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-mint">
            <GitCompare size={21} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Comparaison
            </p>
            <h2 className="mt-1 text-2xl font-black leading-tight text-ink">
              Comparez plusieurs entreprises avec vos propres indicateurs.
            </h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-graphite">
              Mettez côte à côte qualité, rentabilité, dette, valorisation et risques pour
              garder une méthode constante entre plusieurs dossiers.
            </p>
          </div>
        </div>
        <Link
          href="/compare"
          className="tap-feedback mt-4 flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
        >
          Ouvrir la comparaison
          <ArrowRight size={16} />
        </Link>
      </LandingCard>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="mt-8">
      <LandingSectionHeader
        eyebrow="Pricing"
        title="Commencez gratuitement, passez à plus quand vous en avez besoin."
        description="Aucun paiement n’est activé pour le moment : l’objectif est de tester l’intérêt pour les offres."
      />
      <div className="mt-4 space-y-3">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            description={plan.description}
            features={plan.features.slice(0, 3)}
            highlighted={plan.highlighted}
          />
        ))}
      </div>
      <Link
        href="/pricing"
        className="tap-feedback mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
      >
        Comparer les plans
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="mt-8">
      <LandingSectionHeader
        eyebrow="Confiance"
        title="La transparence passe avant l'effet d'annonce."
        description="Chaque lecture doit rester sourcée, datée et compréhensible."
      />
      <div className="mt-4 space-y-2">
        {trustItems.map((item) => (
          <p
            key={item}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-3 text-sm font-bold text-graphite"
          >
            <CheckCircle2 size={16} className="shrink-0 text-mint" />
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="mt-8">
      <LandingSectionHeader eyebrow="FAQ" title="Questions fréquentes." />
      <div className="mt-4 space-y-3">
        {productFaqs.map((item) => (
          <LandingCard key={item.question} className="rounded-2xl">
            <div className="flex gap-3">
              <HelpCircle size={18} className="mt-0.5 shrink-0 text-mint" />
              <div>
                <h3 className="text-base font-black text-ink">{item.question}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-graphite">
                  {item.answer}
                </p>
              </div>
            </div>
          </LandingCard>
        ))}
      </div>
    </section>
  );
}

export function DisclaimerBlock() {
  return (
    <section className="mt-8">
      <div className="rounded-3xl border border-amber/20 bg-amber/10 p-4 text-amber">
        <div className="flex gap-3">
          <Target size={18} className="mt-0.5 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">
            Les informations fournies sont générales et pédagogiques. Elles ne constituent
            pas un conseil en investissement personnalisé, une recommandation d’achat ou
            de vente, ni une garantie de performance. Investir comporte un risque de perte
            en capital.
          </p>
        </div>
      </div>
    </section>
  );
}

export function LandingFinalActions() {
  return (
    <section className="mt-8 grid grid-cols-1 gap-3">
      <Link
        href="/analysis"
        className="tap-feedback flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-black text-night shadow-glow"
      >
        Tester un rapport gratuit
        <ArrowRight size={17} />
      </Link>
      <Link
        href="/explorer"
        className="tap-feedback flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
      >
        Explorer les entreprises
      </Link>
    </section>
  );
}
