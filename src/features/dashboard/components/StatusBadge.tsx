import { Badge } from "@/components/ui/badge"
import { cn, getStatusLabel } from "@/utils"
import type { ReservationStatus } from "@/types"

interface StatusBadgeProps {
  status: ReservationStatus | string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    confirmed: "bg-[#d1fae5] text-[#059669] border-0",
    pending: "bg-[#fef3c7] text-[#f59e0b] border-0",
    completed: "bg-[#d1fae5] text-[#059669] border-0",
    cancelled: "bg-[#fee2e2] text-[#ef4444] border-0",
  }

  return (
    <Badge
      className={cn(
        "text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0",
        statusStyles[status] ?? "bg-[#f3f4f6] text-[#1f2937] border-0",
      )}
    >
      {getStatusLabel(status)}
    </Badge>
  )
}
