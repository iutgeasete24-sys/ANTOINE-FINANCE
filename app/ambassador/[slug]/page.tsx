import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  FileText,
  Grid2X2,
  Handshake,
  Sparkles
} from "lucide-react";
import {
  ambassadorLandings,
  findAmbassadorLanding,
  type AmbassadorLanding,
  type AmbassadorReport
} from "@/data/ambassadors";

interface AmbassadorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return ambassadorLandings.map((landing) => ({
    slug: landing.slug
  }));
}

export async function generateMetadata({
  params
}: AmbassadorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = findAmbassadorLanding(slug);

  if (!landing) {
    return {
      title: "Ambassadeur | Antoine Capital Analyzer"
    };
  }

  return {
    title: `${landing.creatorName} | Antoine Capital Analyzer`,
    description:
      "Tester gratuitement un rapport d’analyse financière pédagogique depuis une page ambassadeur."
  };
}

function trackingQuery(landing: AmbassadorLanding) {
  return `?ref=${encodeURIComponent(landing.slug)}&source=ambassador`;
}

export default async function AmbassadorPage({ params }: AmbassadorPageProps) {
  const { slug } = await params;
  const landing = findAmbassadorLanding(slug);

  if (!landing) {
    notFound();
  }

  const query = trackingQuery(landing);

  return (
    <main>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 text-sm font-black text-graphite"
      >
        <ArrowLeft size={17} />
        Retour à l’accueil
      </Link>

      <header className="premium-card rounded-3xl p-4 shadow-soft">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint/15 text-mint">
          <Handshake size={22} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-normal text-mint">
          Communauté partenaire
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink">
          {landing.title}
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite">
          Testez gratuitement un rapport d’analyse personnalisé.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3">
          <Link
            href={`/report/${landing.featuredReport}${query}`}
            className="tap-feedback flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-black text-night shadow-glow"
          >
            {landing.cta}
            <ArrowRight size={16} />
          </Link>
          <Link
            href={`/my-analysis${query}`}
            className="tap-feedback flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
          >
            Créer ma grille d’analyse
            <Grid2X2 size={16} />
          </Link>
        </div>
      </header>

      <section className="mt-6">
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-normal text-mint">
            Rapports gratuits
          </p>
          <h2 className="text-xl font-black text-ink">Choisissez un exemple</h2>
        </div>
        <div className="space-y-3">
          {landing.reports.map((report) => (
            <ReportCard key={report.ticker} report={report} query={query} />
          ))}
        </div>
      </section>

      <section className="premium-card mt-6 rounded-3xl p-4">
        <div className="flex gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Architecture prête
            </p>
            <h2 className="mt-1 text-xl font-black text-ink">Tracking futur</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-graphite">
              Cette page ajoute seulement des paramètres d’URL locaux comme référence.
              Aucun tracking payant, aucune base de données et aucun envoi externe ne sont
              utilisés pour le moment.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-amber/20 bg-amber/10 p-4 text-amber">
        <p className="text-xs font-semibold leading-relaxed">
          Les rapports sont pédagogiques et généraux. Ils ne constituent pas un conseil
          personnalisé, une recommandation d’achat ou de vente, ni une garantie de
          performance.
        </p>
      </section>
    </main>
  );
}

function ReportCard({
  report,
  query
}: {
  report: AmbassadorReport;
  query: string;
}) {
  return (
    <article className="premium-card rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.08] text-mint">
          <FileText size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-normal text-mint">
            {report.ticker}
          </p>
          <h3 className="mt-1 text-lg font-black text-ink">{report.company}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-graphite">
            <BarChart3 size={15} />
            {report.sector}
          </p>
        </div>
      </div>
      <Link
        href={`/report/${report.ticker}${query}`}
        className="tap-feedback mt-4 flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black text-ink"
      >
        Voir le rapport
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
