import { locations as mockLocations } from "@/data"
import { apiClient } from "./apiClient"
import type { Location, Floor, Room, Seat } from "@/types"

// ─── Location Service ─────────────────────────────────────────────────────────
// Layout-ul vizual (coduri locuri, grupuri, rânduri) vine din mock-ul FE.
// Disponibilitatea (isAvailable) vine din BE prin GET /seats sau GET /bookings.
//
// ID-urile locurilor în FE (1000, 2000 etc.) TREBUIE să corespundă
// cu ID-urile din baza de date BE (seed_database.sql).

interface BeSeatResponse {
  id: number
  roomId: number | null
  status: string | null
  xPosition: number | null
  yPosition: number | null
  hasMonitor: boolean | null
  hasDockingStation: boolean | null
  nearWindow: boolean | null
  hasStandupDesk: boolean | null
}

function isSeatAvailable(status: string | null): boolean {
  if (!status) return true
  const s = status.toUpperCase()
  return s === "REZERVABIL" || s === "AVAILABLE" || s === "DISPONIBIL"
}

function getSeatPositionKey(roomId: number, code: string): string {
  let x = 0
  let y = 0

  if (roomId === 100 || roomId === 200) {
    const letter = code[0]
    x = letter.charCodeAt(0) - 64
    y = parseInt(code.substring(1)) || 1
  } else if (roomId === 101 || roomId === 201) {
    const letter = code[0]
    x = letter === "L" ? 1 : 2
    y = parseInt(code.substring(1)) || 1
  } else if (roomId === 102 || roomId === 202) {
    const letter = code[0]
    x = letter === "A" ? 1 : letter === "C" ? 2 : 3
    y = parseInt(code.substring(1)) || 1
  } else if (roomId === 210) {
    const parts = code.substring(1).split("-")
    x = parseInt(parts[0]) || 1
    y = parseInt(parts[1]) || 1
  } else if (roomId === 211 || roomId === 103) {
    const letter = code[0]
    if (letter === "A" || letter === "T") {
      x = parseInt(code.substring(1)) || 1
      y = 1
    } else if (letter === "B") {
      x = parseInt(code.substring(1)) || 1
      y = 2
    } else if (code === "C1" || code === "L1") {
      x = 0
      y = 3
    } else if (code === "C2" || code === "R1") {
      x = 6
      y = 3
    } else {
      x = parseInt(code) || 1
      y = 1
    }
  } else if (roomId === 220) {
    const letter = code[0]
    x = parseInt(code.substring(1)) || 1
    y = letter === "M" ? 1 : letter === "W" ? 2 : letter === "S" ? 3 : 4
  } else if (roomId === 104) {
    x = parseInt(code) || 1
    y = 1
  } else if (roomId === 105) {
    const letter = code[0]
    if (letter === "T") {
      x = parseInt(code.substring(1)) || 1
      y = 1
    } else if (code === "L1") {
      x = 0
      y = 2
    } else if (code === "R1") {
      x = 5
      y = 2
    } else if (letter === "B") {
      x = parseInt(code.substring(1)) || 1
      y = 3
    }
  } else if (roomId === 106) {
    const letter = code[0]
    x = parseInt(code.substring(1)) || 1
    y = letter === "A" ? 1 : letter === "B" ? 2 : 3
  } else if (roomId === 107) {
    if (code === "S1") {
      x = 1
      y = 1
    } else {
      x = (parseInt(code.substring(1)) || 1) + 1
      y = 1
    }
  } else {
    x = parseInt(code.replace(/\D/g, "")) || 1
    y = 1
  }

  return `${roomId}_${x}_${y}`
}

const BE_TO_MOCK_ROOM_ID: Record<number, number> = {
  1: 100, // Birouri Parter T1
  2: 101, // Stand-Up Desk T1
  3: 102, // Sală de Relaxare T1
  4: 103, // Sală Evenimente T1
  5: 104, // Side Evenimente T1
  6: 105, // La Terasă T1
  7: 106, // Sala Gaming T1
  8: 107, // Sala Tenis T1
  9: 200, // Birouri Parter T2
  10: 201, // Stand-Up Desk T2
  11: 202, // Sală de Relaxare T2
  12: 210, // Birou Open Space T2
  13: 211, // 404 T2
  14: 220, // Sala Birou - Etaj 2 T2
}

/**
 * Aplică statusul de disponibilitate din BE peste locurile din mock.
 * Maparea se face pe bază de (roomId, xPosition, yPosition).
 * Se actualizează ID-ul locului cu cel real din DB.
 */
function applyAvailability(mockSeats: Seat[], beSeats: BeSeatResponse[], roomId: number): Seat[] {
  const beMap = new Map<string, BeSeatResponse>()
  for (const s of beSeats) {
    if (s.roomId) {
      const mockRoomId = BE_TO_MOCK_ROOM_ID[s.roomId] || s.roomId
      const key = `${mockRoomId}_${s.xPosition}_${s.yPosition}`
      beMap.set(key, s)
    }
  }

  return mockSeats.map((seat) => {
    const key = getSeatPositionKey(roomId, seat.code)
    const be = beMap.get(key)
    
    if (!be) {
      // Fallback la ID direct în caz că nu s-a putut mapa după x/y
      const beFallback = beSeats.find((s) => s.id === seat.id)
      if (beFallback) {
        const isAvailable = isSeatAvailable(beFallback.status)
        return {
          ...seat,
          id: beFallback.id,
          isAvailable,
          occupiedBy: isAvailable ? undefined : seat.occupiedBy || "Coleg",
        }
      }
      return seat
    }

    const isAvailable = isSeatAvailable(be.status)
    return {
      ...seat,
      id: be.id, // Folosim ID-ul real din DB!
      isAvailable,
      occupiedBy: isAvailable ? undefined : seat.occupiedBy || "Coleg",
    }
  })
}

// ─── API ───────────────────────────────────────────────────────────────────────

export async function getLocations(params?: {
  date?: string
  startTime?: string
  endTime?: string
}): Promise<Location[]> {
  // Încercăm să luăm statusul locurilor din BE
  let beSeats: BeSeatResponse[] = []
  try {
    const query = new URLSearchParams()
    if (params?.date) query.set("date", params.date)
    if (params?.startTime) {
      const t = params.startTime
      query.set("startTime", t.length === 5 ? `${t}:00` : t)
    }
    if (params?.endTime) {
      const t = params.endTime
      query.set("endTime", t.length === 5 ? `${t}:00` : t)
    }
    
    const queryString = query.toString()
    beSeats = await apiClient.get<BeSeatResponse[]>(`/seats${queryString ? `?${queryString}` : ""}`)
  } catch {
    // Dacă BE nu e disponibil, afișăm layout-ul cu statusurile din mock
    console.warn("Nu s-a putut obține statusul locurilor din BE. Se folosesc date locale.")
  }

  // Clonăm mock-ul și aplicăm disponibilitatea din BE
  return structuredClone(mockLocations).map((loc) => ({
    ...loc,
    floors: loc.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms?.map((room) => ({
        ...room,
        seats: applyAvailability(room.seats, beSeats, room.id),
      })) ?? [],
      seats: applyAvailability(floor.seats, beSeats, 103),
    })),
  }))
}

export async function getLocationById(locationId: number): Promise<Location | null> {
  const all = await getLocations()
  return all.find((l) => l.id === locationId) ?? null
}

export async function getLocationByBuilding(buildingName: string): Promise<Location | null> {
  const all = await getLocations()
  return all.find((l) => l.building === buildingName) ?? null
}

export async function getFloorsByLocationId(locationId: number): Promise<Floor[]> {
  const loc = await getLocationById(locationId)
  return loc?.floors ?? []
}

export async function getRoomsByFloorId(locationId: number, floorId: number): Promise<Room[]> {
  const loc = await getLocationById(locationId)
  return loc?.floors.find((f) => f.id === floorId)?.rooms ?? []
}

export async function getSeatsByFloorId(locationId: number, floorId: number): Promise<Seat[]> {
  const loc = await getLocationById(locationId)
  return loc?.floors.find((f) => f.id === floorId)?.seats ?? []
}

export async function getRoomById(roomId: number): Promise<Room | null> {
  const all = await getLocations()
  for (const loc of all) {
    for (const floor of loc.floors) {
      const found = floor.rooms?.find((r) => r.id === roomId)
      if (found) return found
    }
  }
  return null
}

export async function getSeatsByRoomId(roomId: number): Promise<Seat[]> {
  const room = await getRoomById(roomId)
  return room?.seats ?? []
}

export async function searchAvailableSeats(params: {
  type?: string
  nearWindow?: boolean
  hasMonitor?: boolean
  hasStandupDesk?: boolean
  date?: string
  startTime?: string
  endTime?: string
}): Promise<Seat[]> {
  const query = new URLSearchParams()
  if (params.type)                   query.set("type", params.type)
  if (params.nearWindow != null)     query.set("nearWindow", String(params.nearWindow))
  if (params.hasMonitor != null)     query.set("hasMonitor", String(params.hasMonitor))
  if (params.hasStandupDesk != null) query.set("hasStandupDesk", String(params.hasStandupDesk))
  if (params.date)                   query.set("date", params.date)
  if (params.startTime)              query.set("startTime", params.startTime)
  if (params.endTime)                query.set("endTime", params.endTime)

  // BE returnează locurile disponibile — extragem ID-urile
  const beSeats = await apiClient.get<BeSeatResponse[]>(`/seats?${query.toString()}`)
  const availableIds = new Set(beSeats.map((s) => s.id))

  // Găsim locurile FE corespunzătoare
  const all = await getLocations()
  const result: Seat[] = []
  for (const loc of all) {
    for (const floor of loc.floors) {
      if (floor.seats) {
        for (const seat of floor.seats) {
          if (availableIds.has(seat.id)) result.push(seat)
        }
      }
      for (const room of floor.rooms ?? []) {
        for (const seat of room.seats) {
          if (availableIds.has(seat.id)) result.push(seat)
        }
      }
    }
  }
  return result
}
