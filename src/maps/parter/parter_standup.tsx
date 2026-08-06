import { useMemo, type ReactElement } from "react"
import { RoomContainer, StandupTableUnit } from "@/components/seats"
import type { Seat } from "@/types"

export interface ParterStandupProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta STAND-UP DESK (Parter Comun T1 & T2)
 */
export function ParterStandup({
  roomName = "STAND-UP DESK",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: ParterStandupProps): ReactElement {
  const seatMap = useMemo(() => {
    const map = new Map<string, Seat>()
    seats.forEach((s) => map.set(s.code, s))
    return map
  }, [seats])

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
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 sm:gap-20 my-auto py-6">
        {/* Table 1: Masă 1 (L1..L4) */}
        <StandupTableUnit
          tableName="Masă 1"
          topSeat={seatMap.get("L1")}
          bottomSeat={seatMap.get("L2")}
          leftSeat={seatMap.get("L3")}
          rightSeat={seatMap.get("L4")}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          isHighlighted={isHighlighted}
        />

        {/* Table 2: Masă 2 (R1..R4) */}
        <StandupTableUnit
          tableName="Masă 2"
          topSeat={seatMap.get("R1")}
          bottomSeat={seatMap.get("R2")}
          leftSeat={seatMap.get("R3")}
          rightSeat={seatMap.get("R4")}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          isHighlighted={isHighlighted}
        />
      </div>
    </RoomContainer>
  )
}
