import { AlertTriangle } from "lucide-react"
import { cn } from "@/utils"
import type { TrafficAlert } from "@/types"

interface TrafficAlertsCardProps {
  alerts: TrafficAlert[]
}

export function TrafficAlertsCard({ alerts }: TrafficAlertsCardProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">⚠️</span>
          <span className="text-[13px] font-bold text-[var(--foreground)]">Alerte trafic</span>
        </div>
        <span className="rounded-full border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--warning)]">
          {alerts.length} alerte
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-2 rounded-lg p-2.5",
              alert.type === "warning"
                ? "border border-[var(--warning)]/30 bg-[var(--warning)]/10"
                : "border border-[var(--destructive)]/30 bg-[var(--destructive)]/10",
            )}
          >
            <AlertTriangle
              size={13}
              className={cn(
                "mt-px flex-shrink-0",
                alert.type === "warning" ? "text-[var(--warning)]" : "text-[var(--destructive)]",
              )}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-[var(--foreground)]">{alert.location}</span>
              <span className="text-[11px] text-[var(--muted-foreground)]">{alert.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
