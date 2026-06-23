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
      ? "border-mint/20 bg-mint/10 text-mint"
      : dataQuality.level === "moyenne"
        ? "border-amber/20 bg-amber/10 text-amber"
        : "border-rose/20 bg-rose/10 text-rose";

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
