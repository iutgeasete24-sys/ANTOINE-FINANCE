import type {
  DataSource,
  Decision,
  FinancialIndicators,
  IndicatorView,
  RawStockData,
  ScoreBlock,
  ScoreBlockKey,
  ScoreExplanation,
  StockAnalysis
} from "@/types/finance";
import { formatLargeCurrency, formatPercent, formatRatio } from "@/utils/format";
import { scoreSignal } from "@/utils/signals";

type IndicatorKey = keyof FinancialIndicators;

interface ScoreComponent {
  key: IndicatorKey;
  label: string;
  max: number;
  score: (value: number) => number;
  reason: (value: number, lost: number) => string;
}

interface BlockDefinition {
  key: ScoreBlockKey;
  label: string;
  max: number;
  components: ScoreComponent[];
  fallbackScore?: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isAvailable(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function scale(value: number, low: number, high: number, max: number) {
  return clamp(((value - low) / (high - low)) * max, 0, max);
}

function inverseScale(value: number, low: number, high: number, max: number) {
  return clamp(((high - value) / (high - low)) * max, 0, max);
}

function lowerIsBetterSignal(value: number | null, good: number, caution: number) {
  if (!isAvailable(value)) return "orange";
  if (value <= good) return "green";
  if (value <= caution) return "orange";
  return "red";
}

function higherIsBetterSignal(value: number | null, good: number, caution: number) {
  if (!isAvailable(value)) return "orange";
  if (value >= good) return "green";
  if (value >= caution) return "orange";
  return "red";
}

function buildDataQuality(data: RawStockData, source: DataSource) {
  const values = Object.entries(data.indicators);
  const available = values.filter(([, value]) => isAvailable(value)).length;
  const completenessScore = Math.round((available / values.length) * 100);
  const missingWarnings = values
    .filter(([, value]) => !isAvailable(value))
    .map(([key]) => `${indicatorLabels[key as IndicatorKey] ?? key} indisponible`);
  const warnings = [...(data.warnings ?? []), ...missingWarnings];

  return {
    completenessScore,
    level:
      completenessScore >= 82 ? "élevée" : completenessScore >= 58 ? "moyenne" : "faible",
    source,
    lastUpdated:
      data.lastUpdated ??
      new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Paris"
      }).format(new Date()),
    warnings
  } as const;
}

const indicatorLabels: Record<IndicatorKey, string> = {
  revenueGrowth5Y: "Croissance CA 5 ans",
  epsGrowth5Y: "Croissance EPS 5 ans",
  fcfGrowth5Y: "Croissance FCF 5 ans",
  grossMargin: "Marge brute",
  operatingMargin: "Marge opérationnelle",
  operatingMargin5YAvg: "Marge opérationnelle moyenne 5 ans",
  netMargin: "Marge nette",
  netMargin5YAvg: "Marge nette moyenne 5 ans",
  roic: "ROIC",
  roic5YAvg: "ROIC moyen 5 ans",
  roe: "ROE",
  freeCashFlow: "Free Cash Flow",
  fcfMargin: "Marge FCF",
  netDebtToEbitda: "Dette nette / EBITDA",
  debtToEquity: "Dette / capitaux propres",
  interestCoverage: "Interest coverage",
  pe: "PER",
  peg: "PEG",
  evToEbitda: "EV/EBITDA",
  priceToFcf: "Price/FCF",
  priceToSales: "Price/Sales",
  shareCountChange: "Évolution actions",
  dividendYield: "Dividende",
  payoutRatio: "Payout ratio"
};

const blockDefinitions: BlockDefinition[] = [
  {
    key: "growth",
    label: "Croissance durable",
    max: 20,
    components: [
      {
        key: "revenueGrowth5Y",
        label: "croissance du chiffre d'affaires",
        max: 7,
        score: (value) => scale(value, 0, 16, 7),
        reason: (value) =>
          value < 4
            ? "croissance du chiffre d'affaires faible"
            : "croissance du chiffre d'affaires correcte"
      },
      {
        key: "epsGrowth5Y",
        label: "croissance EPS",
        max: 7,
        score: (value) => scale(value, 0, 16, 7),
        reason: (value) =>
          value < 3 ? "progression des bénéfices par action limitée" : "EPS encore perfectible"
      },
      {
        key: "fcfGrowth5Y",
        label: "croissance du free cash-flow",
        max: 4,
        score: (value) => scale(value, 0, 14, 4),
        reason: (value) =>
          value < 3 ? "croissance du cash-flow libre faible" : "cash-flow libre en progression modérée"
      },
      {
        key: "shareCountChange",
        label: "dilution",
        max: 2,
        score: (value) => inverseScale(value, 5, -3, 2),
        reason: (value) =>
          value > 0 ? "dilution actionnariale" : "rachats d'actions limités"
      }
    ]
  },
  {
    key: "profitability",
    label: "Rentabilité",
    max: 20,
    components: [
      {
        key: "operatingMargin5YAvg",
        label: "marge opérationnelle moyenne",
        max: 5,
        score: (value) => scale(value, 4, 30, 5),
        reason: () => "marge opérationnelle inférieure aux meilleurs dossiers"
      },
      {
        key: "netMargin5YAvg",
        label: "marge nette moyenne",
        max: 4,
        score: (value) => scale(value, 3, 24, 4),
        reason: () => "marge nette perfectible"
      },
      {
        key: "roic5YAvg",
        label: "ROIC moyen",
        max: 7,
        score: (value) => scale(value, 5, 25, 7),
        reason: (value) =>
          value < 10 ? "ROIC moyen trop bas" : "ROIC bon mais pas exceptionnel"
      },
      {
        key: "roe",
        label: "ROE",
        max: 4,
        score: (value) => scale(value, 8, 35, 4),
        reason: () => "ROE moins élevé que les meilleurs comparables"
      }
    ]
  },
  {
    key: "cashflow",
    label: "Free Cash Flow",
    max: 15,
    components: [
      {
        key: "freeCashFlow",
        label: "free cash-flow",
        max: 6,
        score: (value) => scale(value, 0, 8_000_000_000, 6),
        reason: () => "cash-flow libre absolu insuffisant"
      },
      {
        key: "fcfMargin",
        label: "marge FCF",
        max: 6,
        score: (value) => scale(value, 3, 25, 6),
        reason: () => "conversion en cash moins solide"
      },
      {
        key: "fcfGrowth5Y",
        label: "croissance FCF",
        max: 3,
        score: (value) => scale(value, 0, 14, 3),
        reason: () => "croissance du free cash-flow limitée"
      }
    ]
  },
  {
    key: "balanceSheet",
    label: "Solidité financière",
    max: 15,
    components: [
      {
        key: "netDebtToEbitda",
        label: "dette nette / EBITDA",
        max: 6,
        score: (value) => inverseScale(value, 4, -1, 6),
        reason: (value) =>
          value > 3 ? "endettement élevé" : "dette nette à surveiller"
      },
      {
        key: "debtToEquity",
        label: "dette / capitaux propres",
        max: 4,
        score: (value) => inverseScale(value, 2, 0, 4),
        reason: () => "levier financier supérieur au niveau idéal"
      },
      {
        key: "interestCoverage",
        label: "couverture des intérêts",
        max: 5,
        score: (value) => scale(value, 3, 20, 5),
        reason: () => "couverture des intérêts moins confortable"
      }
    ]
  },
  {
    key: "valuation",
    label: "Valorisation",
    max: 15,
    components: [
      {
        key: "pe",
        label: "PER",
        max: 3,
        score: (value) => inverseScale(value, 60, 15, 3),
        reason: (value) => `PER élevé (${formatRatio(value)})`
      },
      {
        key: "peg",
        label: "PEG",
        max: 3,
        score: (value) => inverseScale(value, 3.5, 0.8, 3),
        reason: (value) => `PEG exigeant (${formatRatio(value)})`
      },
      {
        key: "evToEbitda",
        label: "EV/EBITDA",
        max: 3,
        score: (value) => inverseScale(value, 35, 8, 3),
        reason: (value) => `EV/EBITDA élevé (${formatRatio(value)})`
      },
      {
        key: "priceToFcf",
        label: "Price/FCF",
        max: 4,
        score: (value) => inverseScale(value, 55, 12, 4),
        reason: (value) => `Price/FCF supérieur au niveau idéal (${formatRatio(value)})`
      },
      {
        key: "priceToSales",
        label: "Price/Sales",
        max: 2,
        score: (value) => inverseScale(value, 18, 1, 2),
        reason: (value) => `Price/Sales exigeant (${formatRatio(value)})`
      }
    ]
  },
  {
    key: "moat",
    label: "Moat",
    max: 10,
    fallbackScore: 6,
    components: []
  },
  {
    key: "risks",
    label: "Risques",
    max: 5,
    fallbackScore: 3,
    components: []
  }
];

function scoreBlock(definition: BlockDefinition, data: RawStockData): ScoreBlock {
  if (definition.key === "moat") {
    const score = clamp(data.moatNote, 0, definition.max);
    return blockResult(definition, score, [], [], [
      score >= 7
        ? "Le positionnement concurrentiel semble solide."
        : "Le moat reste à confirmer avec des données qualitatives plus fines."
    ]);
  }

  if (definition.key === "risks") {
    const score = clamp(data.riskNote, 0, definition.max);
    return blockResult(definition, score, [], [], [
      score >= 3.5
        ? "Les risques identifiés restent maîtrisables."
        : "Le profil de risque demande une marge de sécurité plus élevée."
    ]);
  }

  const availableComponents = definition.components
    .map((component) => {
      const value = data.indicators[component.key];
      if (!isAvailable(value)) {
        return null;
      }

      const rawScore = clamp(component.score(value), 0, component.max);
      const lost = Math.max(0, component.max - rawScore);

      return {
        component,
        score: rawScore,
        lost,
        reason: component.reason(value, lost)
      };
    })
    .filter(Boolean) as Array<{
    component: ScoreComponent;
    score: number;
    lost: number;
    reason: string;
  }>;

  const missingData = definition.components
    .filter((component) => !isAvailable(data.indicators[component.key]))
    .map((component) => indicatorLabels[component.key]);

  if (availableComponents.length === 0) {
    const score = definition.fallbackScore ?? Math.round(definition.max * 0.5);
    return blockResult(
      definition,
      score,
      missingData,
      ["Score partiel faute de données suffisantes."],
      ["Les données nécessaires sont indisponibles."]
    );
  }

  const availableMax = availableComponents.reduce(
    (sum, item) => sum + item.component.max,
    0
  );
  const rawScore = availableComponents.reduce((sum, item) => sum + item.score, 0);
  const normalizedScore = (rawScore / availableMax) * definition.max;
  const drivers = availableComponents
    .filter((item) => item.lost >= Math.max(0.75, item.component.max * 0.22))
    .sort((a, b) => b.lost - a.lost)
    .slice(0, 3)
    .map((item) => item.reason);

  return blockResult(
    definition,
    normalizedScore,
    missingData,
    drivers,
    buildBlockExplanation(definition.key, normalizedScore, definition.max)
  );
}

function blockResult(
  definition: BlockDefinition,
  score: number,
  missingData: string[],
  drivers: string[],
  explanations: string[]
): ScoreBlock {
  const roundedScore = Math.round(score);
  const lostPoints = Math.max(0, definition.max - roundedScore);

  return {
    key: definition.key,
    label: definition.label,
    score: roundedScore,
    max: definition.max,
    lostPoints,
    signal: scoreSignal(roundedScore, definition.max),
    explanation: explanations[0],
    drivers,
    missingData
  };
}

function buildBlockExplanation(key: ScoreBlockKey, score: number, max: number) {
  const signal = scoreSignal(score, max);
  const strong: Record<ScoreBlockKey, string> = {
    growth: "La dynamique de croissance est solide.",
    profitability: "Les marges et les retours sur capital sont de qualité.",
    cashflow: "La conversion en free cash-flow est robuste.",
    balanceSheet: "Le bilan offre une marge de sécurité correcte.",
    valuation: "La valorisation reste raisonnable au regard des fondamentaux.",
    moat: "Le moat semble solide.",
    risks: "Les risques restent maîtrisables."
  };
  const medium: Record<ScoreBlockKey, string> = {
    growth: "La croissance existe, mais elle demande confirmation.",
    profitability: "La rentabilité est correcte mais pas encore exceptionnelle.",
    cashflow: "La génération de cash est présente mais perfectible.",
    balanceSheet: "La solidité financière reste acceptable, à surveiller.",
    valuation: "La valorisation exige encore une croissance solide.",
    moat: "Le moat existe mais reste à confirmer.",
    risks: "Plusieurs risques imposent une marge de sécurité."
  };
  const weak: Record<ScoreBlockKey, string> = {
    growth: "La dynamique de croissance est trop faible.",
    profitability: "La rentabilité ne protège pas assez l'investisseur.",
    cashflow: "Le free cash-flow manque de régularité.",
    balanceSheet: "Le bilan augmente le risque.",
    valuation: "Le marché paie déjà beaucoup d'optimisme.",
    moat: "L'avantage concurrentiel paraît limité.",
    risks: "Le profil de risque est élevé."
  };

  if (signal === "green") return [strong[key]];
  if (signal === "orange") return [medium[key]];
  return [weak[key]];
}

function formatIndicatorValue(key: IndicatorKey, value: number | null, currency: string) {
  if (!isAvailable(value)) return "Donnée indisponible";
  if (key === "freeCashFlow") return formatLargeCurrency(value, currency);
  if (
    key.includes("Margin") ||
    key.includes("Growth") ||
    key === "roic" ||
    key === "roic5YAvg" ||
    key === "roe" ||
    key === "shareCountChange" ||
    key === "dividendYield" ||
    key === "payoutRatio"
  ) {
    return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
  }
  return formatRatio(value);
}

function indicatorSignal(key: IndicatorKey, value: number | null) {
  switch (key) {
    case "revenueGrowth5Y":
    case "epsGrowth5Y":
    case "fcfGrowth5Y":
      return higherIsBetterSignal(value, 10, 4);
    case "grossMargin":
      return higherIsBetterSignal(value, 45, 25);
    case "operatingMargin":
    case "operatingMargin5YAvg":
      return higherIsBetterSignal(value, 18, 8);
    case "netMargin":
    case "netMargin5YAvg":
      return higherIsBetterSignal(value, 15, 6);
    case "roic":
    case "roic5YAvg":
      return higherIsBetterSignal(value, 15, 8);
    case "roe":
      return higherIsBetterSignal(value, 18, 10);
    case "freeCashFlow":
      return higherIsBetterSignal(value, 1_000_000_000, 100_000_000);
    case "fcfMargin":
      return higherIsBetterSignal(value, 15, 6);
    case "interestCoverage":
      return higherIsBetterSignal(value, 12, 5);
    case "netDebtToEbitda":
      return lowerIsBetterSignal(value, 1.5, 3);
    case "debtToEquity":
      return lowerIsBetterSignal(value, 0.6, 1.5);
    case "pe":
      return lowerIsBetterSignal(value, 25, 45);
    case "peg":
      return lowerIsBetterSignal(value, 1.5, 2.5);
    case "evToEbitda":
      return lowerIsBetterSignal(value, 16, 28);
    case "priceToFcf":
      return lowerIsBetterSignal(value, 22, 40);
    case "priceToSales":
      return lowerIsBetterSignal(value, 6, 12);
    case "shareCountChange":
      return lowerIsBetterSignal(value, 0, 3);
    case "payoutRatio":
      return lowerIsBetterSignal(value, 55, 80);
    case "dividendYield":
      return higherIsBetterSignal(value, 1.5, 0);
  }
}

function scoreImpactForIndicator(key: IndicatorKey, blocks: ScoreBlock[]) {
  const block = blockDefinitions.find((definition) =>
    definition.components.some((component) => component.key === key)
  );

  if (!block) return "Impact qualitatif";
  const scoredBlock = blocks.find((item) => item.key === block.key);
  if (!scoredBlock) return "Impact non calculé";
  if (scoredBlock.missingData.includes(indicatorLabels[key])) {
    return "Exclu du score : donnée indisponible";
  }
  return `${scoredBlock.label} : ${scoredBlock.score}/${scoredBlock.max}`;
}

export function buildIndicators(
  indicators: FinancialIndicators,
  currency: string,
  source: DataSource,
  estimatedFields: IndicatorKey[] = [],
  blocks: ScoreBlock[] = []
): IndicatorView[] {
  const explanations: Record<IndicatorKey, string> = {
    revenueGrowth5Y: "Mesure la capacité à vendre plus dans la durée.",
    epsGrowth5Y: "Vérifie si les profits par action progressent.",
    fcfGrowth5Y: "Vérifie si le cash-flow libre progresse aussi.",
    grossMargin: "Indique le pouvoir de prix et la qualité du modèle.",
    operatingMargin: "Montre la rentabilité avant éléments financiers.",
    operatingMargin5YAvg: "Lisse la marge opérationnelle sur plusieurs exercices.",
    netMargin: "Mesure ce qu'il reste réellement après charges et impôts.",
    netMargin5YAvg: "Lisse la marge nette pour éviter une année atypique.",
    roic: "Retour sur capital investi récent.",
    roic5YAvg: "Retour moyen sur capital investi sur 5 ans.",
    roe: "Rentabilité des capitaux propres.",
    freeCashFlow: "Cash disponible après investissements nécessaires.",
    fcfMargin: "Part des ventes convertie en cash libre.",
    netDebtToEbitda: "Dette comparée à la capacité bénéficiaire.",
    debtToEquity: "Niveau d'endettement du bilan.",
    interestCoverage: "Capacité à payer les intérêts.",
    pe: "Prix payé par euro de bénéfice.",
    peg: "Valorisation ajustée à la croissance.",
    evToEbitda: "Valorisation comparée au résultat opérationnel.",
    priceToFcf: "Prix payé par euro de cash-flow libre.",
    priceToSales: "Prix payé par euro de chiffre d'affaires.",
    shareCountChange: "Une baisse est favorable, une dilution est à surveiller.",
    dividendYield: "Revenu distribué aux actionnaires.",
    payoutRatio: "Part des profits distribuée en dividendes."
  };

  return (Object.keys(indicatorLabels) as IndicatorKey[]).map((key) => {
    const rawValue = indicators[key];
    const available = isAvailable(rawValue);

    return {
      key,
      label: indicatorLabels[key],
      value: formatIndicatorValue(key, rawValue, currency),
      rawValue,
      signal: indicatorSignal(key, rawValue),
      explanation: explanations[key],
      scoreImpact: scoreImpactForIndicator(key, blocks),
      source,
      isEstimated: estimatedFields.includes(key),
      isAvailable: available
    };
  });
}

export function buildScoreBlocks(data: RawStockData): ScoreBlock[] {
  return blockDefinitions.map((definition) => scoreBlock(definition, data));
}

function buildDecision(score: number, valuationBlock: ScoreBlock): Decision {
  if (score >= 78 && valuationBlock.signal !== "red") return "Acheter progressivement";
  if (score >= 68 && valuationBlock.signal === "red") return "Attendre un meilleur prix";
  if (score >= 56) return "Conserver";
  return "Éviter";
}

export function getScoreExplanation(blocks: ScoreBlock[]): ScoreExplanation {
  const weakBlocks = blocks
    .filter((block) => block.lostPoints > 0)
    .sort((a, b) => b.lostPoints - a.lostPoints)
    .slice(0, 3);
  const totalLost = blocks.reduce((sum, block) => sum + block.lostPoints, 0);

  if (weakBlocks.length === 0) {
    return {
      text: "L'entreprise ne perd presque aucun point sur les données disponibles.",
      mainLostPoints: []
    };
  }

  const reasons = weakBlocks.map((block) => {
    const driver = block.drivers[0] ? ` (${block.drivers[0]})` : "";
    return `${block.label.toLowerCase()}${driver}`;
  });

  return {
    text: `L'entreprise perd ${totalLost} points principalement à cause de ${reasons.join(
      " et "
    )}.`,
    mainLostPoints: weakBlocks.map((block) => ({
      label: block.label,
      lostPoints: block.lostPoints,
      reason: block.drivers[0] ?? block.explanation
    }))
  };
}

function buildSummary(
  data: RawStockData,
  blocks: ScoreBlock[],
  decision: Decision
): StockAnalysis["summary"] {
  const sortedStrong = [...blocks].sort((a, b) => b.score / b.max - a.score / a.max);
  const sortedWeak = [...blocks].sort((a, b) => a.score / a.max - b.score / b.max);
  const valuation = blocks.find((block) => block.key === "valuation");
  const qualityBlocks = blocks
    .filter((block) => ["growth", "profitability", "cashflow"].includes(block.key))
    .sort((a, b) => b.score / b.max - a.score / a.max);

  const strengths = sortedStrong.slice(0, 2).map((block) => block.explanation);
  const weaknesses = sortedWeak
    .filter((block) => block.signal !== "green")
    .slice(0, 2)
    .map((block) =>
      block.drivers.length > 0
        ? `${block.explanation} Point clé : ${block.drivers[0]}.`
        : block.explanation
    );

  const mainRisk =
    sortedWeak[0].key === "valuation"
      ? "Le risque principal vient du prix payé : une belle entreprise peut devenir un mauvais investissement si la valorisation est trop exigeante."
      : sortedWeak[0].key === "balanceSheet"
        ? "Le principal point de vigilance est la solidité financière, surtout si les taux ou les profits se dégradent."
        : "Le point le plus fragile concerne la visibilité des fondamentaux à long terme.";

  const valuationRead =
    valuation?.signal === "green"
      ? "La valorisation paraît raisonnable au regard des données disponibles."
      : valuation?.signal === "orange"
        ? "La valorisation demande une marge de sécurité et une croissance qui continue."
        : "La valorisation est exigeante et laisse peu de place à l'erreur.";

  return {
    short: `${data.name} affiche ${
      qualityBlocks[0]?.explanation.toLowerCase() ?? "un profil à analyser"
    } ${valuationRead.toLowerCase()}`,
    strengths,
    weaknesses:
      weaknesses.length > 0
        ? weaknesses
        : ["Aucun point faible majeur ne ressort dans les données disponibles."],
    mainRisk,
    valuationRead,
    conclusion: `${data.name} obtient une décision "${decision}". Cette lecture aide à cadrer l'analyse long terme à partir des données disponibles, sans prédire le cours futur.`,
    finalDecision: decision
  };
}

export function analyzeStock(data: RawStockData, mode: "free" | "local" | "partial" = "local"): StockAnalysis {
  const source: DataSource =
    data.source ?? (mode === "free" ? "sources gratuites" : "local");
  const blocks = buildScoreBlocks(data);
  const score = Math.round(blocks.reduce((sum, block) => sum + block.score, 0));
  const valuationBlock = blocks.find((block) => block.key === "valuation") ?? blocks[0];
  const decision = buildDecision(score, valuationBlock);
  const dataQuality = buildDataQuality(data, source);
  const indicators = buildIndicators(
    data.indicators,
    data.currency,
    source,
    data.estimatedFields,
    blocks
  );

  return {
    ticker: data.ticker,
    name: data.name,
    sector: data.sector,
    country: data.country,
    currency: data.currency,
    price: data.price,
    dayChangePercent: data.dayChangePercent,
    score,
    decision,
    summary: buildSummary(data, blocks, decision),
    scoreBlocks: blocks,
    indicators,
    scoreExplanation: getScoreExplanation(blocks),
    dataQuality,
    source:
      source === "local" || source === "données d'exemple"
        ? "Données locales"
        : source,
    lastUpdated: dataQuality.lastUpdated,
    mode
  };
}

export function concisePerformanceText(value: number) {
  return formatPercent(value, 1).replace("+", value > 0 ? "+" : "");
}
