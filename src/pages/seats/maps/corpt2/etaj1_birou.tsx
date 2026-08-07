import { useMemo, type ReactElement } from "react"
import { RoomContainer, DeskPod, useSeatCounts } from "@/pages/seats/maps/components"
import type { Seat } from "@/types"

export interface Etaj1_BirouProps {
  roomName?: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  className?: string
}

/**
 * Harta BIROU OPEN SPACE (Corp T2 - Etaj 1)
 */
export function Etaj1_Birou({
  roomName = "BIROU OPEN SPACE",
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  className = "",
}: Etaj1_BirouProps): ReactElement {
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

  const leftColumnDesks = [1, 2, 3, 4, 5]
  const rightColumnDesks = [6, 7, 8, 9, 10]

  return (
    <RoomContainer
      roomName={roomName}
      availableCount={availableCount}
      occupiedCount={occupiedCount}
      selectedCount={selectedCount}
      entrancePosition="top"
      minHeight="min-h-[580px] sm:min-h-[640px]"
      className={className}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 sm:gap-x-20 gap-y-6 sm:gap-y-7 max-w-4xl mx-auto my-auto py-8">
        {/* Left Column: D1 to D5 */}
        <div className="flex flex-col gap-5 sm:gap-6 items-center">
          {leftColumnDesks.map((d) => (
            <DeskPod
              key={`desk-${d}`}
              deskNumber={d}
              seat1={seatMap.get(`D${d}-1`)}
              seat2={seatMap.get(`D${d}-2`)}
              selectedSeat={selectedSeat}
              onSeatSelect={onSeatSelect}
              isHighlighted={isHighlighted}
            />
          ))}
        </div>

        {/* Right Column: D6 to D10 */}
        <div className="flex flex-col gap-5 sm:gap-6 items-center">
          {rightColumnDesks.map((d) => (
            <DeskPod
              key={`desk-${d}`}
              deskNumber={d}
              seat1={seatMap.get(`D${d}-1`)}
              seat2={seatMap.get(`D${d}-2`)}
              selectedSeat={selectedSeat}
              onSeatSelect={onSeatSelect}
              isHighlighted={isHighlighted}
            />
          ))}
        </div>
      </div>
    </RoomContainer>
  )
}
