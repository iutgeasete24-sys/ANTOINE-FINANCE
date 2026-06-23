import { AlertTriangle } from "lucide-react";

interface AlertCardProps {
  alerts: string[];
}

export function AlertCard({ alerts }: AlertCardProps) {
  if (alerts.length === 0) return null;

  return (
    <section className="rounded-3xl border border-amber/20 bg-amber/10 p-4 text-amber">
      <div className="flex gap-3">
        <AlertTriangle size={19} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-black">À surveiller</p>
          <div className="mt-2 space-y-1 text-sm font-semibold leading-relaxed">
            {alerts.slice(0, 2).map((alert) => (
              <p key={alert}>{alert}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
