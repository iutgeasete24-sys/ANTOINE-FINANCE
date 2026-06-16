export interface AmbassadorReport {
  ticker: string;
  company: string;
  sector: string;
}

export interface AmbassadorLanding {
  slug: string;
  creatorName: string;
  title: string;
  featuredReport: string;
  cta: string;
  reports: AmbassadorReport[];
}

export const ambassadorLandings: AmbassadorLanding[] = [
  {
    slug: "demo",
    creatorName: "Demo Finance",
    title: "Bienvenue depuis la communauté de Demo Finance.",
    featuredReport: "ASML",
    cta: "Tester un rapport gratuit",
    reports: [
      {
        ticker: "ASML",
        company: "ASML Holding",
        sector: "Semi-conducteurs"
      },
      {
        ticker: "NVDA",
        company: "Nvidia",
        sector: "Semi-conducteurs"
      },
      {
        ticker: "LVMH",
        company: "LVMH",
        sector: "Luxe"
      }
    ]
  }
];

export function findAmbassadorLanding(slug: string) {
  return ambassadorLandings.find((landing) => landing.slug === slug) ?? null;
}
