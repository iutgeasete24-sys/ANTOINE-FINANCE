import { HelpCircle } from "lucide-react";
import type { FinancialIndicators } from "@/types/finance";

type MetricKey = keyof FinancialIndicators;

const metricHelp: Partial<Record<MetricKey, string>> = {
  pe:
    "Le PER indique combien le marché paie pour 1 € de bénéfice. Plus il est élevé, plus les attentes de croissance sont importantes.",
  evToEbitda:
    "L’EV/EBITDA compare la valeur totale de l’entreprise à son résultat opérationnel avant certaines charges. Il aide à comparer des sociétés d’un même secteur.",
  roic:
    "Le ROIC mesure la rentabilité du capital investi. Il aide à voir si l’entreprise transforme bien ses ressources en profits.",
  operatingMargin:
    "La marge opérationnelle montre la part du chiffre d’affaires qui reste après les coûts du cœur d’activité.",
  netDebtToEbitda:
    "La dette nette/EBITDA compare l’endettement net à la capacité bénéficiaire. Plus elle est élevée, plus la dette demande de vigilance.",
  freeCashFlow:
    "Le free cash-flow correspond au cash restant après les investissements nécessaires. Il aide à mesurer la capacité financière réelle.",
  payoutRatio:
    "Le payout ratio indique la part du bénéfice distribuée en dividendes. Un niveau élevé peut réduire la marge de sécurité du dividende."
};

export function hasMetricHelp(key: MetricKey) {
  return Boolean(metricHelp[key]);
}

export function MetricHelpCard({ metricKey }: { metricKey: MetricKey }) {
  const help = metricHelp[metricKey];

  if (!help) return null;

  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-normal text-mint">
        <HelpCircle size={15} />
        Mode débutant
      </p>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-graphite">
        {help} Aucun ratio ne suffit seul à décider.
      </p>
    </div>
  );
}
