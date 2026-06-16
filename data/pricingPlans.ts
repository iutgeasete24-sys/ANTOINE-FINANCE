export type PricingPlanId = "free" | "plus" | "pro";

export interface PricingPlan {
  id: PricingPlanId;
  name: string;
  price: string;
  description: string;
  cta: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingComparisonRow {
  feature: string;
  free: string;
  plus: string;
  pro: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "0 €",
    description: "Pour tester les rapports et construire une première méthode.",
    cta: "Commencer gratuitement",
    features: [
      "3 rapports gratuits par mois",
      "3 widgets personnalisés",
      "Watchlist limitée",
      "Rapports partiels"
    ]
  },
  {
    id: "plus",
    name: "Plus",
    price: "8,99 €/mois",
    description: "Pour analyser plus sérieusement plusieurs actions.",
    cta: "Choisir Plus",
    features: [
      "Rapports complets",
      "Widgets personnalisés illimités",
      "Comparaison d’actions",
      "Watchlist avancée",
      "Sources détaillées"
    ],
    highlighted: true
  },
  {
    id: "pro",
    name: "Pro",
    price: "19,99 €/mois",
    description: "Pour structurer un suivi avancé et des rapports portefeuille.",
    cta: "Choisir Pro",
    features: [
      "Tout le Plus",
      "Export PDF",
      "Plusieurs grilles d’analyse",
      "Historique des scores",
      "Rapports portefeuille",
      "Alertes personnalisées"
    ]
  }
];

export const pricingComparisonRows: PricingComparisonRow[] = [
  {
    feature: "Rapports mensuels",
    free: "3 rapports partiels",
    plus: "Rapports complets",
    pro: "Rapports complets + portefeuille"
  },
  {
    feature: "Widgets personnalisés",
    free: "3 widgets",
    plus: "Illimités",
    pro: "Plusieurs grilles"
  },
  {
    feature: "Watchlist",
    free: "Limitée",
    plus: "Avancée",
    pro: "Avancée + alertes"
  },
  {
    feature: "Comparaison d’actions",
    free: "Aperçu limité",
    plus: "Incluse",
    pro: "Incluse"
  },
  {
    feature: "Sources détaillées",
    free: "Sources principales",
    plus: "Sources détaillées",
    pro: "Sources détaillées"
  },
  {
    feature: "Export PDF",
    free: "Non inclus",
    plus: "Non inclus",
    pro: "Prévu"
  },
  {
    feature: "Historique des scores",
    free: "Non inclus",
    plus: "Non inclus",
    pro: "Prévu"
  }
];

export const pricingIntentStorageKey = "antoine-capital-pricing-intent";
export const pricingWaitlistStorageKey = "antoine-capital-pricing-waitlist";
