import { useMemo, type ReactElement } from "react"
import { RoomContainer, SeatNode } from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface Etaj2TenisProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta SALA TENIS (Corp T1, Etaj 2 - Săli conferințe)
 * 1 loc pe canapea (S1) + 4 locuri pe laturile mesei centrale (D1..D4)
 */
export function Etaj2Tenis({
  roomName = "Sala Tenis",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: Etaj2TenisProps): ReactElement {
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

  const renderSeat = (code: string, variant: "circle" | "square" = "circle") => {
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
          variant={variant}
          size="md"
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
      <div className="relative w-full max-w-4xl mx-auto my-auto flex flex-col justify-between min-h-[340px] select-none p-4">
        {/* STÂNGA SUS: Canapea cu 1 loc (S1) */}
        <div className="flex flex-col items-center self-start ml-4 sm:ml-8">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] mb-1">
            Canapea
          </span>
          <div className="w-40 sm:w-48 h-20 sm:h-24 rounded-2xl bg-[#dcfce7] dark:bg-[#166534]/30 border-2 border-[#86efac] dark:border-[#166534] flex items-center justify-center shadow-xs">
            {renderSeat("S1", "circle")}
          </div>
        </div>

        {/* CENTRU: Masă cu 4 locuri pe laturi (D1 sus, D2 jos, D3 stânga, D4 dreapta) */}
        <div className="relative flex items-center justify-center self-center my-6">
          {/* Locul de sus (D1) */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
            {renderSeat("D1", "circle")}
          </div>

          {/* Locul din stânga (D3) */}
          <div className="absolute -left-14 top-1/2 -translate-y-1/2 z-10">
            {renderSeat("D3", "circle")}
          </div>

          {/* Masa centrală galbenă */}
          <div className="w-56 sm:w-64 h-28 sm:h-32 rounded-2xl bg-[#fef9c3] dark:bg-[#713f12]/30 border-2 border-[#fde047] dark:border-[#854d0e] flex items-center justify-center shadow-xs">
            <span className="text-xs sm:text-sm font-bold text-[#854d0e] dark:text-[#fef08a]">
              Masă
            </span>
          </div>

          {/* Locul din dreapta (D4) */}
          <div className="absolute -right-14 top-1/2 -translate-y-1/2 z-10">
            {renderSeat("D4", "circle")}
          </div>

          {/* Locul de jos (D2) */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10">
            {renderSeat("D2", "circle")}
          </div>
        </div>
      </div>
    </RoomContainer>
  )
}
