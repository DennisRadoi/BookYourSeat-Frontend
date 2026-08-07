import { useMemo, type ReactElement } from "react"
import {
  RoomContainer,
  SeatNode,
  TvDisplay,
  WindowMarker,
  useSeatCounts,
} from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface Etaj2_BirouProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  hasTv?: boolean
  className?: string
}

/**
 * Harta SALA BIROU - ETAJ 2 (Corp T2)
 */
export function Etaj2_Birou({
  roomName = "SALA BIROU - ETAJ 2",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  hasTv = true,
  className = "",
}: Etaj2_BirouProps): ReactElement {
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
          key={seat.id}
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
      entrancePosition="top"
      minHeight="min-h-[560px] sm:min-h-[620px]"
      className={className}
    >
      {/* Left Wall TV */}
      {hasTv && (
        <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10">
          <TvDisplay orientation="vertical" />
        </div>
      )}

      {/* Right Wall Windows */}
      <WindowMarker count={3} />

      {/* Main Floor Grid Layout */}
      <div className="grid grid-cols-12 gap-4 my-auto py-4">
        {/* Left Column: Conference Table + Workstations */}
        <div className="col-span-12 md:col-span-8 flex flex-col space-y-6">
          {/* Top-Left: Vertical Conference Table */}
          <div className="flex items-center gap-3 sm:gap-4 pl-4 sm:pl-8">
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {renderSeat("M10")}
              {renderSeat("M9")}
              {renderSeat("M8")}
              {renderSeat("M7")}
              {renderSeat("M6")}
            </div>

            <div className="w-18 sm:w-22 h-64 sm:h-72 rounded-2xl bg-[var(--muted)]/70 border-2 border-[var(--border)] flex items-center justify-center shadow-xs">
              <span className="text-[11px] font-semibold text-[var(--muted-foreground)] tracking-wider -rotate-90 select-none whitespace-nowrap">
                Masă Conferință
              </span>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              {renderSeat("M1")}
              {renderSeat("M2")}
              {renderSeat("M3")}
              {renderSeat("M4")}
              {renderSeat("M5")}
            </div>
          </div>

          {/* Bottom-Left: Double Workstations (W1..W10) */}
          <div className="flex flex-col items-center sm:items-start pl-3 sm:pl-10 space-y-2 pt-2">
            <div className="flex items-center gap-2 sm:gap-3.5">
              {renderSeat("W1")}
              {renderSeat("W2")}
              {renderSeat("W3")}
              {renderSeat("W4")}
              {renderSeat("W5")}
            </div>

            <div className="rounded-xl border-2 border-[var(--border)] bg-[var(--muted)]/50 p-1 shadow-2xs">
              <div className="grid grid-cols-5 gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`desk-top-${i}`}
                    className="w-9 sm:w-11 h-6 sm:h-7 rounded-sm border border-[var(--border)] bg-[var(--card)]"
                  />
                ))}
              </div>
              <div className="grid grid-cols-5 gap-1">
                <div className="w-9 sm:w-11 h-6 sm:h-7 rounded-sm border border-[var(--border)] bg-[var(--card)]" />
                <div className="w-9 sm:w-11 h-6 sm:h-7 rounded-sm border border-[var(--border)] bg-[var(--card)]" />
                <div className="w-9 sm:w-11 h-6 sm:h-7 rounded-sm border border-[var(--border)] bg-[var(--card)] flex items-center justify-center">
                  <span className="text-[9px] font-semibold text-[var(--muted-foreground)]">
                    Birouri
                  </span>
                </div>
                <div className="w-9 sm:w-11 h-6 sm:h-7 rounded-sm border border-[var(--border)] bg-[var(--card)]" />
                <div className="w-9 sm:w-11 h-6 sm:h-7 rounded-sm border border-[var(--border)] bg-[var(--card)]" />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3.5">
              {renderSeat("W6")}
              {renderSeat("W7")}
              {renderSeat("W8")}
              {renderSeat("W9")}
              {renderSeat("W10")}
            </div>
          </div>
        </div>

        {/* Right Column: Small Table + Lounge Fotolii */}
        <div className="col-span-12 md:col-span-4 flex flex-col justify-between items-end pr-4 sm:pr-8 py-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex flex-col gap-2.5">
              {renderSeat("S1")}
              {renderSeat("S2")}
            </div>
            <div className="w-10 sm:w-12 h-20 sm:h-24 rounded-xl bg-[var(--muted)]/70 border-2 border-[var(--border)] flex items-center justify-center shadow-xs">
              <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">
                Masă
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-12 sm:mt-0">
            <span className="text-[11px] font-medium text-[var(--muted-foreground)]">
              Fotolii
            </span>
            <div className="flex flex-col gap-2.5">
              {renderSeat("L1")}
              {renderSeat("L2")}
            </div>
          </div>
        </div>
      </div>
    </RoomContainer>
  )
}
