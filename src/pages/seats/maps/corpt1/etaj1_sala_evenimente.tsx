import { useMemo, type ReactElement } from "react"
import { RoomContainer, SeatNode } from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface Etaj1SalaEvenimenteProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta SALA CONFERINȚA / EVENIMENTE (Corp T1, Etaj 1)
 * Scrisă exact în stilul componentei Etaj1_404
 */
export function Etaj1SalaEvenimente({
  roomName = "SALA CONFERINTA",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: Etaj1SalaEvenimenteProps): ReactElement {
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
      entrancePosition="none"
      minHeight="min-h-[520px] sm:min-h-[580px]"
      className={className}
    >
      <div className="flex flex-col lg:flex-row items-stretch justify-between w-full max-w-5xl mx-auto my-auto gap-8 p-2">
        {/* ZONA STÂNGA: Masă U-Shape (T1-T10) */}
        <div className="flex-1 flex flex-col justify-between py-2">
          {/* Rândul de sus: T1, T2, T3 */}
          <div className="flex justify-around items-center px-6">
            {renderSeat("T1")}
            {renderSeat("T2")}
            {renderSeat("T3")}
          </div>

          {/* Structura centrală U-Shape */}
          <div className="flex justify-between items-center gap-4 my-6">
            {/* Coloană Stânga: T4, T5, T6 */}
            <div className="flex flex-col gap-6">
              {renderSeat("T4")}
              {renderSeat("T5")}
              {renderSeat("T6")}
            </div>

            {/* Grafic Mese U-Shape */}
            <div className="flex-1 grid grid-cols-3 gap-2 p-2 bg-[var(--muted)]/50 rounded-2xl border-2 border-[var(--border)] min-h-[160px]">
              <div className="bg-[var(--border)]/60 rounded-xl h-10 col-span-1" />
              <div className="bg-[var(--border)]/60 rounded-xl h-10 col-span-1" />
              <div className="bg-[var(--border)]/60 rounded-xl h-10 col-span-1" />
              <div className="bg-[var(--border)]/60 rounded-xl col-span-1 row-span-2 min-h-[90px]" />
              <div className="col-span-1 row-span-2" />
              <div className="bg-[var(--border)]/60 rounded-xl col-span-1 row-span-2 min-h-[90px]" />
            </div>

            {/* Coloană Dreapta: T7, T8, T9 */}
            <div className="flex flex-col gap-6">
              {renderSeat("T7")}
              {renderSeat("T8")}
              {renderSeat("T9")}
            </div>
          </div>

          {/* Partea de jos: Masă mică + T10 */}
          <div className="flex flex-col items-start pl-12 gap-2">
            <div className="w-24 h-10 bg-[var(--muted)] border-2 border-[var(--border)] rounded-xl" />
            <div className="pl-6">{renderSeat("T10")}</div>
          </div>
        </div>

        {/* SEPARATOR VERTICAL */}
        <div className="hidden lg:block border-r-2 border-dashed border-[var(--border)] my-4" />

        {/* ZONA DREAPTA: Mese Rotunde & Intrare (B1-B6) */}
        <div className="flex-1 flex flex-col justify-between relative pl-0 lg:pl-6 pt-6 lg:pt-0">
          {/* Indicator Intrare */}
          <div className="flex flex-col items-center mb-6">
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold mb-1">
              Intrare
            </span>
            <div className="w-28 h-2 bg-[var(--border)] rounded-full" />
            <div className="w-32 h-6 border-b-2 border-dashed border-[var(--border)] rounded-b-full -mt-2" />
          </div>

          {/* Masa Rotundă 1: B1, B2, B3 */}
          <div className="flex flex-col items-center justify-center gap-2 my-auto">
            <div>{renderSeat("B1")}</div>
            <div className="flex items-center gap-6">
              {renderSeat("B2")}
              <div className="w-16 h-16 rounded-full bg-[var(--muted)] border-2 border-[var(--border)] flex items-center justify-center shadow-inner" />
              {renderSeat("B3")}
            </div>
          </div>

          {/* Masa Rotundă 2: B4, B5, B6 */}
          <div className="flex flex-col items-center justify-center gap-2 my-auto pt-6">
            <div className="self-center ml-12">{renderSeat("B4")}</div>
            <div className="flex items-center gap-6">
              {renderSeat("B5")}
              <div className="w-16 h-16 rounded-full bg-[var(--muted)] border-2 border-[var(--border)] flex items-center justify-center shadow-inner" />
              {renderSeat("B6")}
            </div>
          </div>
        </div>
      </div>
    </RoomContainer>
  )
}
