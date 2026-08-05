import { Badge } from "@/components/ui/badge"
import { cn, getStatusLabel } from "@/utils"
import type { ReservationStatus } from "@/types"

interface StatusBadgeProps {
  status: ReservationStatus | string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    confirmed: "bg-[var(--secondary)] text-[var(--secondary-foreground)] border-0",
    pending: "bg-[var(--warning)]/15 text-[var(--warning)] border-0",
    completed: "bg-[var(--secondary)] text-[var(--secondary-foreground)] border-0",
    cancelled: "bg-[var(--destructive)]/15 text-[var(--destructive)] border-0",
  }

  return (
    <Badge
      className={cn(
        "text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0",
        statusStyles[status] ?? "bg-[var(--muted)] text-[var(--foreground)] border-0",
      )}
    >
      {getStatusLabel(status)}
    </Badge>
  )
}
