import type { PortfolioLine } from "@/types/finance";

const fxToEur: Record<string, number> = {
  EUR: 1,
  USD: 0.92,
  DKK: 0.13
};

function toEur(value: number, currency: string) {
  return value * (fxToEur[currency] ?? 1);
}

export function enrichPortfolio(lines: PortfolioLine[]) {
  const enriched = lines.map((line) => {
    const invested = toEur(line.quantity * line.averagePrice + line.fees, line.currency);
    const value = toEur(line.quantity * line.currentPrice, line.currency);
    const gain = value - invested;
    const gainPercent = invested > 0 ? (gain / invested) * 100 : 0;

    return {
      ...line,
      invested,
      value,
      gain,
      gainPercent,
      weight: 0
    };
  });

  const totalValue = enriched.reduce((sum, line) => sum + line.value, 0);
  const totalInvested = enriched.reduce((sum, line) => sum + line.invested, 0);
  const withWeights = enriched.map((line) => ({
    ...line,
    weight: totalValue > 0 ? (line.value / totalValue) * 100 : 0
  }));

  const byBroker = groupPerformance(withWeights, "broker");
  const bySector = groupExposure(withWeights, "sector");
  const byCurrency = groupExposure(withWeights, "currency");
  const byCountry = groupExposure(withWeights, "country");
  const bestLine = [...withWeights].sort((a, b) => b.gainPercent - a.gainPercent)[0];
  const worstLine = [...withWeights].sort((a, b) => a.gainPercent - b.gainPercent)[0];
  const topPositions = [...withWeights].sort((a, b) => b.value - a.value).slice(0, 5);
  const portfolioScore = buildPortfolioScore(withWeights, {
    bySector,
    byCountry,
    byCurrency,
    byBroker
  });

  return {
    lines: withWeights,
    totalValue,
    totalInvested,
    totalGain: totalValue - totalInvested,
    totalGainPercent:
      totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0,
    byBroker,
    bySector,
    byCurrency,
    byCountry,
    bestLine,
    worstLine,
    topPositions,
    concentrationAlert: withWeights.find((line) => line.weight > 20),
    portfolioScore,
    alerts: buildAlerts(withWeights, {
      bySector,
      byCountry,
      byCurrency,
      byBroker
    })
  };
}

function groupExposure<T extends keyof PortfolioLine>(
  lines: ReturnType<typeof enrichLineShape>[],
  key: T
) {
  const map = new Map<string, number>();
  lines.forEach((line) => {
    map.set(String(line[key]), (map.get(String(line[key])) ?? 0) + line.value);
  });
  const total = lines.reduce((sum, line) => sum + line.value, 0);

  return [...map.entries()]
    .map(([label, value]) => ({
      label,
      value,
      weight: total > 0 ? (value / total) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);
}

function groupPerformance<T extends keyof PortfolioLine>(
  lines: ReturnType<typeof enrichLineShape>[],
  key: T
) {
  const map = new Map<string, { value: number; invested: number }>();
  lines.forEach((line) => {
    const previous = map.get(String(line[key])) ?? { value: 0, invested: 0 };
    map.set(String(line[key]), {
      value: previous.value + line.value,
      invested: previous.invested + line.invested
    });
  });

  const totalValue = lines.reduce((sum, line) => sum + line.value, 0);

  return [...map.entries()]
    .map(([label, totals]) => ({
      label,
      value: totals.value,
      gain: totals.value - totals.invested,
      gainPercent:
        totals.invested > 0 ? ((totals.value - totals.invested) / totals.invested) * 100 : 0,
      weight: totalValue > 0 ? (totals.value / totalValue) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);
}

function enrichLineShape() {
  return {
    ...({} as PortfolioLine),
    invested: 0,
    value: 0,
    gain: 0,
    gainPercent: 0,
    weight: 0
  };
}

type EnrichedLine = ReturnType<typeof enrichLineShape>;
type ExposureGroup = Array<{ label: string; value: number; weight: number }>;
type PerformanceGroup = Array<{
  label: string;
  value: number;
  gain: number;
  gainPercent: number;
  weight: number;
}>;

function weightedAverage(lines: EnrichedLine[], selector: (line: EnrichedLine) => number) {
  const totalValue = lines.reduce((sum, line) => sum + line.value, 0);
  if (totalValue <= 0) return 0;
  return lines.reduce((sum, line) => sum + selector(line) * line.weight, 0) / 100;
}

function diversificationScore(maxWeight: number, excellent: number, warning: number, max: number) {
  if (maxWeight <= excellent) return max;
  if (maxWeight <= warning) return Math.round(max * 0.75);
  if (maxWeight <= warning + 20) return Math.round(max * 0.5);
  return Math.round(max * 0.25);
}

function concentrationScore(maxPosition: number) {
  if (maxPosition <= 12) return 15;
  if (maxPosition <= 20) return 12;
  if (maxPosition <= 30) return 8;
  return 4;
}

function buildPortfolioScore(
  lines: EnrichedLine[],
  groups: {
    bySector: ExposureGroup;
    byCountry: ExposureGroup;
    byCurrency: ExposureGroup;
    byBroker: PerformanceGroup;
  }
) {
  const maxPosition = Math.max(0, ...lines.map((line) => line.weight));
  const maxSector = Math.max(0, ...groups.bySector.map((item) => item.weight));
  const maxCountry = Math.max(0, ...groups.byCountry.map((item) => item.weight));
  const averageQuality = weightedAverage(lines, (line) => line.score ?? 65);
  const averageValuation = weightedAverage(lines, (line) =>
    line.valuationScore === undefined ? 60 : (line.valuationScore / 15) * 100
  );
  const averageRisk = weightedAverage(lines, (line) =>
    line.riskScore === undefined ? 60 : (line.riskScore / 5) * 100
  );

  const components = {
    companyQuality: Math.round((averageQuality / 100) * 30),
    sectorDiversification: diversificationScore(maxSector, 28, 40, 20),
    countryDiversification: diversificationScore(maxCountry, 45, 70, 15),
    concentration: concentrationScore(maxPosition),
    valuation: Math.round((averageValuation / 100) * 10),
    globalRisk: Math.round((averageRisk / 100) * 10)
  };
  const score = Object.values(components).reduce((sum, value) => sum + value, 0);
  const strongest =
    averageQuality >= 75
      ? "La qualité moyenne des entreprises est le principal point fort."
      : "La diversification apporte une partie de la robustesse.";
  const weakest =
    maxSector > 40
      ? `Le portefeuille est trop concentré sur ${groups.bySector[0]?.label}.`
      : maxPosition > 20
        ? `La ligne ${[...lines].sort((a, b) => b.weight - a.weight)[0]?.ticker} pèse trop lourd.`
        : "Aucun point faible majeur ne domine, mais le suivi reste nécessaire.";

  return {
    score,
    components,
    averageCompanyScore: Math.round(averageQuality),
    averageValuationScore: Math.round(averageValuation),
    averageRiskScore: Math.round(averageRisk),
    mainStrength: strongest,
    mainWeakness: weakest,
    recommendation:
      score >= 75
        ? "Votre portefeuille est globalement qualitatif. Surveillez surtout la concentration."
        : score >= 60
          ? "Le portefeuille est correct, mais quelques arbitrages peuvent améliorer le risque."
          : "Le portefeuille demande plus de diversification et une meilleure qualité moyenne."
  };
}

function buildAlerts(
  lines: EnrichedLine[],
  groups: {
    bySector: ExposureGroup;
    byCountry: ExposureGroup;
    byCurrency: ExposureGroup;
    byBroker: PerformanceGroup;
  }
) {
  const alerts: string[] = [];
  const topLine = [...lines].sort((a, b) => b.weight - a.weight)[0];
  const topSector = groups.bySector[0];
  const topCountry = groups.byCountry[0];
  const topCurrency = groups.byCurrency[0];

  if (topLine?.weight > 20) {
    alerts.push(`${topLine.ticker} dépasse 20 % du portefeuille.`);
  }
  if (topSector?.weight > 40) {
    alerts.push(`Le secteur ${topSector.label} dépasse 40 % du portefeuille.`);
  }
  if (topCountry?.weight > 70) {
    alerts.push(`Le pays ${topCountry.label} dépasse 70 % du portefeuille.`);
  }
  if (topCurrency?.weight > 80) {
    alerts.push(`La devise ${topCurrency.label} dépasse 80 % du portefeuille.`);
  }
  lines
    .filter((line) => (line.score ?? 100) < 50)
    .forEach((line) => alerts.push(`${line.ticker} a un score inférieur à 50.`));
  lines
    .filter((line) => (line.dataQualityScore ?? 100) < 60)
    .forEach((line) => alerts.push(`${line.ticker} a des données financières incomplètes.`));

  return alerts;
}
