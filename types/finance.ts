export type Signal = "green" | "orange" | "red";
export type DataSource =
  | "local"
  | "Stooq"
  | "SEC EDGAR"
  | "sources gratuites"
  | "données d'exemple";
export type DataQualityLevel = "élevée" | "moyenne" | "faible";
export type NumericValue = number | null;

export type Decision =
  | "Profil favorable"
  | "Profil équilibré"
  | "Profil prudent"
  | "Valorisation exigeante";

export type ScoreBlockKey =
  | "growth"
  | "profitability"
  | "cashflow"
  | "balanceSheet"
  | "valuation"
  | "moat"
  | "risks";

export type BrokerName =
  | "Trade Republic"
  | "Boursorama"
  | "Degiro"
  | "Interactive Brokers"
  | "Autre"
  | (string & {});

export interface FinancialIndicators {
  revenueGrowth5Y: NumericValue;
  epsGrowth5Y: NumericValue;
  fcfGrowth5Y: NumericValue;
  grossMargin: NumericValue;
  operatingMargin: NumericValue;
  operatingMargin5YAvg: NumericValue;
  netMargin: NumericValue;
  netMargin5YAvg: NumericValue;
  roic: NumericValue;
  roic5YAvg: NumericValue;
  roe: NumericValue;
  freeCashFlow: NumericValue;
  fcfMargin: NumericValue;
  netDebtToEbitda: NumericValue;
  debtToEquity: NumericValue;
  interestCoverage: NumericValue;
  pe: NumericValue;
  peg: NumericValue;
  evToEbitda: NumericValue;
  priceToFcf: NumericValue;
  priceToSales: NumericValue;
  shareCountChange: NumericValue;
  dividendYield: NumericValue;
  payoutRatio: NumericValue;
}

export interface ScoreBlock {
  key: ScoreBlockKey;
  label: string;
  score: number;
  max: number;
  lostPoints: number;
  signal: Signal;
  explanation: string;
  drivers: string[];
  missingData: string[];
}

export interface IndicatorView {
  key: keyof FinancialIndicators;
  label: string;
  value: string;
  rawValue: NumericValue;
  signal: Signal;
  explanation: string;
  scoreImpact: string;
  source: DataSource;
  isEstimated: boolean;
  isAvailable: boolean;
}

export interface DataQuality {
  completenessScore: number;
  level: DataQualityLevel;
  source: DataSource;
  lastUpdated: string;
  warnings: string[];
}

export interface ScoreExplanation {
  text: string;
  mainLostPoints: Array<{
    label: string;
    lostPoints: number;
    reason: string;
  }>;
}

export interface StockAnalysis {
  ticker: string;
  name: string;
  sector: string;
  country: string;
  currency: string;
  price: number;
  dayChangePercent: number;
  score: number;
  decision: Decision;
  summary: {
    short: string;
    strengths: string[];
    weaknesses: string[];
    mainRisk: string;
    valuationRead: string;
    conclusion: string;
    finalDecision: Decision;
  };
  scoreBlocks: ScoreBlock[];
  indicators: IndicatorView[];
  scoreExplanation: ScoreExplanation;
  dataQuality: DataQuality;
  source: string;
  lastUpdated: string;
  mode: "free" | "local" | "partial";
}

export interface RawStockData {
  ticker: string;
  name: string;
  sector: string;
  country: string;
  currency: string;
  price: number;
  dayChangePercent: number;
  indicators: FinancialIndicators;
  moatNote: number;
  riskNote: number;
  source?: DataSource;
  lastUpdated?: string;
  warnings?: string[];
  estimatedFields?: Array<keyof FinancialIndicators>;
}

export interface WatchlistItem {
  ticker: string;
  name: string;
  score: number;
  decision: Decision;
  price: number;
  dayChangePercent: number;
  signal: Signal;
  addedAt?: string;
  sector?: string;
  country?: string;
  currency?: string;
}

export interface PortfolioLine {
  id: string;
  broker: BrokerName;
  ticker: string;
  name: string;
  sector: string;
  country: string;
  currency: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  fees: number;
  purchaseDate: string;
  score?: number;
  valuationScore?: number;
  riskScore?: number;
  dataQualityScore?: number;
}
