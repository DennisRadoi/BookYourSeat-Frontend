import type { ReactElement } from "react"
import { SeatNode } from "./SeatNode"
import type { Seat } from "@/types"

export interface ConferenceTableUnitProps {
  label?: string
  topSeats?: Seat[]
  bottomSeats?: Seat[]
  leftSeat?: Seat
  rightSeat?: Seat
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  isHighlighted?: (seat: Seat) => boolean
  className?: string
}

/**
 * Reusable Conference Table Unit with top/bottom/left/right seats
 */
export function ConferenceTableUnit({
  label = "Masă Conferință",
  topSeats = [],
  bottomSeats = [],
  leftSeat,
  rightSeat,
  selectedSeat,
  onSeatSelect,
  isHighlighted = () => true,
  className = "",
}: ConferenceTableUnitProps): ReactElement {
  const renderSeat = (seat?: Seat) => {
    if (!seat) return null
    return (
      <div
        className={`transition-opacity duration-200 ${
          isHighlighted(seat) ? "opacity-100" : "opacity-30"
        }`}
      >
        <SeatNode
          seat={seat}
          isSelected={selectedSeat?.id === seat.id}
          onSelect={onSeatSelect}
        />
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Top Seats */}
      {topSeats.length > 0 && (
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {topSeats.map((seat) => (
            <div key={seat.id} className="flex-shrink-0">
              {renderSeat(seat)}
            </div>
          ))}
        </div>
      )}

      {/* Middle Row: Left Seat + Table + Right Seat */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
        {leftSeat && <div className="flex-shrink-0">{renderSeat(leftSeat)}</div>}

        <div className="flex-1 max-w-[480px] h-32 sm:h-36 rounded-3xl border-2 border-[var(--border)] bg-[var(--muted)]/60 shadow-inner flex items-center justify-center p-4">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] tracking-wide">
            {label}
          </span>
        </div>

        {rightSeat && <div className="flex-shrink-0">{renderSeat(rightSeat)}</div>}
      </div>

      {/* Bottom Seats */}
      {bottomSeats.length > 0 && (
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {bottomSeats.map((seat) => (
            <div key={seat.id} className="flex-shrink-0">
              {renderSeat(seat)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
