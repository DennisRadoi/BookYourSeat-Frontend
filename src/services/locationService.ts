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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSeatAvailable(status: string | null): boolean {
  return status === "REZERVABIL" || status === "AVAILABLE" || status == null
}

/**
 * Aplică statusul de disponibilitate din BE peste locurile din mock.
 * Folosim ID-ul locului ca cheie de potrivire (ID FE = ID BE din seed).
 */
function applyAvailability(mockSeats: Seat[], beSeats: BeSeatResponse[]): Seat[] {
  const beMap = new Map<number, BeSeatResponse>()
  for (const s of beSeats) beMap.set(s.id, s)

  return mockSeats.map((seat) => {
    const be = beMap.get(seat.id)
    if (!be) return seat
    const isAvailable = isSeatAvailable(be.status)
    return {
      ...seat,
      isAvailable,
      occupiedBy: isAvailable ? undefined : seat.occupiedBy || "Coleg",
    }
  })
}

// ─── API ───────────────────────────────────────────────────────────────────────

export async function getLocations(): Promise<Location[]> {
  // Încercăm să luăm statusul locurilor din BE
  let beSeats: BeSeatResponse[] = []
  try {
    beSeats = await apiClient.get<BeSeatResponse[]>("/seats")
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
        seats: applyAvailability(room.seats, beSeats),
      })) ?? [],
      seats: applyAvailability(floor.seats, beSeats),
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
      for (const room of floor.rooms ?? []) {
        for (const seat of room.seats) {
          if (availableIds.has(seat.id)) result.push(seat)
        }
      }
    }
  }
  return result
}
