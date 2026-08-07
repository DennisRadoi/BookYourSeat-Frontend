import { useMemo, type ReactElement } from "react"
import { RoomContainer, SeatNode } from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface Etaj2GamingProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta SALA GAMING (Corp T1, Etaj 2 - Săli conferințe)
 * 3 mese de gaming (Desk A, B, C) x 4 locuri rotunde = 12 locuri + elemente decorative (Bean bags, Ping Pong, Pool Table)
 */
export function Etaj2Gaming({
  roomName = "Sala Gaming",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: Etaj2GamingProps): ReactElement {
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
          variant="circle"
          size="md"
          isSelected={selectedSeat?.id === seat.id}
          onSelect={onSeatSelect}
        />
      </div>
    )
  }

  // Sub-componentă pentru o masă de Gaming (Desk A, B, C) cu 4 scaune rotunde (1, 2 sus | 3, 4 jos)
  const renderGamingDesk = (
    deskLabel: string,
    c1: string,
    c2: string,
    c3: string,
    c4: string
  ) => {
    return (
      <div className="flex flex-col items-center gap-2">
        {/* Rândul de sus (Scaunele 1 și 2) */}
        <div className="flex items-center gap-4">
          {renderSeat(c1)}
          {renderSeat(c2)}
        </div>

        {/* Masa de Gaming din lemn */}
        <div className="relative w-40 sm:w-48 h-20 sm:h-24 rounded-2xl bg-[#c29b61] dark:bg-[#856538] border-2 border-[#a68048] dark:border-[#6b502a] shadow-md flex items-center justify-center select-none">
          {/* Niturile decorative de colț */}
          <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-xs bg-[#6b502a]/60 dark:bg-[#3d2b13]" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-xs bg-[#6b502a]/60 dark:bg-[#3d2b13]" />
          <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-xs bg-[#6b502a]/60 dark:bg-[#3d2b13]" />
          <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-xs bg-[#6b502a]/60 dark:bg-[#3d2b13]" />

          <span className="text-xs sm:text-sm font-bold text-[#4a3518] dark:text-[#f3e5ce] tracking-wide">
            {deskLabel}
          </span>
        </div>

        {/* Rândul de jos (Scaunele 3 și 4) */}
        <div className="flex items-center gap-4">
          {renderSeat(c3)}
          {renderSeat(c4)}
        </div>
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
      <div className="relative w-full max-w-5xl mx-auto flex flex-col justify-between my-auto gap-8 py-4 select-none">
        {/* DECOR SUPERIOR: Bean bags (Pufuri de relaxare) */}
        <div className="flex justify-center items-center -mb-2">
          <div className="relative flex items-center justify-center bg-[#60a5fa] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-sm border-2 border-[#3b82f6]">
            <span className="absolute -left-3 top-1 w-6 h-6 bg-[#93c5fd] rounded-full -z-10" />
            <span className="absolute -right-3 top-1 w-6 h-6 bg-[#38bdf8] rounded-full -z-10" />
            Bean bags
          </div>
        </div>

        {/* MESELE DE JOC: Desk A, Desk B, Desk C */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 w-full z-10">
          {renderGamingDesk("Desk A", "A1", "A2", "A3", "A4")}
          {renderGamingDesk("Desk B", "B1", "B2", "B3", "B4")}
          {renderGamingDesk("Desk C", "C1", "C2", "C3", "C4")}
        </div>

        {/* DECOR INFERIOR: Ping Pong (Stânga) + Pool Table (Dreapta) */}
        <div className="flex flex-wrap items-center justify-between gap-6 px-4 sm:px-10 pt-4">
          {/* Masă Ping Pong */}
          <div className="w-48 sm:w-56 h-28 sm:h-32 rounded-2xl bg-[#1d4ed8] border-2 border-[#2563eb] shadow-md flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/40 border-t border-dashed border-white/60" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-white/80 shadow-xs" />
            <span className="text-xs font-bold text-white tracking-wider z-10 bg-[#1d4ed8]/80 px-2 py-0.5 rounded-md">
              Ping Pong
            </span>
          </div>

          {/* Masă Biliard (Pool Table) */}
          <div className="relative w-56 sm:w-64 h-32 sm:h-36 rounded-2xl bg-[#1e40af] border-4 border-[#1e3a8a] shadow-lg flex items-center justify-center">
            {/* Buzunare de colț */}
            <span className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#0f172a]" />
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#0f172a]" />
            <span className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[#0f172a]" />
            <span className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-[#0f172a]" />
            {/* Buzunare de mijloc */}
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0f172a]" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0f172a]" />
            {/* Bila albă */}
            <span className="absolute top-1/2 left-1/3 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-xs" />

            <span className="text-xs font-bold text-white/90 tracking-wider">
              Pool Table
            </span>
          </div>
        </div>
      </div>
    </RoomContainer>
  )
}
