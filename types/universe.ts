export type AssetType = "Action" | "ETF";
export type UniverseAssetType = "stock" | "etf";
export type FreeDataSource = "SEC" | "Stooq" | "local" | "fallback";

export interface StockUniverseItem {
  ticker: string;
  name: string;
  exchange: string;
  market: string;
  country: string;
  region: "États-Unis" | "Europe" | "France" | "Monde";
  sector: string;
  subSector: string;
  type: AssetType;
  assetType: UniverseAssetType;
  currency: string;
  tags: string[];
  sourcePossible: FreeDataSource[];
  issuer?: string;
  indexTracked?: string;
  expenseRatio?: number;
  distributionPolicy?: "Capitalisant" | "Distribuant" | "Mixte";
  holdingsSummary?: string;
  topHoldings?: string[];
  positionsCount?: number;
  assetClass?: string;
  geographicExposure?: string;
  recentPerformance?: string;
  popularityScore?: number;
}
