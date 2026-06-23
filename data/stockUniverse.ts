import type { StockUniverseItem } from "@/types/universe";

const usMegaCaps = [
  ["AAPL", "Apple", "NASDAQ", "États-Unis", "Technologie"],
  ["MSFT", "Microsoft", "NASDAQ", "États-Unis", "Technologie"],
  ["NVDA", "NVIDIA", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["AMZN", "Amazon", "NASDAQ", "États-Unis", "Consommation"],
  ["GOOGL", "Alphabet", "NASDAQ", "États-Unis", "Technologie"],
  ["META", "Meta Platforms", "NASDAQ", "États-Unis", "Technologie"],
  ["TSLA", "Tesla", "NASDAQ", "États-Unis", "Automobile"],
  ["AVGO", "Broadcom", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["LLY", "Eli Lilly", "NYSE", "États-Unis", "Santé"],
  ["JPM", "JPMorgan Chase", "NYSE", "États-Unis", "Finance"],
  ["V", "Visa", "NYSE", "États-Unis", "Finance"],
  ["MA", "Mastercard", "NYSE", "États-Unis", "Finance"],
  ["UNH", "UnitedHealth", "NYSE", "États-Unis", "Santé"],
  ["XOM", "Exxon Mobil", "NYSE", "États-Unis", "Énergie"],
  ["PG", "Procter & Gamble", "NYSE", "États-Unis", "Consommation"],
  ["COST", "Costco", "NASDAQ", "États-Unis", "Distribution"],
  ["HD", "Home Depot", "NYSE", "États-Unis", "Distribution"],
  ["NFLX", "Netflix", "NASDAQ", "États-Unis", "Communication"],
  ["AMD", "Advanced Micro Devices", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["PLTR", "Palantir Technologies", "NASDAQ", "États-Unis", "Logiciels"],
  ["ADBE", "Adobe", "NASDAQ", "États-Unis", "Logiciels"],
  ["CRM", "Salesforce", "NYSE", "États-Unis", "Logiciels"],
  ["NOW", "ServiceNow", "NYSE", "États-Unis", "Logiciels"],
  ["INTC", "Intel", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["QCOM", "Qualcomm", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["TXN", "Texas Instruments", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["AMAT", "Applied Materials", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["LRCX", "Lam Research", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["MU", "Micron Technology", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["TMO", "Thermo Fisher Scientific", "NYSE", "États-Unis", "Santé"],
  ["ABT", "Abbott Laboratories", "NYSE", "États-Unis", "Santé"],
  ["MRK", "Merck & Co", "NYSE", "États-Unis", "Santé"],
  ["PFE", "Pfizer", "NYSE", "États-Unis", "Santé"],
  ["ABBV", "AbbVie", "NYSE", "États-Unis", "Santé"],
  ["JNJ", "Johnson & Johnson", "NYSE", "États-Unis", "Santé"],
  ["KO", "Coca-Cola", "NYSE", "États-Unis", "Consommation"],
  ["PEP", "PepsiCo", "NASDAQ", "États-Unis", "Consommation"],
  ["MCD", "McDonald's", "NYSE", "États-Unis", "Consommation"],
  ["NKE", "Nike", "NYSE", "États-Unis", "Consommation"],
  ["DIS", "Walt Disney", "NYSE", "États-Unis", "Communication"],
  ["GE", "GE Aerospace", "NYSE", "États-Unis", "Industrie"],
  ["CAT", "Caterpillar", "NYSE", "États-Unis", "Industrie"],
  ["DE", "Deere & Company", "NYSE", "États-Unis", "Industrie"],
  ["HON", "Honeywell", "NASDAQ", "États-Unis", "Industrie"],
  ["UPS", "UPS", "NYSE", "États-Unis", "Industrie"],
  ["RTX", "RTX", "NYSE", "États-Unis", "Industrie"],
  ["LMT", "Lockheed Martin", "NYSE", "États-Unis", "Industrie"],
  ["NEE", "NextEra Energy", "NYSE", "États-Unis", "Énergie"],
  ["CVX", "Chevron", "NYSE", "États-Unis", "Énergie"],
  ["BAC", "Bank of America", "NYSE", "États-Unis", "Finance"],
  ["MS", "Morgan Stanley", "NYSE", "États-Unis", "Finance"],
  ["GS", "Goldman Sachs", "NYSE", "États-Unis", "Finance"],
  ["BLK", "BlackRock", "NYSE", "États-Unis", "Finance"],
  ["SPGI", "S&P Global", "NYSE", "États-Unis", "Finance"],
  ["ISRG", "Intuitive Surgical", "NASDAQ", "États-Unis", "Santé"],
  ["SYK", "Stryker", "NYSE", "États-Unis", "Santé"],
  ["DHR", "Danaher", "NYSE", "États-Unis", "Santé"],
  ["GILD", "Gilead Sciences", "NASDAQ", "États-Unis", "Santé"],
  ["VRTX", "Vertex Pharmaceuticals", "NASDAQ", "États-Unis", "Santé"],
  ["REGN", "Regeneron", "NASDAQ", "États-Unis", "Santé"]
];

const europeStocks = [
  ["ASML", "ASML Holding", "Euronext Amsterdam", "Pays-Bas", "Semi-conducteurs"],
  [
    "ASML.AS",
    "ASML Holding Amsterdam",
    "Euronext Amsterdam",
    "Pays-Bas",
    "Semi-conducteurs"
  ],
  ["ASMI.AS", "ASM International", "Euronext Amsterdam", "Pays-Bas", "Semi-conducteurs"],
  ["NVO", "Novo Nordisk ADR", "NYSE", "Danemark", "Santé"],
  ["NOVO-B.CO", "Novo Nordisk", "Nasdaq Copenhagen", "Danemark", "Santé"],
  ["SAP.DE", "SAP", "Xetra", "Allemagne", "Logiciels"],
  ["SIE.DE", "Siemens", "Xetra", "Allemagne", "Industrie"],
  ["ALV.DE", "Allianz", "Xetra", "Allemagne", "Finance"],
  ["DTE.DE", "Deutsche Telekom", "Xetra", "Allemagne", "Communication"],
  ["BAS.DE", "BASF", "Xetra", "Allemagne", "Industrie"],
  ["BMW.DE", "BMW", "Xetra", "Allemagne", "Automobile"],
  ["MBG.DE", "Mercedes-Benz Group", "Xetra", "Allemagne", "Automobile"],
  ["ADS.DE", "Adidas", "Xetra", "Allemagne", "Consommation"],
  ["RMS.PA", "Hermès", "Euronext Paris", "France", "Luxe"],
  ["LVMH", "LVMH", "Euronext Paris", "France", "Luxe"],
  ["MC.PA", "LVMH", "Euronext Paris", "France", "Luxe"],
  ["OR.PA", "L'Oréal", "Euronext Paris", "France", "Luxe"],
  ["CDI.PA", "Christian Dior", "Euronext Paris", "France", "Luxe"],
  ["KER.PA", "Kering", "Euronext Paris", "France", "Luxe"],
  ["AIR.PA", "Airbus", "Euronext Paris", "France", "Industrie"],
  ["AI.PA", "Air Liquide", "Euronext Paris", "France", "Industrie"],
  ["SU.PA", "Schneider Electric", "Euronext Paris", "France", "Industrie"],
  ["DG.PA", "Vinci", "Euronext Paris", "France", "Industrie"],
  ["VINCI", "Vinci", "Euronext Paris", "France", "Industrie"],
  ["SAN.PA", "Sanofi", "Euronext Paris", "France", "Santé"],
  ["TTE.PA", "TotalEnergies", "Euronext Paris", "France", "Énergie"],
  ["BNP.PA", "BNP Paribas", "Euronext Paris", "France", "Finance"],
  ["ACA.PA", "Crédit Agricole", "Euronext Paris", "France", "Finance"],
  ["GLE.PA", "Société Générale", "Euronext Paris", "France", "Finance"],
  ["CS.PA", "AXA", "Euronext Paris", "France", "Finance"],
  ["RI.PA", "Pernod Ricard", "Euronext Paris", "France", "Consommation"],
  ["EL.PA", "EssilorLuxottica", "Euronext Paris", "France", "Santé"],
  ["DSY.PA", "Dassault Systèmes", "Euronext Paris", "France", "Logiciels"],
  ["CAP.PA", "Capgemini", "Euronext Paris", "France", "Technologie"],
  ["STMPA.PA", "STMicroelectronics", "Euronext Paris", "France", "Semi-conducteurs"],
  ["ORA.PA", "Orange", "Euronext Paris", "France", "Communication"],
  ["VIE.PA", "Veolia", "Euronext Paris", "France", "Services"],
  ["ENGI.PA", "Engie", "Euronext Paris", "France", "Énergie"],
  ["EN.PA", "Bouygues", "Euronext Paris", "France", "Industrie"],
  ["HO.PA", "Thales", "Euronext Paris", "France", "Industrie"],
  ["SAF.PA", "Safran", "Euronext Paris", "France", "Industrie"],
  ["LR.PA", "Legrand", "Euronext Paris", "France", "Industrie"],
  ["ML.PA", "Michelin", "Euronext Paris", "France", "Industrie"],
  ["PUB.PA", "Publicis", "Euronext Paris", "France", "Communication"],
  ["ITX.MC", "Inditex", "Bolsa de Madrid", "Espagne", "Consommation"],
  ["IBE.MC", "Iberdrola", "Bolsa de Madrid", "Espagne", "Énergie"],
  ["SAN.MC", "Banco Santander", "Bolsa de Madrid", "Espagne", "Finance"],
  ["NESN.SW", "Nestlé", "SIX Swiss Exchange", "Suisse", "Consommation"],
  ["NOVN.SW", "Novartis", "SIX Swiss Exchange", "Suisse", "Santé"],
  ["ROG.SW", "Roche", "SIX Swiss Exchange", "Suisse", "Santé"],
  ["CFR.SW", "Richemont", "SIX Swiss Exchange", "Suisse", "Luxe"],
  ["SHELL.AS", "Shell", "Euronext Amsterdam", "Pays-Bas", "Énergie"],
  ["ULVR.L", "Unilever", "London Stock Exchange", "Royaume-Uni", "Consommation"],
  ["AZN.L", "AstraZeneca", "London Stock Exchange", "Royaume-Uni", "Santé"],
  ["HSBA.L", "HSBC", "London Stock Exchange", "Royaume-Uni", "Finance"],
  ["RIO.L", "Rio Tinto", "London Stock Exchange", "Royaume-Uni", "Matériaux"],
  ["REL.L", "RELX", "London Stock Exchange", "Royaume-Uni", "Communication"],
  ["AIR", "Air Products & Chemicals", "NYSE", "États-Unis", "Industrie"],
  ["AC.TO", "Air Canada", "Toronto Stock Exchange", "Canada", "Industrie"],
  ["ASX", "ASE Technology", "NYSE", "Taïwan", "Semi-conducteurs"],
  ["ASB", "Associated Banc-Corp", "NYSE", "États-Unis", "Finance"]
];

const etfs = [
  ["SPY", "SPDR S&P 500 ETF Trust", "NYSE Arca", "États-Unis", "ETF Monde"],
  ["VOO", "Vanguard S&P 500 ETF", "NYSE Arca", "États-Unis", "ETF Monde"],
  ["QQQ", "Invesco QQQ Trust", "NASDAQ", "États-Unis", "ETF Technologie"],
  ["VTI", "Vanguard Total Stock Market ETF", "NYSE Arca", "États-Unis", "ETF Monde"],
  ["IWDA.AS", "iShares Core MSCI World", "Euronext Amsterdam", "Irlande", "ETF Monde"],
  ["CW8.PA", "Amundi MSCI World", "Euronext Paris", "France", "ETF Monde"],
  ["EWLD.PA", "Amundi MSCI World II", "Euronext Paris", "France", "ETF Monde"],
  ["ESE.PA", "BNP Paribas Easy S&P 500", "Euronext Paris", "France", "ETF États-Unis"],
  ["PAEEM.PA", "Amundi MSCI Emerging Markets", "Euronext Paris", "France", "ETF Monde"],
  ["EXS1.DE", "iShares Core DAX", "Xetra", "Allemagne", "ETF Europe"],
  ["VUSA.L", "Vanguard S&P 500", "London Stock Exchange", "Royaume-Uni", "ETF S&P 500"],
  [
    "CSPX.L",
    "iShares Core S&P 500",
    "London Stock Exchange",
    "Royaume-Uni",
    "ETF S&P 500"
  ],
  ["EQQQ.PA", "Invesco Nasdaq 100", "Euronext Paris", "France", "ETF Nasdaq 100"],
  ["CAC.PA", "ETF CAC 40", "Euronext Paris", "France", "ETF France"]
];

const additionalStocks = [
  ["BRK-B", "Berkshire Hathaway", "NYSE", "États-Unis", "Finance"],
  ["WMT", "Walmart", "NYSE", "États-Unis", "Distribution"],
  ["ORCL", "Oracle", "NYSE", "États-Unis", "Logiciels"],
  ["CSCO", "Cisco Systems", "NASDAQ", "États-Unis", "Technologie"],
  ["IBM", "IBM", "NYSE", "États-Unis", "Technologie"],
  ["INTU", "Intuit", "NASDAQ", "États-Unis", "Logiciels"],
  ["UBER", "Uber Technologies", "NYSE", "États-Unis", "Technologie"],
  ["SHOP", "Shopify", "NYSE", "Canada", "Technologie"],
  ["SQ", "Block", "NYSE", "États-Unis", "Finance"],
  ["PYPL", "PayPal", "NASDAQ", "États-Unis", "Finance"],
  ["SNOW", "Snowflake", "NYSE", "États-Unis", "Logiciels"],
  ["NET", "Cloudflare", "NYSE", "États-Unis", "Logiciels"],
  ["DDOG", "Datadog", "NASDAQ", "États-Unis", "Logiciels"],
  ["MDB", "MongoDB", "NASDAQ", "États-Unis", "Logiciels"],
  ["TEAM", "Atlassian", "NASDAQ", "Australie", "Logiciels"],
  ["CRWD", "CrowdStrike", "NASDAQ", "États-Unis", "Logiciels"],
  ["ZS", "Zscaler", "NASDAQ", "États-Unis", "Logiciels"],
  ["PANW", "Palo Alto Networks", "NASDAQ", "États-Unis", "Logiciels"],
  ["OKTA", "Okta", "NASDAQ", "États-Unis", "Logiciels"],
  ["ARM", "Arm Holdings", "NASDAQ", "Royaume-Uni", "Semi-conducteurs"],
  ["TSM", "Taiwan Semiconductor Manufacturing", "NYSE", "Taïwan", "Semi-conducteurs"],
  ["NXPI", "NXP Semiconductors", "NASDAQ", "Pays-Bas", "Semi-conducteurs"],
  ["ON", "ON Semiconductor", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["ADI", "Analog Devices", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["KLAC", "KLA", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["MRVL", "Marvell Technology", "NASDAQ", "États-Unis", "Semi-conducteurs"],
  ["WDC", "Western Digital", "NASDAQ", "États-Unis", "Technologie"],
  ["SMCI", "Super Micro Computer", "NASDAQ", "États-Unis", "Technologie"],
  ["ELV", "Elevance Health", "NYSE", "États-Unis", "Santé"],
  ["CI", "Cigna", "NYSE", "États-Unis", "Santé"],
  ["HUM", "Humana", "NYSE", "États-Unis", "Santé"],
  ["BSX", "Boston Scientific", "NYSE", "États-Unis", "Santé"],
  ["MDT", "Medtronic", "NYSE", "Irlande", "Santé"],
  ["ZTS", "Zoetis", "NYSE", "États-Unis", "Santé"],
  ["MCK", "McKesson", "NYSE", "États-Unis", "Santé"],
  ["BMY", "Bristol Myers Squibb", "NYSE", "États-Unis", "Santé"],
  ["AMGN", "Amgen", "NASDAQ", "États-Unis", "Santé"],
  ["BIIB", "Biogen", "NASDAQ", "États-Unis", "Santé"],
  ["SBUX", "Starbucks", "NASDAQ", "États-Unis", "Consommation"],
  ["LOW", "Lowe's", "NYSE", "États-Unis", "Distribution"],
  ["TGT", "Target", "NYSE", "États-Unis", "Distribution"],
  ["EL", "Estée Lauder", "NYSE", "États-Unis", "Luxe"],
  ["LULU", "Lululemon", "NASDAQ", "États-Unis", "Consommation"],
  ["BKNG", "Booking Holdings", "NASDAQ", "États-Unis", "Consommation"],
  ["ABNB", "Airbnb", "NASDAQ", "États-Unis", "Consommation"],
  ["MELI", "MercadoLibre", "NASDAQ", "Argentine", "Technologie"],
  ["SE", "Sea Limited", "NYSE", "Singapour", "Technologie"],
  ["BABA", "Alibaba", "NYSE", "Chine", "Technologie"],
  ["PDD", "PDD Holdings", "NASDAQ", "Chine", "Technologie"],
  ["TM", "Toyota Motor", "NYSE", "Japon", "Automobile"],
  ["HMC", "Honda Motor", "NYSE", "Japon", "Automobile"],
  ["RACE", "Ferrari", "NYSE", "Italie", "Luxe"],
  ["F", "Ford Motor", "NYSE", "États-Unis", "Automobile"],
  ["GM", "General Motors", "NYSE", "États-Unis", "Automobile"],
  ["RIVN", "Rivian", "NASDAQ", "États-Unis", "Automobile"],
  ["ENPH", "Enphase Energy", "NASDAQ", "États-Unis", "Énergie"],
  ["FSLR", "First Solar", "NASDAQ", "États-Unis", "Énergie"],
  ["SLB", "Schlumberger", "NYSE", "États-Unis", "Énergie"],
  ["COP", "ConocoPhillips", "NYSE", "États-Unis", "Énergie"],
  ["EOG", "EOG Resources", "NYSE", "États-Unis", "Énergie"],
  ["LIN", "Linde", "NASDAQ", "Royaume-Uni", "Industrie"],
  ["APD", "Air Products", "NYSE", "États-Unis", "Industrie"],
  ["MMM", "3M", "NYSE", "États-Unis", "Industrie"],
  ["ETN", "Eaton", "NYSE", "Irlande", "Industrie"],
  ["PH", "Parker-Hannifin", "NYSE", "États-Unis", "Industrie"],
  ["EMR", "Emerson Electric", "NYSE", "États-Unis", "Industrie"],
  ["WM", "Waste Management", "NYSE", "États-Unis", "Industrie"],
  ["UNP", "Union Pacific", "NYSE", "États-Unis", "Industrie"],
  ["NSC", "Norfolk Southern", "NYSE", "États-Unis", "Industrie"],
  ["CB", "Chubb", "NYSE", "Suisse", "Finance"],
  ["AON", "Aon", "NYSE", "Irlande", "Finance"],
  ["MMC", "Marsh & McLennan", "NYSE", "États-Unis", "Finance"],
  ["ICE", "Intercontinental Exchange", "NYSE", "États-Unis", "Finance"],
  ["CME", "CME Group", "NASDAQ", "États-Unis", "Finance"],
  ["MCO", "Moody's", "NYSE", "États-Unis", "Finance"],
  ["EQIX", "Equinix", "NASDAQ", "États-Unis", "Immobilier"],
  ["AMT", "American Tower", "NYSE", "États-Unis", "Immobilier"],
  ["O", "Realty Income", "NYSE", "États-Unis", "Immobilier"],
  ["CCI", "Crown Castle", "NYSE", "États-Unis", "Immobilier"]
];

const etfMetadata: Record<string, Partial<StockUniverseItem>> = {
  SPY: {
    issuer: "SPDR",
    indexTracked: "S&P 500",
    expenseRatio: 0.09,
    distributionPolicy: "Distribuant",
    positionsCount: 500,
    assetClass: "Actions",
    geographicExposure: "États-Unis",
    holdingsSummary: "Grandes capitalisations américaines",
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"],
    recentPerformance: "Dépend de l'évolution du marché actions américain."
  },
  VOO: {
    issuer: "Vanguard",
    indexTracked: "S&P 500",
    expenseRatio: 0.03,
    distributionPolicy: "Distribuant",
    positionsCount: 500,
    assetClass: "Actions",
    geographicExposure: "États-Unis",
    holdingsSummary: "Grandes capitalisations américaines",
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"]
  },
  "VUSA.L": {
    issuer: "Vanguard",
    indexTracked: "S&P 500",
    expenseRatio: 0.07,
    distributionPolicy: "Distribuant",
    positionsCount: 500,
    assetClass: "Actions",
    geographicExposure: "États-Unis",
    holdingsSummary: "500 grandes entreprises américaines",
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"]
  },
  "CSPX.L": {
    issuer: "iShares",
    indexTracked: "S&P 500",
    expenseRatio: 0.07,
    distributionPolicy: "Capitalisant",
    positionsCount: 500,
    assetClass: "Actions",
    geographicExposure: "États-Unis",
    holdingsSummary: "500 grandes entreprises américaines",
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"]
  },
  QQQ: {
    issuer: "Invesco",
    indexTracked: "Nasdaq 100",
    expenseRatio: 0.2,
    distributionPolicy: "Distribuant",
    positionsCount: 100,
    assetClass: "Actions",
    geographicExposure: "États-Unis",
    holdingsSummary: "Grandes entreprises non financières du Nasdaq",
    topHoldings: ["NVIDIA", "Microsoft", "Apple", "Broadcom", "Amazon"]
  },
  "EQQQ.PA": {
    issuer: "Invesco",
    indexTracked: "Nasdaq 100",
    expenseRatio: 0.3,
    distributionPolicy: "Distribuant",
    positionsCount: 100,
    assetClass: "Actions",
    geographicExposure: "États-Unis",
    holdingsSummary: "Grandes entreprises non financières du Nasdaq",
    topHoldings: ["NVIDIA", "Microsoft", "Apple", "Broadcom", "Amazon"]
  },
  "CW8.PA": {
    issuer: "Amundi",
    indexTracked: "MSCI World",
    expenseRatio: 0.38,
    distributionPolicy: "Capitalisant",
    positionsCount: 1400,
    assetClass: "Actions",
    geographicExposure: "Monde développé",
    holdingsSummary: "Grandes et moyennes entreprises des pays développés",
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"]
  },
  "EWLD.PA": {
    issuer: "Amundi",
    indexTracked: "MSCI World",
    expenseRatio: 0.45,
    distributionPolicy: "Distribuant",
    positionsCount: 1400,
    assetClass: "Actions",
    geographicExposure: "Monde développé",
    holdingsSummary: "Grandes et moyennes entreprises des pays développés",
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"]
  },
  "IWDA.AS": {
    issuer: "iShares",
    indexTracked: "MSCI World",
    expenseRatio: 0.2,
    distributionPolicy: "Capitalisant",
    positionsCount: 1400,
    assetClass: "Actions",
    geographicExposure: "Monde développé",
    holdingsSummary: "Grandes et moyennes entreprises des pays développés"
  },
  "CAC.PA": {
    issuer: "ETF local",
    indexTracked: "CAC 40",
    expenseRatio: 0.25,
    distributionPolicy: "Mixte",
    positionsCount: 40,
    assetClass: "Actions",
    geographicExposure: "France",
    holdingsSummary: "Grandes capitalisations françaises",
    topHoldings: ["LVMH", "Hermès", "TotalEnergies", "Schneider Electric", "Air Liquide"]
  },
  "EXS1.DE": {
    issuer: "iShares",
    indexTracked: "DAX",
    expenseRatio: 0.16,
    distributionPolicy: "Capitalisant",
    positionsCount: 40,
    assetClass: "Actions",
    geographicExposure: "Allemagne",
    holdingsSummary: "Grandes capitalisations allemandes"
  }
};

function normalizeSector(rawSector: string, name: string, type: "Action" | "ETF") {
  if (type === "ETF" || rawSector.startsWith("ETF")) return "ETF";
  if (["Semi-conducteurs", "Logiciels", "Technologie"].includes(rawSector))
    return "Technologie";
  if (rawSector === "Communication") return "Services de communication";
  if (rawSector === "Automobile") return "Automobile";
  if (rawSector === "Distribution") return "Consommation discrétionnaire";
  if (rawSector === "Consommation") return "Consommation défensive";
  if (rawSector === "Services")
    return name.includes("Engie") || name.includes("Veolia") ? "Utilities" : "Industrie";
  return rawSector;
}

function inferSubSector(
  ticker: string,
  name: string,
  rawSector: string,
  type: "Action" | "ETF"
) {
  if (type === "ETF") return rawSector;
  if (rawSector === "Semi-conducteurs") return "Semi-conducteurs";
  if (rawSector === "Logiciels") return name.includes("Cloud") ? "Cloud" : "Logiciels";
  if (rawSector === "Technologie") {
    if (["AAPL", "WDC", "SMCI", "IBM", "CSCO"].includes(ticker)) return "Hardware";
    if (name.includes("Capgemini")) return "Services IT";
    return "Intelligence artificielle";
  }
  if (rawSector === "Santé") {
    if (
      [
        "LLY",
        "NVO",
        "NOVO-B.CO",
        "SAN.PA",
        "MRK",
        "PFE",
        "ABBV",
        "JNJ",
        "NOVN.SW",
        "ROG.SW"
      ].includes(ticker)
    )
      return "Pharmaceutique";
    if (["AMGN", "BIIB", "GILD", "VRTX", "REGN"].includes(ticker))
      return "Biotechnologie";
    if (["SYK", "MDT", "BSX", "ISRG", "EL.PA"].includes(ticker)) return "Medtech";
    if (["UNH", "ELV", "CI", "HUM"].includes(ticker)) return "Assurance santé";
    return "Services de santé";
  }
  if (rawSector === "Industrie") {
    if (["AIR.PA", "GE", "SAF.PA"].includes(ticker)) return "Aéronautique";
    if (["LMT", "RTX", "HO.PA"].includes(ticker)) return "Défense";
    if (["DG.PA", "VINCI", "EN.PA"].includes(ticker)) return "Construction";
    if (["DE"].includes(ticker)) return "Machines agricoles";
    if (["UPS", "UNP", "NSC"].includes(ticker)) return "Logistique";
    if (["AI.PA", "APD", "LIN"].includes(ticker)) return "Gaz industriels";
    return "Équipements industriels";
  }
  if (rawSector === "Finance") {
    if (["V", "MA", "PYPL", "SQ"].includes(ticker)) return "Paiement";
    if (["BLK"].includes(ticker)) return "Gestion d’actifs";
    if (["SPGI", "MCO", "ICE", "CME"].includes(ticker)) return "Bourse / Market data";
    if (name.includes("AXA") || ["CB", "AON", "MMC"].includes(ticker)) return "Assurance";
    return "Banques";
  }
  if (rawSector === "Luxe") return "Luxe";
  if (rawSector === "Énergie") {
    if (["ENPH", "FSLR"].includes(ticker)) return "Énergies renouvelables";
    if (ticker === "SLB") return "Services pétroliers";
    return "Pétrole & gaz";
  }
  if (rawSector === "Automobile") {
    if (["TSLA", "RIVN"].includes(ticker)) return "Véhicules électriques";
    if (ticker === "ML.PA") return "Pneumatiques";
    return "Constructeurs automobiles";
  }
  if (rawSector === "Distribution") return "Distribution";
  if (rawSector === "Communication")
    return name.includes("Alphabet") ? "Internet" : "Médias";
  if (rawSector === "Consommation") {
    if (["OR.PA", "EL"].includes(ticker)) return "Cosmétiques";
    if (["KO", "PEP", "RI.PA"].includes(ticker)) return "Boissons";
    if (ticker === "AMZN" || ticker === "MELI") return "E-commerce";
    if (ticker === "MCD" || ticker === "SBUX") return "Restauration";
    return "Produits ménagers";
  }
  if (rawSector === "Matériaux")
    return name.includes("Air Liquide") ? "Gaz industriels" : "Matériaux";
  if (rawSector === "Immobilier") return "REIT";
  return rawSector;
}

function inferCurrency(exchange: string, country: string) {
  if (exchange.includes("NYSE") || exchange.includes("NASDAQ")) return "USD";
  if (
    exchange.includes("Paris") ||
    exchange.includes("Amsterdam") ||
    exchange === "Xetra" ||
    exchange.includes("Madrid")
  )
    return "EUR";
  if (exchange.includes("London")) return "GBP";
  if (exchange.includes("Swiss")) return "CHF";
  if (country === "Canada") return "CAD";
  if (country === "Danemark") return "DKK";
  if (country === "Japon") return "JPY";
  return "USD";
}

function inferFreeSources(type: "Action" | "ETF", country: string) {
  if (type === "ETF") return ["Stooq", "local", "fallback"] as const;
  if (country === "États-Unis") return ["SEC", "Stooq", "local", "fallback"] as const;
  return ["Stooq", "local", "fallback"] as const;
}

function toItem(row: string[], type: "Action" | "ETF" = "Action"): StockUniverseItem {
  const [ticker, name, exchange, country, rawSector] = row;
  const sector = normalizeSector(rawSector, name, type);
  const subSector = inferSubSector(ticker, name, rawSector, type);
  const region =
    type === "ETF" && rawSector === "ETF Monde"
      ? "Monde"
      : country === "France"
        ? "France"
        : country === "États-Unis"
          ? "États-Unis"
          : "Europe";
  const tags = [
    sector,
    subSector,
    region,
    country,
    type,
    sector === "Semi-conducteurs" ? "Croissance" : "",
    sector === "Santé" ? "Défensif" : "",
    type === "ETF" ? "Diversifié" : ""
  ].filter(Boolean);

  return {
    ticker,
    name,
    exchange,
    market: exchange,
    country,
    region,
    sector,
    subSector,
    type,
    assetType: type === "ETF" ? "etf" : "stock",
    currency: inferCurrency(exchange, country),
    popularityScore: ticker.length <= 4 ? 80 : 55,
    tags,
    sourcePossible: [...inferFreeSources(type, country)],
    ...(type === "ETF" ? etfMetadata[ticker] : {})
  };
}

export const stockUniverse: StockUniverseItem[] = [
  ...usMegaCaps.map((row) => toItem(row)),
  ...europeStocks.map((row) => toItem(row)),
  ...additionalStocks.map((row) => toItem(row)),
  ...etfs.map((row) => toItem(row, "ETF"))
];

export function searchStockUniverse(query: string, limit = 12) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return stockUniverse.slice(0, limit);

  return stockUniverse
    .map((item) => {
      const ticker = item.ticker.toLowerCase();
      const name = item.name.toLowerCase();
      const startsTicker = ticker.startsWith(normalized);
      const startsName = name.startsWith(normalized);
      const containsTicker = ticker.includes(normalized);
      const containsName = name.includes(normalized);
      const score = startsTicker
        ? 100
        : startsName
          ? 90
          : containsTicker
            ? 70
            : containsName
              ? 55
              : 0;

      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.ticker.localeCompare(b.item.ticker))
    .slice(0, limit)
    .map((result) => result.item);
}
