import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { DataQuality } from "@/types/finance";

interface DataQualityBadgeProps {
  dataQuality: DataQuality;
}

export function DataQualityBadge({ dataQuality }: DataQualityBadgeProps) {
  const Icon =
    dataQuality.level === "élevée"
      ? CheckCircle2
      : dataQuality.level === "moyenne"
        ? Info
        : AlertTriangle;
  const classes =
    dataQuality.level === "élevée"
      ? "bg-emerald-300/10 text-emerald-100 border-emerald-300/20"
      : dataQuality.level === "moyenne"
        ? "bg-amber-300/10 text-amber-100 border-amber-300/20"
        : "bg-rose-300/10 text-rose-100 border-rose-300/20";

  return (
    <div className={`rounded-2xl border p-3 ${classes}`}>
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <p className="text-sm font-black">Qualité des données : {dataQuality.level}</p>
      </div>
      <p className="mt-1 text-xs font-semibold opacity-80">
        {dataQuality.completenessScore} % des données clés disponibles
      </p>
      <p className="mt-2 text-xs font-semibold opacity-80">
        Données gratuites, potentiellement différées. Utilisation personnelle.
      </p>
      {dataQuality.completenessScore < 100 && dataQuality.warnings.length > 0 && (
        <p className="mt-2 text-xs leading-relaxed opacity-80">
          Certaines données clés sont indisponibles, le score est donc partiel.
        </p>
      )}
    </div>
  );
}
