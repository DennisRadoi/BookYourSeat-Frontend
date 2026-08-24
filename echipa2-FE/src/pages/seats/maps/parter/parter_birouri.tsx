import { useMemo, type ReactElement } from "react"
import { RoomContainer, SeatNode } from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface ParterBirouriProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta PARTER - BIROURI (Comună pentru Corp T1 & Corp T2)
 * 6 birouri (Desk A - Desk F), fiecare cu câte 2 locuri (total 12 locuri)
 */
export function ParterBirouri({
  roomName = "Sala Birouri - Parter",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: ParterBirouriProps): ReactElement {
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

  // Mini-componentă internă pentru un birou cu 2 scaune
  const renderDeskUnit = (
    deskLabel: string,
    code1: string,
    code2: string,
    isTopRow: boolean
  ) => {
    return (
      <div className="flex flex-col items-center gap-2">
        {/* Scaunele sus dacă e rândul de sus */}
        {isTopRow && (
          <div className="flex items-center gap-3">
            {renderSeat(code1)}
            {renderSeat(code2)}
          </div>
        )}

        {/* Suprafața biroului */}
        <div className="w-40 sm:w-48 h-16 sm:h-20 rounded-2xl border-2 border-[var(--border)] bg-[var(--muted)]/50 shadow-xs flex items-center justify-center select-none">
          <span className="text-xs sm:text-sm font-semibold text-[var(--muted-foreground)] tracking-wide">
            {deskLabel}
          </span>
        </div>

        {/* Scaunele jos dacă e rândul de jos */}
        {!isTopRow && (
          <div className="flex items-center gap-3">
            {renderSeat(code1)}
            {renderSeat(code2)}
          </div>
        )}
      </div>
    )
  }

  return (
    <RoomContainer
      roomName={roomName}
      availableCount={availableCount}
      occupiedCount={occupiedCount}
      selectedCount={selectedCount}
      entrancePosition="none"
      minHeight="min-h-[460px] sm:min-h-[520px]"
      className={className}
    >
      <div className="flex flex-col items-center justify-center my-auto w-full max-w-4xl mx-auto gap-8 py-4">
        {/* Rândul de sus: Desk A, Desk B, Desk C */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 w-full">
          {renderDeskUnit("Desk A", "A1", "A2", true)}
          {renderDeskUnit("Desk B", "B1", "B2", true)}
          {renderDeskUnit("Desk C", "C1", "C2", true)}
        </div>

        {/* Linia despărțitoare subtilă din centru */}
        <div className="w-3/4 max-w-lg h-px bg-[var(--border)]/60 my-1" />

        {/* Rândul de jos: Desk D, Desk E, Desk F */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 w-full">
          {renderDeskUnit("Desk D", "D1", "D2", false)}
          {renderDeskUnit("Desk E", "E1", "E2", false)}
          {renderDeskUnit("Desk F", "F1", "F2", false)}
        </div>
      </div>
    </RoomContainer>
  )
}
