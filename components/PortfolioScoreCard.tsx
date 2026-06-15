import { ShieldCheck } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { scoreSignal } from "@/utils/signals";

interface PortfolioScoreCardProps {
  portfolioScore: {
    score: number;
    mainStrength: string;
    mainWeakness: string;
    recommendation: string;
    components: Record<string, number>;
  };
}

const labels: Record<string, string> = {
  companyQuality: "Qualité",
  sectorDiversification: "Secteurs",
  countryDiversification: "Pays",
  concentration: "Concentration",
  valuation: "Valorisation",
  globalRisk: "Risque"
};

const visibleComponents = ["companyQuality", "sectorDiversification", "concentration"];

export function PortfolioScoreCard({ portfolioScore }: PortfolioScoreCardProps) {
  return (
    <section className="premium-card mt-5 rounded-3xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-mint" />
            <p className="text-xs font-bold uppercase tracking-normal text-mint">
              Score portefeuille
            </p>
          </div>
          <h2 className="mt-1 text-2xl font-black leading-tight text-ink">
            {portfolioScore.score}/100
          </h2>
        </div>
        <ScoreRing
          score={portfolioScore.score}
          signal={scoreSignal(portfolioScore.score)}
          size="sm"
        />
      </div>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-graphite/75">
        {portfolioScore.recommendation}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {visibleComponents.map((key) => (
          <div key={key} className="rounded-2xl bg-white/[0.07] p-3">
            <p className="text-[11px] font-bold uppercase tracking-normal text-graphite/55">
              {labels[key] ?? key}
            </p>
            <p className="mt-1 text-lg font-black text-ink">
              {portfolioScore.components[key]}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-sm leading-relaxed">
        <p className="font-semibold text-mint">{portfolioScore.mainStrength}</p>
        <p className="font-semibold text-amber">{portfolioScore.mainWeakness}</p>
      </div>
    </section>
  );
}
