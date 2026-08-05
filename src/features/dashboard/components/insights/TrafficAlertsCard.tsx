import { AlertTriangle } from "lucide-react"
import { cn } from "@/utils"
import type { TrafficAlert } from "@/types"

interface TrafficAlertsCardProps {
  alerts: TrafficAlert[]
}

export function TrafficAlertsCard({ alerts }: TrafficAlertsCardProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[#e5e7eb] bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">⚠️</span>
          <span className="text-[13px] font-bold text-[#1f2937]">Alerte trafic</span>
        </div>
        <span className="rounded-full border border-[#f59e0b]/30 bg-[#fef3c7] px-2 py-0.5 text-[11px] font-bold text-[#f59e0b]">
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
                ? "border border-[#f59e0b]/30 bg-[#fef3c7]/60"
                : "border border-[#ef4444]/30 bg-[#fee2e2]/60",
            )}
          >
            <AlertTriangle
              size={13}
              className={cn("mt-px flex-shrink-0", alert.type === "warning" ? "text-[#f59e0b]" : "text-[#ef4444]")}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-[#1f2937]">{alert.location}</span>
              <span className="text-[11px] text-[#6b7280]">{alert.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
