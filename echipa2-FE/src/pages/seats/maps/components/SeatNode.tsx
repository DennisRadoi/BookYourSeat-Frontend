import { useState, type ReactElement } from "react"
import { cn } from "@/utils"
import type { Seat } from "@/types"
import { Button } from "@/components/ui"

export interface SeatNodeProps {
  seat: Seat
  isSelected?: boolean
  onSelect?: (seat: Seat) => void
  variant?: "square" | "circle" | "sofa"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SeatNode({
  seat,
  isSelected = false,
  onSelect,
  variant = "square",
  size = "md",
  className = "",
}: SeatNodeProps): ReactElement {
  const [showTooltip, setShowTooltip] = useState(false)

  const isOccupied = !seat.isAvailable
  const isAvailable = seat.isAvailable

  function handleClick() {
    if (isAvailable && onSelect) {
      onSelect(seat)
    }
  }

  // Variant Shape styles
  let shapeStyle = "rounded-xl"
  if (variant === "circle") {
    shapeStyle = "rounded-full"
  } else if (variant === "sofa") {
    shapeStyle = "rounded-md"
  }

  // Size styles
  let sizeStyle = "w-10 h-10 sm:w-11 sm:h-11 text-xs sm:text-[13px]"
  if (size === "sm") {
    sizeStyle = "w-9 h-9 sm:w-10 sm:h-10 text-[11px] sm:text-xs"
  } else if (size === "lg") {
    sizeStyle = "w-12 h-12 sm:w-14 sm:h-14 text-xs sm:text-sm"
  } else if (variant === "sofa") {
    sizeStyle = "w-16 sm:w-20 h-14 sm:h-16 text-xs"
  }

  // Status color styles
  let statusStyles = ""
  if (isSelected) {
    statusStyles =
      "bg-[var(--primary)] text-[var(--primary-foreground)] border-2 border-[var(--ring)] shadow-xs scale-105 z-10 font-bold"
  } else if (isOccupied) {
    statusStyles =
      "bg-[var(--destructive)] text-[var(--destructive-foreground)] border border-[var(--destructive)] cursor-not-allowed font-medium opacity-90"
  } else {
    statusStyles =
      "bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--border)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] hover:scale-105 hover:shadow-xs cursor-pointer font-medium"
  }

  return (
    <div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Button
        type="button"
        id={`seat-${seat.code}`}
        disabled={isOccupied}
        onClick={handleClick}
        aria-label={`Locul ${seat.code} - ${isOccupied ? "Ocupat" : isSelected ? "Selectat" : "Disponibil"}`}
        className={cn(
          shapeStyle,
          sizeStyle,
          "flex items-center justify-center tracking-wide transition-all duration-200 select-none p-0",
          statusStyles,
          className,
        )}
      >
        {seat.code}
      </Button>

      {/* Tooltip on hover */}
      {showTooltip && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[var(--foreground)] text-[var(--background)] whitespace-nowrap shadow-md pointer-events-none animate-in fade-in-0 zoom-in-95">
          {isOccupied ? (
            <span>{seat.occupiedBy ? `Ocupat: ${seat.occupiedBy}` : seat.unavailableReason ?? "Nu se poate rezerva"}</span>
          ) : isSelected ? (
            <span>Locul selectat ({seat.code})</span>
          ) : (
            <span>Disponibil ({seat.code})</span>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--foreground)]" />
        </div>
      )}
    </div>
  )
}
