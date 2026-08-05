import { reservations, locations } from "@/data"
import type { DetailedReservation, Reservation } from "@/types"

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Replace mock data with backend API integration
export async function getReservations(): Promise<Reservation[]> {
  await delay()
  return structuredClone(reservations)
}

export async function getDetailedReservationsByUserId(userId: number): Promise<DetailedReservation[]> {
  await delay()
  const userReservations = reservations.filter((reservation) => reservation.userId === userId)

  return userReservations.map((reservation) => {
    const location = locations.find((item) => item.id === reservation.locationId)
    const floor = location?.floors.find((item) => item.id === reservation.floorId)
    const seat = floor?.seats.find((item) => item.id === reservation.seatId)

    return {
      ...reservation,
      location: location
        ? {
            id: location.id,
            name: location.name,
            address: location.address,
            building: location.building,
          }
        : null,
      floor: floor
        ? {
            id: floor.id,
            number: floor.number,
            name: floor.name,
          }
        : null,
      seat: seat
        ? {
            id: seat.id,
            code: seat.code,
            area: seat.area,
            type: seat.type,
          }
        : null,
    }
  })
}

export async function createReservation(
  reservationData: Omit<Reservation, "id" | "createdAt">,
): Promise<Reservation> {
  await delay()
  const newReservation: Reservation = {
    ...reservationData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  }
  reservations.push(newReservation)
  return structuredClone(newReservation)
}

export async function cancelReservation(reservationId: number): Promise<boolean> {
  await delay()
  const reservation = reservations.find((r) => r.id === reservationId)
  if (reservation) {
    reservation.status = "cancelled"
    return true
  }
  return false
}
