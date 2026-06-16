import type { PortfolioLine } from "@/types/finance";

export const brokerOptions = [
  "Trade Republic",
  "Boursorama",
  "Degiro",
  "Interactive Brokers",
  "Autre"
] as const;

export const mockPortfolioLines: PortfolioLine[] = [
  {
    id: "line-asml-tr",
    broker: "Trade Republic",
    ticker: "ASML",
    name: "ASML Holding",
    sector: "Semi-conducteurs",
    country: "Pays-Bas",
    currency: "EUR",
    quantity: 2,
    averagePrice: 710,
    currentPrice: 928.4,
    fees: 1,
    purchaseDate: "2024-05-16",
    score: 83,
    valuationScore: 10,
    riskScore: 3.8,
    dataQualityScore: 100
  },
  {
    id: "line-air-bourso",
    broker: "Boursorama",
    ticker: "AIR.PA",
    name: "Airbus",
    sector: "Aéronautique",
    country: "France",
    currency: "EUR",
    quantity: 8,
    averagePrice: 132,
    currentPrice: 154.7,
    fees: 6,
    purchaseDate: "2024-11-04",
    score: 68,
    valuationScore: 10,
    riskScore: 3.2,
    dataQualityScore: 100
  },
  {
    id: "line-avgo-ib",
    broker: "Interactive Brokers",
    ticker: "AVGO",
    name: "Broadcom",
    sector: "Semi-conducteurs et logiciels",
    country: "États-Unis",
    currency: "USD",
    quantity: 12,
    averagePrice: 128,
    currentPrice: 186.2,
    fees: 2,
    purchaseDate: "2023-09-21",
    score: 80,
    valuationScore: 8,
    riskScore: 3.1,
    dataQualityScore: 100
  },
  {
    id: "line-novo-b-degiro",
    broker: "Degiro",
    ticker: "NOVO-B.CO",
    name: "Novo Nordisk",
    sector: "Santé",
    country: "Danemark",
    currency: "DKK",
    quantity: 5,
    averagePrice: 760,
    currentPrice: 924.2,
    fees: 3,
    purchaseDate: "2024-02-02",
    score: 82,
    valuationScore: 9,
    riskScore: 3.4,
    dataQualityScore: 100
  }
];
