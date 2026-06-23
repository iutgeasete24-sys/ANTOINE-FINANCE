import { stockUniverse } from "@/data/stockUniverse";
import type { StockUniverseItem } from "@/types/universe";
import { scoreSignal } from "@/utils/signals";

export interface ETFScoreBlock {
  label: string;
  score: number;
  max: number;
  explanation: string;
}

export interface ETFAnalysis {
  etf: StockUniverseItem;
  score: number;
  blocks: ETFScoreBlock[];
  riskLevel: "Faible" | "Modéré" | "Élevé";
  horizon: string;
  investorType: string;
  summary: string;
  mainRisk: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function expenseScore(expenseRatio: number | undefined) {
  if (expenseRatio === undefined) return 12;
  if (expenseRatio <= 0.1) return 20;
  if (expenseRatio <= 0.25) return 17;
  if (expenseRatio <= 0.45) return 13;
  if (expenseRatio <= 0.75) return 9;
  return 5;
}

function diversificationScore(etf: StockUniverseItem) {
  const positions = etf.positionsCount ?? 0;
  if (positions >= 1000) return 25;
  if (positions >= 450) return 22;
  if (positions >= 100) return 18;
  if (positions >= 40) return 14;
  return 9;
}

function riskLevel(etf: StockUniverseItem): ETFAnalysis["riskLevel"] {
  if (etf.subSector.includes("Nasdaq") || etf.sector.includes("Technologie"))
    return "Élevé";
  if (etf.subSector.includes("Monde") || etf.indexTracked?.includes("MSCI World"))
    return "Modéré";
  return "Modéré";
}

function summaryForETF(etf: StockUniverseItem) {
  const index = etf.indexTracked ?? etf.subSector;
  if (index.includes("S&P 500")) {
    return "Cet ETF permet d’investir automatiquement dans les 500 plus grandes entreprises américaines. Il donne une exposition large au marché américain, principalement composé de grandes capitalisations.";
  }
  if (index.includes("Nasdaq")) {
    return "Cet ETF suit les principales grandes entreprises non financières cotées au Nasdaq, avec une forte exposition à la technologie.";
  }
  if (index.includes("MSCI World")) {
    return "Cet ETF donne une exposition diversifiée aux grandes et moyennes entreprises des pays développés.";
  }
  if (index.includes("DAX")) {
    return "Cet ETF donne une exposition aux grandes capitalisations allemandes, avec une concentration sur l’économie allemande.";
  }
  if (index.includes("CAC")) {
    return "Cet ETF donne une exposition aux grandes capitalisations françaises, avec une concentration sur le marché français.";
  }
  return "Cet ETF donne une exposition diversifiée à un panier de titres. Le détail de l’indice suivi permet de comprendre précisément le risque pris.";
}

export function analyzeETF(ticker: string): ETFAnalysis | null {
  const etf = stockUniverse.find(
    (item) =>
      item.ticker.toUpperCase() === ticker.toUpperCase() && item.assetType === "etf"
  );
  if (!etf) return null;

  const blocks: ETFScoreBlock[] = [
    {
      label: "Diversification",
      score: diversificationScore(etf),
      max: 25,
      explanation:
        (etf.positionsCount ?? 0) >= 450
          ? "L’ETF est largement diversifié."
          : "La diversification est correcte mais plus concentrée."
    },
    {
      label: "Frais",
      score: expenseScore(etf.expenseRatio),
      max: 20,
      explanation:
        etf.expenseRatio === undefined
          ? "Frais non renseignés dans la base locale."
          : `Frais annuels estimés à ${etf.expenseRatio.toFixed(2)} %.`
    },
    {
      label: "Liquidité",
      score: etf.exchange.includes("NYSE") || etf.exchange.includes("NASDAQ") ? 14 : 11,
      max: 15,
      explanation: "Score indicatif basé sur le marché de cotation disponible."
    },
    {
      label: "Performance historique",
      score:
        etf.indexTracked?.includes("MSCI World") || etf.indexTracked?.includes("S&P 500")
          ? 12
          : 10,
      max: 15,
      explanation:
        "Lecture indicative liée à l’indice suivi, sans prédire la performance future."
    },
    {
      label: "Risque / volatilité",
      score: riskLevel(etf) === "Élevé" ? 8 : 11,
      max: 15,
      explanation:
        riskLevel(etf) === "Élevé"
          ? "L’exposition est plus concentrée et peut être volatile."
          : "Le risque reste principalement lié au marché actions."
    },
    {
      label: "Clarté de l’exposition",
      score: etf.indexTracked ? 9 : 6,
      max: 10,
      explanation: etf.indexTracked
        ? `L’indice suivi est clair : ${etf.indexTracked}.`
        : "L’indice suivi doit être précisé."
    }
  ];

  const score = clamp(
    blocks.reduce((sum, block) => sum + block.score, 0),
    0,
    100
  );
  const risk = riskLevel(etf);

  return {
    etf,
    score,
    blocks,
    riskLevel: risk,
    horizon:
      risk === "Élevé" ? "Long terme, avec tolérance à la volatilité" : "Long terme",
    investorType: etf.indexTracked?.includes("MSCI World")
      ? "débutant / long terme"
      : etf.indexTracked?.includes("Nasdaq")
        ? "dynamique"
        : etf.distributionPolicy === "Distribuant"
          ? "dividendes / long terme"
          : "long terme",
    summary: summaryForETF(etf),
    mainRisk:
      risk === "Élevé"
        ? "Le principal risque vient de la concentration sectorielle et de la volatilité."
        : "Le principal risque vient de la baisse générale des marchés suivis par l’indice."
  };
}

export function etfScoreSignal(score: number) {
  return scoreSignal(score);
}
