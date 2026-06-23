import Link from "next/link";
import { ArrowUpRight, WalletCards } from "lucide-react";
import { formatCurrency, formatPercent } from "@/utils/format";

interface PortfolioSummaryCardProps {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  lineCount: number;
}

export function PortfolioSummaryCard({
  totalValue,
  totalGain,
  totalGainPercent,
  lineCount
}: PortfolioSummaryCardProps) {
  const positive = totalGain >= 0;

  return (
    <Link
      href="/portfolio"
      className="tap-feedback premium-card block rounded-3xl p-4 shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-mint">
            <WalletCards size={18} />
            <p className="text-xs font-bold uppercase tracking-normal">Portefeuille</p>
          </div>
          <p className="mt-2 text-3xl font-black text-ink">
            {formatCurrency(totalValue, "EUR")}
          </p>
          <p className="mt-1 text-xs font-semibold text-graphite">
            {lineCount} {lineCount > 1 ? "positions suivies" : "position suivie"}
          </p>
        </div>
        <ArrowUpRight size={19} className="mt-1 shrink-0 text-graphite" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-white/[0.07] p-3">
          <p className="text-[11px] font-bold uppercase tracking-normal text-graphite/65">
            Variation
          </p>
          <p
            className={`mt-1 text-base font-black ${positive ? "text-mint" : "text-rose"}`}
          >
            {formatCurrency(totalGain, "EUR")}
          </p>
        </div>
        <div className="rounded-2xl bg-white/[0.07] p-3">
          <p className="text-[11px] font-bold uppercase tracking-normal text-graphite/65">
            Performance
          </p>
          <p
            className={`mt-1 text-base font-black ${positive ? "text-mint" : "text-rose"}`}
          >
            {formatPercent(totalGainPercent)}
          </p>
        </div>
      </div>
    </Link>
  );
}
