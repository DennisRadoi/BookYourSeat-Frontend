import { useMemo, type ReactElement } from "react"
import { RoomContainer, SeatNode } from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface Etaj1LaTerasaProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta SALA LA TERASĂ (Corp T1, Etaj 1 - Săli conferințe)
 * Masă lungă de conferință cu 10 locuri (T1-T4 sus, B1-B4 jos, L1 stânga, R1 dreapta)
 */
export function Etaj1LaTerasa({
  roomName = "Sala La Terasa",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: Etaj1LaTerasaProps): ReactElement {
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

  const topCodes = ["T1", "T2", "T3", "T4"]
  const bottomCodes = ["B1", "B2", "B3", "B4"]

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
      <div className="flex flex-col items-center justify-center my-auto w-full max-w-4xl mx-auto select-none">
        {/* Rândul de sus: T1, T2, T3, T4 */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 pb-4">
          {topCodes.map((code) => (
            <div key={code} className="flex-shrink-0">
              {renderSeat(code)}
            </div>
          ))}
        </div>

        {/* Zona centrală: L1 (stânga) - Masă lungă - R1 (dreapta) */}
        <div className="flex items-center justify-center w-full gap-4 sm:gap-8 my-2">
          <div className="flex-shrink-0">{renderSeat("L1")}</div>

          {/* Suprafața mesei */}
          <div className="flex-1 max-w-[620px] h-32 sm:h-36 rounded-3xl border-2 border-[var(--border)] bg-[var(--muted)]/50 shadow-inner flex items-center justify-center p-4" />

          <div className="flex-shrink-0">{renderSeat("R1")}</div>
        </div>

        {/* Rândul de jos: B1, B2, B3, B4 */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 pt-4">
          {bottomCodes.map((code) => (
            <div key={code} className="flex-shrink-0">
              {renderSeat(code)}
            </div>
          ))}
        </div>
      </div>
    </RoomContainer>
  )
}
