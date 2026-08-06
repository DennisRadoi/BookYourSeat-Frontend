import type { ReactElement } from "react"
import * as Parter from "./parter"
import * as CorpT1 from "./corpt1"
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

export function RoomMap({
  roomName,
  seats,
  selectedSeat,
  onSeatSelect,
  searchQuery = "",
  layout,
  roomType = "birouri",
  building = "",
  floor = 0,
  hasTv = true,
  hasWhiteboard = true,
  className = "",
}: RoomMapProps): ReactElement {
  // Funcție utilitară care elimină diacriticele și transformă textul în minuscule
  const clean = (str = "") =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()

  const cleanBuilding = clean(building)
  const cleanName = clean(roomName)
  const currentFloorNum = Number(floor) || 0

  // =========================================================================
  // 1. PARTER COMUN (Corp T1 & Corp T2 - Etajul 0)
  // =========================================================================
  if (currentFloorNum === 0 || cleanName.includes("parter")) {
    // 1. Sală de relaxare / conferințe
    if (
      cleanName.includes("relaxare") ||
      cleanName.includes("lounge") ||
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

    // 2. Stand-Up Desk
    if (cleanName.includes("standup") || cleanName.includes("stand-up") || layout === "standup") {
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

    // 3. Sala de birouri clasice (Desk A - Desk F)
    return (
      <Parter.ParterBirouri
        roomName={roomName}
        seats={seats}
        selectedSeat={selectedSeat}
        onSeatSelect={onSeatSelect}
        searchQuery={searchQuery}
        className={className}
      />
    )
  }

  // Identificăm dacă suntem pe clădirea T1
  const isBuildingT1 = cleanBuilding.includes("t1") || cleanName.includes("t1")

  // =========================================================================
  // 2. CORP T1 - ETAJ 1 (Săli: Side-Evenimente, La Terasă, Evenimente)
  // =========================================================================
  if (isBuildingT1 && currentFloorNum === 1) {
    // 1. Sala Side-Evenimente
    if (cleanName.includes("side")) {
      return (
        <CorpT1.Etaj1SideEvenimente
          roomName={roomName}
          seats={seats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          searchQuery={searchQuery}
          className={className}
        />
      )
    }

    // 2. Sala La Terasă
    if (cleanName.includes("teras")) {
      return (
        <CorpT1.Etaj1LaTerasa
          roomName={roomName}
          seats={seats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          searchQuery={searchQuery}
          className={className}
        />
      )
    }

    // 3. Sala Evenimente / Conferință (Fallback implicit Etaj 1)
    return (
      <CorpT1.Etaj1SalaEvenimente
        roomName={roomName}
        seats={seats}
        selectedSeat={selectedSeat}
        onSeatSelect={onSeatSelect}
        searchQuery={searchQuery}
        className={className}
      />
    )
  }

  // =========================================================================
  // 👇 3. CORP T1 - ETAJ 2 (Sala Gaming) 👇 NOU ADĂUGAT AICI
  // =========================================================================
  if (isBuildingT1 && currentFloorNum === 2) {
    // 1. Sala Tenis 
    if (cleanName.includes("tenis")) {
      return (
        <CorpT1.Etaj2Tenis
          roomName={roomName}
          seats={seats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          searchQuery={searchQuery}
          className={className}
        />
      )
    }

    // 2. Sala Gaming (Fallback implicit pentru Etajul 2 - T1)
    return (
      <CorpT1.Etaj2Gaming
        roomName={roomName}
        seats={seats}
        selectedSeat={selectedSeat}
        onSeatSelect={onSeatSelect}
        searchQuery={searchQuery}
        className={className}
      />
    )
  }
  // =========================================================================
  // 👆 PÂNĂ AICI ESTE SECȚIUNEA NOUĂ PENTRU GAMING 👆
  // =========================================================================

  // =========================================================================
  // 4. CORP T2 - ETAJ 1 (Sala 404 sau Birou Open Space)
  // =========================================================================
  if (currentFloorNum === 1 || cleanName.includes("etaj 1")) {
    if (cleanName.includes("404") || roomType === "conferinte" || layout === "conference") {
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

  // =========================================================================
  // 5. CORP T2 - ETAJ 2 (Birouri)
  // =========================================================================
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