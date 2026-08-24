import { useMemo, type ReactElement } from "react"
import {
  RoomContainer,
  SeatNode,
  TvDisplay,
  WhiteboardMarker,
  useSeatCounts,
} from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface Etaj1_404Props {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  hasTv?: boolean
  hasWhiteboard?: boolean
  className?: string
}

/**
 * Harta SALA 404 (Corp T2 - Etaj 1)
 */
export function Etaj1_404({
  roomName = "SALA 404",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  hasTv = true,
  hasWhiteboard = true,
  className = "",
}: Etaj1_404Props): ReactElement {
  const seatMap = useMemo(() => {
    const map = new Map<string, Seat>()
    seats.forEach((s) => map.set(s.code, s))
    return map
  }, [seats])

  const { availableCount, occupiedCount, selectedCount } = useSeatCounts(seats, selectedSeat)

  const isHighlighted = (seat: Seat) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      seat.code.toLowerCase().includes(q) ||
      Boolean(seat.occupiedBy && seat.occupiedBy.toLowerCase().includes(q))
    )
  }

  const renderSeat = (code: string) => {
    const seat = seatMap.get(code)
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

  const rowACodes = ["A1", "A2", "A3", "A4", "A5"]
  const rowBCodes = ["B1", "B2", "B3", "B4", "B5"]

  return (
    <RoomContainer
      roomName={roomName}
      availableCount={availableCount}
      occupiedCount={occupiedCount}
      selectedCount={selectedCount}
      entrancePosition="none"
      minHeight="min-h-[460px] sm:min-h-[500px]"
      className={className}
    >
      {/* Top Row Seats (A1..A5) */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 pt-2">
        {rowACodes.map((code) => (
          <div key={code} className="flex-shrink-0">
            {renderSeat(code)}
          </div>
        ))}
      </div>

      {/* Center Arena: Left TV, Left Seat C1, Central Conference Table, Right Seat C2, Right Whiteboard */}
      <div className="flex items-center justify-center w-full max-w-4xl gap-4 sm:gap-7 my-6">
        {hasTv && <TvDisplay orientation="vertical" />}

        <div className="flex-shrink-0">{renderSeat("C1")}</div>

        <div className="flex-1 max-w-[480px] h-32 sm:h-36 rounded-3xl border-2 border-[var(--border)] bg-[var(--muted)]/60 shadow-inner flex items-center justify-center p-4">
          <div className="w-16 h-1 rounded-full bg-[var(--border)] opacity-60" />
        </div>

        <div className="flex-shrink-0">{renderSeat("C2")}</div>

        {hasWhiteboard && <WhiteboardMarker />}
      </div>

      {/* Bottom Row Seats (B1..B5) */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 pb-2">
        {rowBCodes.map((code) => (
          <div key={code} className="flex-shrink-0">
            {renderSeat(code)}
          </div>
        ))}
      </div>
    </RoomContainer>
  )
}
