import { useMemo, type ReactElement } from "react"
import { RoomContainer, SeatNode } from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface Etaj1SideEvenimenteProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta SALA SIDE-EVENIMENTE (Corp T1, Etaj 1 - Birouri)
 * Masă centrală cu 4 locuri (1, 2, 3, 4) și intrarea jos
 */
export function Etaj1SideEvenimente({
  roomName = "Sala Side-Evenimente",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: Etaj1SideEvenimenteProps): ReactElement {
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

  return (
    <RoomContainer
      roomName={roomName}
      availableCount={availableCount}
      occupiedCount={occupiedCount}
      selectedCount={selectedCount}
      entrancePosition="bottom"
      entranceLabel="Intrare"
      minHeight="min-h-[460px] sm:min-h-[500px]"
      className={className}
    >
      {/* Container centrat vertical și orizontal */}
      <div className="flex flex-col items-center justify-center my-auto gap-5">
        {/* Rândul de sus (Locurile 1 și 2) */}
        <div className="flex items-center justify-center gap-12 sm:gap-16">
          {renderSeat("1")}
          {renderSeat("2")}
        </div>

        {/* Masa centrală */}
        <div className="w-64 sm:w-80 h-28 sm:h-32 rounded-2xl bg-[#e6dfcc] dark:bg-[#3f3b33] border-2 border-[#d6cfbb] dark:border-[#524d43] shadow-xs flex flex-col justify-around p-3 select-none">
          <div className="w-full h-px bg-[#d6cfbb]/80 dark:bg-[#524d43]/80" />
          <div className="w-full h-px bg-[#d6cfbb]/80 dark:bg-[#524d43]/80" />
          <div className="w-full h-px bg-[#d6cfbb]/80 dark:bg-[#524d43]/80" />
        </div>

        {/* Rândul de jos (Locurile 3 și 4) */}
        <div className="flex items-center justify-center gap-12 sm:gap-16">
          {renderSeat("3")}
          {renderSeat("4")}
        </div>
      </div>
    </RoomContainer>
  )
}
