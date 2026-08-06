import type { ReactElement } from "react"

interface SeatLegendProps {
  availableCount: number
  occupiedCount: number
  selectedCount: number
  className?: string
}

export function SeatLegend({
  availableCount,
  occupiedCount,
  selectedCount,
  className = "",
}: SeatLegendProps): ReactElement {
  return (
    <div className={`flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[var(--muted-foreground)] font-medium select-none ${className}`}>
      {/* Disponibil */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] border border-[var(--accent-foreground)] inline-block" />
        <span>Disponibil ({availableCount})</span>
      </div>

      {/* Ocupat */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--destructive)] inline-block" />
        <span>Ocupat ({occupiedCount})</span>
      </div>

      {/* Selectat */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] inline-block" />
        <span>Selectat ({selectedCount})</span>
      </div>
    </div>
  )
}
