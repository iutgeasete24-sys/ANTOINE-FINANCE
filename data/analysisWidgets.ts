import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CircleDollarSign,
  Gauge,
  Layers3,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

export type AnalysisProfile =
  | "Débutant"
  | "Qualité"
  | "Croissance"
  | "Dividendes"
  | "Valorisation"
  | "Avancé";

export type WidgetCategory =
  | "Qualité"
  | "Croissance"
  | "Valorisation"
  | "Solidité"
  | "Dividendes"
  | "Risques"
  | "Portefeuille";

export type PlanRequired = "free" | "plus" | "pro";

export interface AnalysisWidget {
  id: string;
  label: string;
  category: WidgetCategory;
  description: string;
  metricKey: string;
  planRequired: PlanRequired;
}

export interface WidgetCategoryConfig {
  id: WidgetCategory;
  description: string;
  icon: LucideIcon;
}

export const analysisProfiles: AnalysisProfile[] = [
  "Débutant",
  "Qualité",
  "Croissance",
  "Dividendes",
  "Valorisation",
  "Avancé"
];

export const analysisPreferencesStorageKey =
  "antoine-capital-analysis-preferences";

export const widgetCategories: WidgetCategoryConfig[] = [
  {
    id: "Qualité",
    description: "Rentabilité, efficacité du capital et qualité opérationnelle.",
    icon: Gauge
  },
  {
    id: "Croissance",
    description: "Progression du chiffre d’affaires, des bénéfices et du cash-flow.",
    icon: TrendingUp
  },
  {
    id: "Valorisation",
    description: "Niveau d’exigence du marché et multiples clés.",
    icon: BarChart3
  },
  {
    id: "Solidité",
    description: "Dette, couverture des intérêts et robustesse financière.",
    icon: ShieldCheck
  },
  {
    id: "Dividendes",
    description: "Rendement, distribution et trajectoire du dividende.",
    icon: CircleDollarSign
  },
  {
    id: "Risques",
    description: "Volatilité, sensibilité au marché et risques de contexte.",
    icon: ShieldAlert
  },
  {
    id: "Portefeuille",
    description: "Poids, expositions et contribution au portefeuille.",
    icon: PieChart
  }
];

export const analysisWidgets: AnalysisWidget[] = [
  {
    id: "quality-roic",
    label: "ROIC",
    category: "Qualité",
    description: "Mesure la rentabilité du capital investi.",
    metricKey: "roic",
    planRequired: "free"
  },
  {
    id: "quality-operating-margin",
    label: "Marge opérationnelle",
    category: "Qualité",
    description: "Compare la rentabilité du cœur d’activité.",
    metricKey: "operatingMargin",
    planRequired: "free"
  },
  {
    id: "quality-gross-margin",
    label: "Marge brute",
    category: "Qualité",
    description: "Aide à lire le pouvoir de prix et le coût des ventes.",
    metricKey: "grossMargin",
    planRequired: "free"
  },
  {
    id: "quality-fcf-margin",
    label: "Free cash-flow margin",
    category: "Qualité",
    description: "Observe la conversion des ventes en cash-flow disponible.",
    metricKey: "freeCashFlowMargin",
    planRequired: "free"
  },
  {
    id: "growth-revenue",
    label: "Croissance du chiffre d’affaires",
    category: "Croissance",
    description: "Suit la dynamique commerciale sur la période disponible.",
    metricKey: "revenueGrowth",
    planRequired: "free"
  },
  {
    id: "growth-earnings",
    label: "Croissance du bénéfice",
    category: "Croissance",
    description: "Observe la progression des profits après charges.",
    metricKey: "earningsGrowth",
    planRequired: "free"
  },
  {
    id: "growth-fcf",
    label: "Croissance FCF",
    category: "Croissance",
    description: "Suit l’évolution du free cash-flow.",
    metricKey: "freeCashFlowGrowth",
    planRequired: "free"
  },
  {
    id: "valuation-pe",
    label: "PER",
    category: "Valorisation",
    description: "Compare le prix au bénéfice connu.",
    metricKey: "peRatio",
    planRequired: "free"
  },
  {
    id: "valuation-forward-pe",
    label: "Forward PER",
    category: "Valorisation",
    description: "Lit le prix par rapport aux bénéfices attendus.",
    metricKey: "forwardPeRatio",
    planRequired: "free"
  },
  {
    id: "valuation-ev-ebitda",
    label: "EV/EBITDA",
    category: "Valorisation",
    description: "Compare la valeur d’entreprise à l’EBITDA.",
    metricKey: "evToEbitda",
    planRequired: "free"
  },
  {
    id: "valuation-fcf-yield",
    label: "FCF Yield",
    category: "Valorisation",
    description: "Rapporte le free cash-flow à la valorisation.",
    metricKey: "freeCashFlowYield",
    planRequired: "free"
  },
  {
    id: "strength-net-debt-ebitda",
    label: "Dette nette/EBITDA",
    category: "Solidité",
    description: "Évalue l’endettement net face à la capacité bénéficiaire.",
    metricKey: "netDebtToEbitda",
    planRequired: "free"
  },
  {
    id: "strength-debt-equity",
    label: "Dette/capitaux propres",
    category: "Solidité",
    description: "Mesure le levier financier au bilan.",
    metricKey: "debtToEquity",
    planRequired: "free"
  },
  {
    id: "strength-interest-coverage",
    label: "Interest coverage",
    category: "Solidité",
    description: "Vérifie la capacité à couvrir les intérêts.",
    metricKey: "interestCoverage",
    planRequired: "free"
  },
  {
    id: "dividend-yield",
    label: "Rendement",
    category: "Dividendes",
    description: "Indique le dividende rapporté au prix.",
    metricKey: "dividendYield",
    planRequired: "free"
  },
  {
    id: "dividend-payout",
    label: "Payout ratio",
    category: "Dividendes",
    description: "Compare le dividende au bénéfice disponible.",
    metricKey: "payoutRatio",
    planRequired: "free"
  },
  {
    id: "dividend-growth",
    label: "Croissance du dividende",
    category: "Dividendes",
    description: "Suit l’évolution historique du dividende.",
    metricKey: "dividendGrowth",
    planRequired: "free"
  },
  {
    id: "risk-volatility",
    label: "Volatilité",
    category: "Risques",
    description: "Observe l’amplitude des variations de prix.",
    metricKey: "volatility",
    planRequired: "free"
  },
  {
    id: "risk-beta",
    label: "Bêta",
    category: "Risques",
    description: "Mesure la sensibilité au marché.",
    metricKey: "beta",
    planRequired: "free"
  },
  {
    id: "risk-currency",
    label: "Risque devise",
    category: "Risques",
    description: "Repère l’exposition aux variations de change.",
    metricKey: "currencyRisk",
    planRequired: "free"
  },
  {
    id: "risk-sector",
    label: "Risque sectoriel",
    category: "Risques",
    description: "Met en évidence la dépendance à un secteur.",
    metricKey: "sectorRisk",
    planRequired: "free"
  },
  {
    id: "portfolio-weight",
    label: "Poids",
    category: "Portefeuille",
    description: "Affiche la part d’une ligne dans le portefeuille.",
    metricKey: "portfolioWeight",
    planRequired: "free"
  },
  {
    id: "portfolio-performance",
    label: "Performance",
    category: "Portefeuille",
    description: "Suit la contribution d’une ligne dans le temps.",
    metricKey: "portfolioPerformance",
    planRequired: "free"
  },
  {
    id: "portfolio-sector-exposure",
    label: "Exposition secteur",
    category: "Portefeuille",
    description: "Regroupe les poids par secteur.",
    metricKey: "sectorExposure",
    planRequired: "free"
  },
  {
    id: "portfolio-currency-exposure",
    label: "Exposition devise",
    category: "Portefeuille",
    description: "Regroupe les poids par devise.",
    metricKey: "currencyExposure",
    planRequired: "free"
  }
];

export const profileWidgetPresets: Record<AnalysisProfile, string[]> = {
  Débutant: [
    "quality-roic",
    "quality-operating-margin",
    "growth-revenue",
    "valuation-pe",
    "strength-net-debt-ebitda",
    "risk-volatility"
  ],
  Qualité: [
    "quality-roic",
    "quality-operating-margin",
    "quality-gross-margin",
    "quality-fcf-margin",
    "strength-interest-coverage"
  ],
  Croissance: [
    "growth-revenue",
    "growth-earnings",
    "growth-fcf",
    "quality-fcf-margin",
    "risk-volatility"
  ],
  Dividendes: [
    "dividend-yield",
    "dividend-payout",
    "dividend-growth",
    "strength-net-debt-ebitda",
    "strength-interest-coverage"
  ],
  Valorisation: [
    "valuation-pe",
    "valuation-forward-pe",
    "valuation-ev-ebitda",
    "valuation-fcf-yield",
    "quality-roic"
  ],
  Avancé: analysisWidgets.map((widget) => widget.id)
};

export const defaultAnalysisProfile: AnalysisProfile = "Débutant";
