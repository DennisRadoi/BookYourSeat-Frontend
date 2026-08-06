import type { ReactElement } from "react"
import * as Parter from "./parter"
import * as CorpT2 from "./corpt2"
import type { Seat, RoomZoneType, RoomLayoutType } from "@/types"

export interface RoomMapProps {
  roomName: string
  seats: Seat[]
  selectedSeat: Seat | null
  onSeatSelect: (seat: Seat) => void
  searchQuery?: string
  layout?: RoomLayoutType | string
  roomType?: RoomZoneType
  building?: string
  floor?: number
  hasTv?: boolean
  hasWhiteboard?: boolean
  className?: string
}

/**
 * Dispatcher central de hărți exclusiv pentru camerele implementate:
 * 1. Parter (Comun T1 & T2): Stand-Up Desk & Sală de Relaxare
 * 2. Corp T2 - Etaj 1: Birou Open Space & Sala 404
 * 3. Corp T2 - Etaj 2: Sala Birou - Etaj 2
 */
export function RoomMap({
  roomName,
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  layout,
  roomType = "birouri",
  floor = 0,
  hasTv = true,
  hasWhiteboard = true,
  className = "",
}: RoomMapProps): ReactElement {
  const normName = roomName.toLowerCase().trim()

  // ====================================================
  // 🤝 PARTER (Comun T1 & T2)
  // ====================================================
  if (floor === 0 || normName.includes("parter")) {
    if (
      normName.includes("relaxare") ||
      normName.includes("lounge") ||
      roomType === "conferinte" ||
      layout === "relaxare"
    ) {
      return (
        <Parter.ParterRelaxare
          roomName={roomName}
          seats={seats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          searchQuery={searchQuery}
          className={className}
        />
      )
    }

    return (
      <Parter.ParterStandup
        roomName={roomName}
        seats={seats}
        selectedSeat={selectedSeat}
        onSeatSelect={onSeatSelect}
        searchQuery={searchQuery}
        className={className}
      />
    )
  }

  // ====================================================
  // 🏢 CORP T2 - ETAJ 1
  // ====================================================
  if (floor === 1 || normName.includes("etaj 1")) {
    // Sala 404
    if (normName.includes("404") || roomType === "conferinte" || layout === "conference") {
      return (
        <CorpT2.Etaj1_404
          roomName={roomName}
          seats={seats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          searchQuery={searchQuery}
          hasTv={hasTv}
          hasWhiteboard={hasWhiteboard}
          className={className}
        />
      )
    }

    // Birou Open Space (Etaj 1)
    return (
      <CorpT2.Etaj1_Birou
        roomName={roomName}
        seats={seats}
        selectedSeat={selectedSeat}
        onSeatSelect={onSeatSelect}
        searchQuery={searchQuery}
        className={className}
      />
    )
  }

  // ====================================================
  // 🏢 CORP T2 - ETAJ 2: Sala Birou
  // ====================================================
  return (
    <CorpT2.Etaj2_Birou
      roomName={roomName}
      seats={seats}
      selectedSeat={selectedSeat}
      onSeatSelect={onSeatSelect}
      searchQuery={searchQuery}
      hasTv={hasTv}
      className={className}
    />
  )
}
