import type { ReactElement } from "react"
import { SeatNode } from "./SeatNode"
import type { Seat } from "@/types"

export interface SofaUnitProps {
  seats: Seat[]
  orientation?: "horizontal" | "vertical"
  label?: string
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  isHighlighted?: (seat: Seat) => boolean
  variant?: "emerald" | "light-green"
  className?: string
}

/**
 * Reusable Sofa Component with seat cushions:
 * Supports horizontal (top) or vertical (side) orientations.
 */
export function SofaUnit({
  seats,
  orientation = "horizontal",
  label = "Canapea",
  selectedSeat,
  onSeatSelect,
  isHighlighted = () => true,
  variant = "light-green",
  className = "",
}: SofaUnitProps): ReactElement {
  if (orientation === "vertical") {
    const isEmerald = variant === "emerald"
    return (
      <div className={`flex items-center ${className}`}>
        <div
          className={`flex flex-col gap-1 p-1 rounded-l-lg border-2 border-r-0 ${
            isEmerald
              ? "bg-[#059669]/20 border-[#059669]/60"
              : "bg-[#bbf7d0]/40 border-[#166534]/40"
          }`}
        >
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`transition-opacity duration-200 ${
                isHighlighted(seat) ? "opacity-100" : "opacity-30"
              }`}
            >
              <SeatNode
                seat={seat}
                variant="sofa"
                isSelected={selectedSeat?.id === seat.id}
                onSelect={onSeatSelect}
              />
            </div>
          ))}
        </div>
        <div
          className={`w-4 h-full min-h-[160px] rounded-r-lg border-2 border-l-0 ${
            isEmerald
              ? "bg-[#059669] border-[#059669]"
              : "bg-[#dcfce7] border-[#166534]/40"
          }`}
        />
      </div>
    )
  }

  // Horizontal Sofa (Top)
  return (
    <div className={`flex flex-col items-center mx-auto max-w-md w-full ${className}`}>
      {label && (
        <div className="w-full h-5 rounded-t-lg bg-[#dcfce7] border-2 border-b-0 border-[#166534]/40 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-[#166534]">{label}</span>
        </div>
      )}
      <div className="grid grid-cols-4 gap-1 p-1 w-full bg-[#bbf7d0]/40 rounded-b-lg border-2 border-t-0 border-[#166534]/40">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`transition-opacity duration-200 ${
              isHighlighted(seat) ? "opacity-100" : "opacity-30"
            }`}
          >
            <SeatNode
              seat={seat}
              variant="sofa"
              isSelected={selectedSeat?.id === seat.id}
              onSelect={onSeatSelect}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
