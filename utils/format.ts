export function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value >= 0 ? "+" : ""}${value.toLocaleString("fr-FR", {
    maximumFractionDigits: digits
  })} %`;
}

export function formatRatio(value: number, suffix = "x") {
  return `${value.toLocaleString("fr-FR", {
    maximumFractionDigits: 1
  })}${suffix}`;
}

export function formatLargeCurrency(value: number, currency = "EUR") {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString("fr-FR", {
      maximumFractionDigits: 1
    })} Md ${currency}`;
  }

  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("fr-FR", {
      maximumFractionDigits: 1
    })} M ${currency}`;
  }

  return formatCurrency(value, currency);
}
