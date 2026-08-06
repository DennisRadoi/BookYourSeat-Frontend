import type { ReactElement } from "react"
import { SeatNode } from "./SeatNode"
import type { Seat } from "@/types"

export interface StandupTableUnitProps {
  tableName: string
  topSeat?: Seat
  bottomSeat?: Seat
  leftSeat?: Seat
  rightSeat?: Seat
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  isHighlighted?: (seat: Seat) => boolean
  className?: string
}

/**
 * Reusable Stand-Up Table Unit with 4 round circular seats:
 * Top, Bottom, Left, Right around a rounded central table.
 */
export function StandupTableUnit({
  tableName,
  topSeat,
  bottomSeat,
  leftSeat,
  rightSeat,
  selectedSeat,
  onSeatSelect,
  isHighlighted = () => true,
  className = "",
}: StandupTableUnitProps): ReactElement {
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
          variant="circle"
          size="lg"
          isSelected={selectedSeat?.id === seat.id}
          onSelect={onSeatSelect}
        />
      </div>
    )
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Top Seat */}
      {topSeat && (
        <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 z-10">
          {renderSeat(topSeat)}
        </div>
      )}

      {/* Left Seat */}
      {leftSeat && (
        <div className="absolute -left-7 sm:-left-8 top-1/2 -translate-y-1/2 z-10">
          {renderSeat(leftSeat)}
        </div>
      )}

      {/* Central Desk Surface */}
      <div className="w-44 sm:w-56 h-28 sm:h-32 rounded-2xl bg-[#f5efe6] dark:bg-[#292524] border-2 border-[#e7e0d8] dark:border-[#44403c] flex items-center justify-center shadow-xs">
        <span className="text-xs font-semibold text-[#78716c] dark:text-[#a8a29e] select-none">
          {tableName}
        </span>
      </div>

      {/* Right Seat */}
      {rightSeat && (
        <div className="absolute -right-7 sm:-right-8 top-1/2 -translate-y-1/2 z-10">
          {renderSeat(rightSeat)}
        </div>
      )}

      {/* Bottom Seat */}
      {bottomSeat && (
        <div className="absolute -bottom-7 sm:-bottom-8 left-1/2 -translate-x-1/2 z-10">
          {renderSeat(bottomSeat)}
        </div>
      )}
    </div>
  )
}
