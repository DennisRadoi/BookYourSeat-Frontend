import { locations } from "@/data"
import type { Floor, Location, Room, Seat } from "@/types"

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Replace mock data with backend API integration
export async function getLocations(): Promise<Location[]> {
  await delay()
  return structuredClone(locations)
}

export async function getLocationById(locationId: number): Promise<Location | null> {
  await delay()
  const location = locations.find((item) => item.id === locationId)
  return location ? structuredClone(location) : null
}

export async function getLocationByBuilding(buildingName: string): Promise<Location | null> {
  await delay()
  const location = locations.find((item) => item.building === buildingName)
  return location ? structuredClone(location) : null
}

export async function getFloorsByLocationId(locationId: number): Promise<Floor[]> {
  await delay()
  const location = locations.find((item) => item.id === locationId)
  return location ? structuredClone(location.floors) : []
}

export async function getRoomsByFloorId(locationId: number, floorId: number): Promise<Room[]> {
  await delay()
  const location = locations.find((item) => item.id === locationId)
  const floor = location?.floors.find((item) => item.id === floorId)
  return floor?.rooms ? structuredClone(floor.rooms) : []
}

export async function getSeatsByFloorId(locationId: number, floorId: number): Promise<Seat[]> {
  await delay()
  const location = locations.find((item) => item.id === locationId)
  const floor = location?.floors.find((item) => item.id === floorId)
  return floor ? structuredClone(floor.seats) : []
}

export async function getRoomById(roomId: number): Promise<Room | null> {
  await delay()
  for (const loc of locations) {
    for (const floor of loc.floors) {
      const foundRoom = floor.rooms?.find((r) => r.id === roomId)
      if (foundRoom) return structuredClone(foundRoom)
    }
  }
  return null
}
