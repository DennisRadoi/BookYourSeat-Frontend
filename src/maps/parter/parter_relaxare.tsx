import { useMemo, type ReactElement } from "react"
import {
  RoomContainer,
  SeatNode,
  SofaUnit,
  CoffeeTableUnit,
} from "@/components/seats"
import type { Seat } from "@/types"

export interface ParterRelaxareProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta SALĂ DE RELAXARE (Parter Comun T1 & T2)
 */
export function ParterRelaxare({
  roomName = "SALĂ DE RELAXARE",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: ParterRelaxareProps): ReactElement {
  const seatMap = useMemo(() => {
    const map = new Map<string, Seat>()
    seats.forEach((s) => map.set(s.code, s))
    return map
  }, [seats])

  const topSofaSeats = useMemo(() => {
    return ["C1", "C2", "C3", "C4"]
      .map((c) => seatMap.get(c))
      .filter((s): s is Seat => Boolean(s))
  }, [seatMap])

  const sideSofaSeats = useMemo(() => {
    return ["S1", "S2", "S3"]
      .map((c) => seatMap.get(c))
      .filter((s): s is Seat => Boolean(s))
  }, [seatMap])

  const { availableCount, occupiedCount, selectedCount } = useMemo(() => {
    let available = 0
    let occupied = 0
    let selected = 0

    seats.forEach((s) => {
      if (selectedSeat && selectedSeat.id === s.id) {
        selected++
      } else if (s.isAvailable) {
        available++
      } else {
        occupied++
      }
    })

    return {
      availableCount: available,
      occupiedCount: occupied,
      selectedCount: selected,
    }
  }, [seats, selectedSeat])

  const isHighlighted = (seat: Seat) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      seat.code.toLowerCase().includes(q) ||
      Boolean(seat.occupiedBy && seat.occupiedBy.toLowerCase().includes(q))
    )
  }

  const renderSingleSeat = (code: string) => {
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

  return (
    <RoomContainer
      roomName={roomName}
      availableCount={availableCount}
      occupiedCount={occupiedCount}
      selectedCount={selectedCount}
      entrancePosition="bottom"
      minHeight="min-h-[560px] sm:min-h-[620px]"
      className={className}
    >
      {/* Top 4-Seater Canapea */}
      <SofaUnit
        seats={topSofaSeats}
        orientation="horizontal"
        label="Canapea"
        selectedSeat={selectedSeat}
        onSeatSelect={onSeatSelect}
        isHighlighted={isHighlighted}
      />

      {/* Central Arena */}
      <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto my-auto py-4">
        {/* Left Individual Seats: A1 & A2 */}
        <div className="flex flex-col gap-16 pl-4 sm:pl-8">
          <div>{renderSingleSeat("A1")}</div>
          <div>{renderSingleSeat("A2")}</div>
        </div>

        {/* Center Tables */}
        <div className="flex items-center gap-4 sm:gap-6">
          <CoffeeTableUnit size="md" />
          <CoffeeTableUnit label="Măsuță" size="sm" />
        </div>

        {/* Right 3-Seater Canapea */}
        <div className="pr-2 sm:pr-4">
          <SofaUnit
            seats={sideSofaSeats}
            orientation="vertical"
            variant="emerald"
            selectedSeat={selectedSeat}
            onSeatSelect={onSeatSelect}
            isHighlighted={isHighlighted}
          />
        </div>
      </div>

      {/* Bottom Area: Seat A3 */}
      <div className="relative w-full flex items-center justify-center pb-4">
        <div className="absolute right-1/3 -top-10">
          {renderSingleSeat("A3")}
        </div>
      </div>
    </RoomContainer>
  )
}
