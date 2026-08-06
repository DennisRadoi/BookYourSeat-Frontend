import type { ReactElement } from "react"
import { SeatNode } from "./SeatNode"
import type { Seat } from "@/types"

export interface DeskPodProps {
  deskNumber: number
  seat1?: Seat
  seat2?: Seat
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  isHighlighted?: (seat: Seat) => boolean
  className?: string
}

/**
 * Reusable 2-Seat Desk Pod for Open Space layouts (D1..D10):
 * Contains Seat 1 (left) + Rounded Desk Surface + Seat 2 (right)
 */
export function DeskPod({
  deskNumber,
  seat1,
  seat2,
  selectedSeat,
  onSeatSelect,
  isHighlighted = () => true,
  className = "",
}: DeskPodProps): ReactElement {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Left Seat */}
      {seat1 && (
        <div
          className={`transition-opacity duration-200 ${
            isHighlighted(seat1) ? "opacity-100" : "opacity-30"
          }`}
        >
          <SeatNode
            seat={seat1}
            isSelected={selectedSeat?.id === seat1.id}
            onSelect={onSeatSelect}
          />
        </div>
      )}

      {/* Desk Surface Node */}
      <div className="w-16 sm:w-20 h-11 sm:h-12 rounded-xl border-2 border-[var(--border)] bg-[var(--muted)]/50 flex flex-col items-center justify-center shadow-2xs">
        <span className="text-[11px] font-bold text-[var(--foreground)] tracking-tight">
          D{deskNumber}
        </span>
        <div className="w-6 h-0.5 bg-[var(--border)] rounded-full mt-0.5" />
      </div>

      {/* Right Seat */}
      {seat2 && (
        <div
          className={`transition-opacity duration-200 ${
            isHighlighted(seat2) ? "opacity-100" : "opacity-30"
          }`}
        >
          <SeatNode
            seat={seat2}
            isSelected={selectedSeat?.id === seat2.id}
            onSelect={onSeatSelect}
          />
        </div>
      )}
    </div>
  )
}
