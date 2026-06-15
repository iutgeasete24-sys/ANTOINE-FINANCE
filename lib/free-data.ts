import { mockStocks } from "@/data/mockStocks";
import { stockUniverse } from "@/data/stockUniverse";
import type { DataSource, FinancialIndicators, RawStockData } from "@/types/finance";
import { analyzeStock } from "./scoring";

const STOOQ_QUOTE_URL = "https://stooq.com/q/l/";
const STOOQ_HISTORY_URL = "https://stooq.com/q/d/l/";
const SEC_COMPANY_FACTS_URL = "https://data.sec.gov/api/xbrl/companyfacts";
const FREE_DATA_REVALIDATE_SECONDS = 60 * 30;
const SEC_REVALIDATE_SECONDS = 60 * 60 * 24;
const REQUEST_TIMEOUT_MS = 1500;

type FreeMode = "free" | "local" | "partial";

interface StooqQuoteRow {
  symbol: string;
  date: string;
  time: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export interface FreeQuote {
  ticker: string;
  price: number | null;
  previousClose: number | null;
  dayChangePercent: number | null;
  source: "Stooq";
  lastUpdated: string;
  delayed: true;
  warning?: string;
}

export interface HistoricalPrice {
  date: string;
  close: number;
}

type SecFactUnit = Record<string, Array<Record<string, unknown>>>;
type SecFacts = Record<string, { units?: SecFactUnit }>;

const secCiks: Record<string, string> = {
  AAPL: "0000320193",
  MSFT: "0000789019",
  NVDA: "0001045810",
  AVGO: "0001730168",
  GOOGL: "0001652044",
  AMZN: "0001018724",
  META: "0001326801",
  TSLA: "0001318605",
  LLY: "0000059478",
  PLTR: "0001321655",
  COST: "0000909832",
  V: "0001403161",
  MA: "0001141391"
};

function timeoutSignal() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return { controller, timeout };
}

function parseNumber(value: string | undefined) {
  if (!value || value === "N/D") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatParisDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Paris"
  }).format(date);
}

function stooqSymbol(ticker: string) {
  const normalized = ticker.trim().toLowerCase().replace("-", ".");
  if (normalized.endsWith(".pa")) return normalized.replace(".pa", ".fr");
  if (normalized.endsWith(".as")) return normalized.replace(".as", ".nl");
  if (normalized.endsWith(".de")) return normalized;
  if (normalized.endsWith(".co")) return normalized;
  if (normalized.endsWith(".sw")) return normalized;
  if (normalized.endsWith(".l")) return normalized.replace(".l", ".uk");
  if (normalized.endsWith(".mc")) return normalized;
  if (normalized.endsWith(".to")) return normalized;
  if (normalized.includes(".")) return normalized;
  return `${normalized}.us`;
}

function parseCsvLine(line: string) {
  return line.split(",").map((value) => value.trim());
}

function parseQuoteCsv(csv: string): StooqQuoteRow | null {
  const rows = csv.trim().split(/\r?\n/);
  if (rows.length < 2) return null;
  const values = parseCsvLine(rows[1]);
  if (values.length < 7 || values[1] === "N/D") return null;

  return {
    symbol: values[0],
    date: values[1],
    time: values[2],
    open: parseNumber(values[3]),
    high: parseNumber(values[4]),
    low: parseNumber(values[5]),
    close: parseNumber(values[6]),
    volume: parseNumber(values[7])
  };
}

function parseHistoryCsv(csv: string): HistoricalPrice[] {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const values = parseCsvLine(line);
      return {
        date: values[0],
        close: parseNumber(values[4])
      };
    })
    .filter((row): row is HistoricalPrice => Boolean(row.date && row.close !== null));
}

async function safeFetch(url: string, init?: RequestInit) {
  const { controller, timeout } = timeoutSignal();
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function getFreeQuote(ticker: string): Promise<FreeQuote | null> {
  const symbol = stooqSymbol(ticker);
  const url = `${STOOQ_QUOTE_URL}?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv`;

  try {
    const response = await safeFetch(url, {
      next: { revalidate: FREE_DATA_REVALIDATE_SECONDS }
    });
    if (!response.ok) return null;

    const row = parseQuoteCsv(await response.text());
    if (!row?.close) return null;

    return {
      ticker: ticker.toUpperCase(),
      price: row.close,
      previousClose: row.open,
      dayChangePercent:
        row.open && row.open > 0 ? ((row.close - row.open) / row.open) * 100 : null,
      source: "Stooq",
      lastUpdated: `${row.date} ${row.time}`,
      delayed: true
    };
  } catch {
    return null;
  }
}

export async function getHistoricalPrices(ticker: string): Promise<HistoricalPrice[]> {
  const symbol = stooqSymbol(ticker);
  const url = `${STOOQ_HISTORY_URL}?s=${encodeURIComponent(symbol)}&i=d`;

  try {
    const response = await safeFetch(url, {
      next: { revalidate: FREE_DATA_REVALIDATE_SECONDS }
    });
    if (!response.ok) return [];
    return parseHistoryCsv(await response.text());
  } catch {
    return [];
  }
}

export async function getLastClose(ticker: string) {
  const history = await getHistoricalPrices(ticker);
  return history.at(-1)?.close ?? null;
}

export async function getCompanyFacts(cik: string) {
  try {
    const response = await safeFetch(`${SEC_COMPANY_FACTS_URL}/CIK${cik}.json`, {
      headers: {
        "User-Agent": "Antoine Capital Analyzer personal app contact@example.com",
        Accept: "application/json"
      },
      next: { revalidate: SEC_REVALIDATE_SECONDS }
    });
    if (!response.ok) return null;
    return (await response.json()) as { facts?: { "us-gaap"?: SecFacts } };
  } catch {
    return null;
  }
}

function emptyIndicators(): FinancialIndicators {
  return {
    revenueGrowth5Y: null,
    epsGrowth5Y: null,
    fcfGrowth5Y: null,
    grossMargin: null,
    operatingMargin: null,
    operatingMargin5YAvg: null,
    netMargin: null,
    netMargin5YAvg: null,
    roic: null,
    roic5YAvg: null,
    roe: null,
    freeCashFlow: null,
    fcfMargin: null,
    netDebtToEbitda: null,
    debtToEquity: null,
    interestCoverage: null,
    pe: null,
    peg: null,
    evToEbitda: null,
    priceToFcf: null,
    priceToSales: null,
    shareCountChange: null,
    dividendYield: null,
    payoutRatio: null
  };
}

function annualValues(facts: SecFacts, names: string[]) {
  for (const name of names) {
    const units = facts[name]?.units;
    const entries = units?.USD ?? units?.shares ?? units?.["USD/shares"];
    if (!entries) continue;

    const values = entries
      .filter((entry) => entry.form === "10-K" && typeof entry.fy === "number")
      .map((entry) => ({
        fy: Number(entry.fy),
        value: typeof entry.val === "number" ? entry.val : null
      }))
      .filter((entry): entry is { fy: number; value: number } => entry.value !== null)
      .sort((a, b) => b.fy - a.fy);

    if (values.length > 0) return values;
  }

  return [];
}

function latestValue(values: Array<{ value: number }>) {
  return values[0]?.value ?? null;
}

function cagr(latest: number | null, oldest: number | null, periods: number) {
  if (!latest || !oldest || latest <= 0 || oldest <= 0 || periods <= 0) return null;
  return (Math.pow(latest / oldest, 1 / periods) - 1) * 100;
}

function percent(numerator: number | null, denominator: number | null) {
  if (numerator === null || denominator === null || denominator === 0) return null;
  return (numerator / denominator) * 100;
}

export function calculateFundamentalsFromSEC(companyFacts: Awaited<ReturnType<typeof getCompanyFacts>>) {
  const facts = companyFacts?.facts?.["us-gaap"];
  if (!facts) return null;

  const revenue = annualValues(facts, [
    "Revenues",
    "SalesRevenueNet",
    "RevenueFromContractWithCustomerExcludingAssessedTax"
  ]);
  const netIncome = annualValues(facts, ["NetIncomeLoss", "ProfitLoss"]);
  const operatingIncome = annualValues(facts, ["OperatingIncomeLoss"]);
  const operatingCashFlow = annualValues(facts, ["NetCashProvidedByUsedInOperatingActivities"]);
  const capex = annualValues(facts, ["PaymentsToAcquirePropertyPlantAndEquipment"]);
  const equity = annualValues(facts, ["StockholdersEquity"]);
  const debt = annualValues(facts, ["LongTermDebtAndFinanceLeaseObligations", "LongTermDebt"]);
  const shares = annualValues(facts, ["EntityCommonStockSharesOutstanding", "CommonStocksIncludingAdditionalPaidInCapital"]);

  const latestRevenue = latestValue(revenue);
  const oldestRevenue = revenue[Math.min(revenue.length - 1, 4)]?.value ?? null;
  const latestNetIncome = latestValue(netIncome);
  const latestOperatingIncome = latestValue(operatingIncome);
  const latestOperatingCashFlow = latestValue(operatingCashFlow);
  const latestCapex = latestValue(capex);
  const latestFcf =
    latestOperatingCashFlow === null
      ? null
      : latestOperatingCashFlow - Math.abs(latestCapex ?? 0);
  const latestEquity = latestValue(equity);
  const latestDebt = latestValue(debt);
  const latestShares = latestValue(shares);
  const oldestShares = shares[Math.min(shares.length - 1, 4)]?.value ?? null;

  return {
    revenueGrowth5Y: cagr(latestRevenue, oldestRevenue, Math.max(1, Math.min(revenue.length, 5) - 1)),
    epsGrowth5Y: null,
    fcfGrowth5Y: null,
    grossMargin: null,
    operatingMargin: percent(latestOperatingIncome, latestRevenue),
    operatingMargin5YAvg: null,
    netMargin: percent(latestNetIncome, latestRevenue),
    netMargin5YAvg: null,
    roic: null,
    roic5YAvg: null,
    roe: percent(latestNetIncome, latestEquity),
    freeCashFlow: latestFcf,
    fcfMargin: percent(latestFcf, latestRevenue),
    netDebtToEbitda: null,
    debtToEquity:
      latestDebt === null || latestEquity === null || latestEquity === 0
        ? null
        : latestDebt / latestEquity,
    interestCoverage: null,
    pe: null,
    peg: null,
    evToEbitda: null,
    priceToFcf: null,
    priceToSales: null,
    shareCountChange:
      latestShares === null || oldestShares === null || oldestShares === 0
        ? null
        : ((latestShares - oldestShares) / oldestShares) * 100,
    dividendYield: null,
    payoutRatio: null
  } satisfies FinancialIndicators;
}

function localFallback(ticker: string) {
  const normalizedTicker = ticker.trim().toUpperCase();
  return mockStocks.find((stock) => stock.ticker === normalizedTicker) ?? null;
}

function universeFallback(ticker: string): RawStockData {
  const normalizedTicker = ticker.trim().toUpperCase();
  const item = stockUniverse.find((candidate) => candidate.ticker === normalizedTicker);

  return {
    ticker: item?.ticker ?? normalizedTicker,
    name: item?.name ?? normalizedTicker,
    sector: item?.sector ?? "Non renseigné",
    country: item?.country ?? "Non renseigné",
    currency: item?.currency ?? "EUR",
    price: 0,
    dayChangePercent: 0,
    moatNote: 5,
    riskNote: 2.5,
    indicators: emptyIndicators(),
    source: "local",
    warnings: [
      "Prix indisponible avec les sources gratuites.",
      "Fondamentaux complets indisponibles gratuitement pour cette société."
    ],
    lastUpdated: formatParisDate(new Date())
  };
}

function dataSourceLabel(parts: DataSource[]): DataSource {
  if (parts.includes("SEC EDGAR") && parts.includes("Stooq")) return "sources gratuites";
  return parts[0] ?? "local";
}

export async function getRawStockData(ticker: string): Promise<RawStockData> {
  const normalizedTicker = ticker.trim().toUpperCase();
  const item = stockUniverse.find((candidate) => candidate.ticker === normalizedTicker);
  const fallback = localFallback(normalizedTicker) ?? universeFallback(normalizedTicker);
  const warnings: string[] = [];
  const sources: DataSource[] = [];

  const [quote, facts] = await Promise.all([
    getFreeQuote(normalizedTicker),
    item?.country === "États-Unis" && secCiks[normalizedTicker]
      ? getCompanyFacts(secCiks[normalizedTicker])
      : Promise.resolve(null)
  ]);

  const secIndicators = calculateFundamentalsFromSEC(facts);
  if (quote?.price !== null && quote?.price !== undefined) {
    sources.push("Stooq");
  } else {
    warnings.push("Prix indisponible avec les sources gratuites.");
  }

  if (secIndicators) {
    sources.push("SEC EDGAR");
  } else if (item?.country === "États-Unis") {
    warnings.push("Fondamentaux SEC indisponibles pour ce ticker.");
  } else {
    warnings.push("Fondamentaux complets indisponibles gratuitement pour cette société.");
  }

  const source = sources.length > 0 ? dataSourceLabel(sources) : fallback.source ?? "local";
  const hasFreeFundamentals = Boolean(secIndicators);

  return {
    ...fallback,
    ticker: item?.ticker ?? fallback.ticker,
    name: item?.name ?? fallback.name,
    sector: item?.sector ?? fallback.sector,
    country: item?.country ?? fallback.country,
    currency: item?.currency ?? fallback.currency,
    price: quote?.price ?? fallback.price,
    dayChangePercent: quote?.dayChangePercent ?? fallback.dayChangePercent,
    indicators: secIndicators ?? fallback.indicators,
    source,
    warnings: [
      "Données gratuites, potentiellement différées. Utilisation personnelle.",
      ...warnings,
      ...(!hasFreeFundamentals && localFallback(normalizedTicker)
        ? ["Score calculé avec des fondamentaux locaux d'exemple."]
        : [])
    ],
    lastUpdated: quote?.lastUpdated ?? formatParisDate(new Date())
  };
}

export async function getStockAnalysis(ticker: string) {
  const rawData = await getRawStockData(ticker);
  const mode: FreeMode =
    rawData.source === "local" || rawData.source === "données d'exemple"
      ? "local"
      : rawData.warnings?.some((warning) => warning.includes("indisponible"))
        ? "partial"
        : "free";

  return analyzeStock(rawData, mode);
}
