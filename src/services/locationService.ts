import { apiClient } from "./apiClient"
import { withCache } from "./cache"
import type { Floor, Location, Room, Seat } from "@/types"

interface BeBuilding { id: number; name: string }
interface BeRoom { id: number; name: string; floor: number; type: string; buildingId: number | null; buildingName: string | null }
interface BeSeat { id: number; code?: string | null; roomId: number; status: string | null; xPosition: number | null; yPosition: number | null; hasMonitor: boolean | null; nearWindow: boolean | null; hasStandupDesk: boolean | null; occupiedBy?: string | null; unavailableReason?: string | null }

function seatFromApi(seat: BeSeat): Seat {
  const available = ["REZERVABIL", "AVAILABLE", "DISPONIBIL"].includes((seat.status ?? "").toUpperCase())
  return {
    id: seat.id,
    code: seat.code ?? `S${seat.id}`,
    xPosition: seat.xPosition,
    yPosition: seat.yPosition,
    area: seat.nearWindow ? "window" : seat.hasStandupDesk ? "focus" : "open",
    type: seat.hasStandupDesk ? "standing" : "standard",
    hasMonitor: Boolean(seat.hasMonitor),
    isAvailable: available,
    occupiedBy: seat.occupiedBy ?? undefined,
    unavailableReason: seat.unavailableReason ?? undefined,
  }
}

export async function getLocations(params?: { date?: string; startTime?: string; endTime?: string }): Promise<Location[]> {
  const query = new URLSearchParams()
  if (params?.date) query.set("date", params.date)
  if (params?.startTime) query.set("startTime", params.startTime.length === 5 ? `${params.startTime}:00` : params.startTime)
  if (params?.endTime) query.set("endTime", params.endTime.length === 5 ? `${params.endTime}:00` : params.endTime)

  const cacheKey = `locations:${query.toString()}`
  // 10s TTL for availability queries (time-sensitive), 60s for plain location structure
  const ttl = params?.date ? 10_000 : 60_000

  return withCache(cacheKey, async () => {
    const [buildings, rooms, seats] = await Promise.all([
      apiClient.get<BeBuilding[]>("/buildings"),
      apiClient.get<BeRoom[]>("/rooms"),
      apiClient.get<BeSeat[]>(`/seats${query.size ? `?${query.toString()}` : ""}`),
    ])
    return buildings.map((building) => {
      const buildingRooms = rooms.filter((room) => room.buildingId === building.id)
      const floors: Floor[] = [...new Set(buildingRooms.map((room) => room.floor))].sort((a, b) => a - b).map((floorNumber) => {
        const floorRooms: Room[] = buildingRooms.filter((room) => room.floor === floorNumber).map((room) => ({
          id: room.id, name: room.name, floorId: floorNumber, building: building.name,
          type: room.type === "DE_CONFERINTA" ? "conferinte" : "birouri",
          seats: seats.filter((seat) => seat.roomId === room.id).map(seatFromApi),
        }))
        return { id: floorNumber, number: floorNumber, name: `Etaj ${floorNumber}`, rooms: floorRooms, seats: [] }
      })
      return { id: building.id, name: building.name, building: building.name, address: "", city: "", floors }
    })
  }, ttl)
}

export async function getLocationById(id: number) { return (await getLocations()).find((location) => location.id === id) ?? null }
export async function getLocationByBuilding(name: string) { return (await getLocations()).find((location) => location.building === name) ?? null }
export async function getFloorsByLocationId(id: number) { return (await getLocationById(id))?.floors ?? [] }
export async function getRoomsByFloorId(locationId: number, floorId: number) { return (await getFloorsByLocationId(locationId)).find((floor) => floor.id === floorId)?.rooms ?? [] }
export async function getSeatsByFloorId(locationId: number, floorId: number) { return (await getFloorsByLocationId(locationId)).find((floor) => floor.id === floorId)?.seats ?? [] }
export async function getRoomById(id: number) { for (const location of await getLocations()) for (const floor of location.floors) { const room = floor.rooms?.find((item) => item.id === id); if (room) return room } return null }
export async function getSeatsByRoomId(id: number) { return (await getRoomById(id))?.seats ?? [] }
export async function searchAvailableSeats(params: { type?: string; nearWindow?: boolean; hasMonitor?: boolean; hasStandupDesk?: boolean; date?: string; startTime?: string; endTime?: string }): Promise<Seat[]> {
  const locations = await getLocations(params)
  return locations.flatMap((location) => location.floors.flatMap((floor) => (floor.rooms ?? []).flatMap((room) => room.seats.filter((seat) => seat.isAvailable))))
}
