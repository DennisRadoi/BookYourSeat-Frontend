import { apiClient } from "./apiClient"
import { locations as mockLocations } from "@/data"
import type { DetailedReservation, Reservation, ReservationStatus } from "@/types"

// ─── Reservation Service ───────────────────────────────────────────────────────
// GET  /bookings/me?status=        → rezervările userului curent
// GET  /bookings/{id}              → o rezervare
// POST /bookings                   → creează rezervare
// PUT  /bookings/{id}              → actualizează rezervare
// PUT  /bookings/{id}/cancel       → anulează rezervare

// ─── Tipuri BE ────────────────────────────────────────────────────────────────

type BeBookingStatus = "IN_ASTEPTARE" | "FINALIZATA" | "ANULATA" | "CONFIRMATA"

interface BeBookingResponse {
  id: number
  userId: number
  roomId: number | null
  seatId: number | null
  recurringBookingId: number | null
  startDate: string   // "2026-08-18"
  endDate: string     // "2026-08-18"
  startTime: string   // "09:00:00"
  endTime: string     // "17:00:00"
  status: BeBookingStatus
  createdAt: string
  updatedAt: string
}

// ─── Mappings ──────────────────────────────────────────────────────────────────

export function getBackendSeatId(feSeatId: number): number {
  const mapping: Record<number, number> = {
    2000: 1, // A1 (Parter T1)
    2001: 2, // A2 (Parter T1)
    1100: 3, // T1 (Etaj 1 T1)
    2200: 4, // M1 (Etaj 2 T2)
    2201: 5, // M2 (Etaj 2 T2)
  }
  if (mapping[feSeatId]) return mapping[feSeatId]
  return (feSeatId % 5) + 1
}

export function getFrontendSeatInfo(beSeatId: number): { id: number; code: string } {
  const mapping: Record<number, { id: number; code: string }> = {
    1: { id: 2000, code: "A1" },
    2: { id: 2001, code: "A2" },
    3: { id: 1100, code: "T1" },
    4: { id: 2200, code: "M1" },
    5: { id: 2201, code: "M2" },
  }
  return mapping[beSeatId] || { id: beSeatId, code: `Loc ${beSeatId}` }
}

// ─── Mapare status BE → FE ─────────────────────────────────────────────────────

function mapStatus(beStatus: BeBookingStatus): ReservationStatus {
  const map: Record<BeBookingStatus, ReservationStatus> = {
    IN_ASTEPTARE: "pending",
    FINALIZATA: "completed",
    ANULATA: "cancelled",
    CONFIRMATA: "confirmed",
  }
  return map[beStatus] ?? "pending"
}

function mapStatusToFe(feStatus: ReservationStatus): BeBookingStatus {
  const map: Record<ReservationStatus, BeBookingStatus> = {
    pending: "IN_ASTEPTARE",
    completed: "FINALIZATA",
    cancelled: "ANULATA",
    confirmed: "CONFIRMATA",
  }
  return map[feStatus] ?? "IN_ASTEPTARE"
}

// ─── Mapare răspuns BE → Reservation FE ───────────────────────────────────────

function mapToReservation(b: BeBookingResponse): Reservation {
  const seatInfo = getFrontendSeatInfo(b.seatId ?? 1)
  return {
    id: b.id,
    userId: b.userId,
    locationId: 0,
    floorId: 0,
    seatId: seatInfo.id,
    date: b.startDate,
    startTime: b.startTime?.substring(0, 5) ?? "",  // "09:00:00" → "09:00"
    endTime: b.endTime?.substring(0, 5) ?? "",
    status: mapStatus(b.status),
    createdAt: b.createdAt,
  }
}

function mapToDetailedReservation(b: BeBookingResponse): DetailedReservation {
  const r = mapToReservation(b)
  const seatInfo = getFrontendSeatInfo(b.seatId ?? 1)

  let foundLoc: any = null
  let foundFloor: any = null
  let foundSeat: any = null

  for (const loc of mockLocations) {
    for (const floor of loc.floors) {
      const matchInFloor = floor.seats?.find((s) => s.id === seatInfo.id)
      if (matchInFloor) {
        foundLoc = loc
        foundFloor = floor
        foundSeat = matchInFloor
        break
      }
      if (floor.rooms) {
        for (const room of floor.rooms) {
          const matchInRoom = room.seats?.find((s) => s.id === seatInfo.id)
          if (matchInRoom) {
            foundLoc = loc
            foundFloor = floor
            foundSeat = matchInRoom
            break
          }
        }
      }
      if (foundSeat) break
    }
    if (foundSeat) break
  }

  return {
    ...r,
    location: foundLoc
      ? {
        id: foundLoc.id,
        name: foundLoc.name,
        address: foundLoc.address,
        building: foundLoc.building,
      }
      : null,
    floor: foundFloor
      ? {
        id: foundFloor.id,
        number: foundFloor.number,
        name: foundFloor.name,
      }
      : null,
    seat: foundSeat
      ? {
        id: foundSeat.id,
        code: foundSeat.code,
        area: foundSeat.area,
        type: foundSeat.type,
      }
      : {
        id: seatInfo.id,
        code: seatInfo.code,
        area: "open",
        type: "standard",
      },
  }
}

// ─── API ───────────────────────────────────────────────────────────────────────

export async function getReservations(): Promise<Reservation[]> {
  const data = await apiClient.get<BeBookingResponse[]>("/bookings/me")
  return data.map(mapToReservation)
}

export async function getDetailedReservationsByUserId(
  _userId: number,
  status?: string,
): Promise<DetailedReservation[]> {
  const params = status ? `?status=${encodeURIComponent(status)}` : ""
  const data = await apiClient.get<BeBookingResponse[]>(`/bookings/me${params}`)
  return data.map(mapToDetailedReservation)
}

export async function createReservation(
  reservationData: Omit<Reservation, "id" | "createdAt">,
): Promise<Reservation> {
  const body = {
    seatId: getBackendSeatId(reservationData.seatId),
    roomId: null,
    startDate: reservationData.date,
    endDate: reservationData.date,
    startTime: reservationData.startTime,
    endTime: reservationData.endTime,
  }
  const data = await apiClient.post<BeBookingResponse>("/bookings", body)
  return mapToReservation(data)
}

export async function updateReservation(
  reservationId: number,
  updates: Partial<Pick<Reservation, "date" | "startTime" | "endTime" | "status">>,
): Promise<Reservation | null> {
  const body = {
    startDate: updates.date,
    endDate: updates.date,
    startTime: updates.startTime,
    endTime: updates.endTime,
    status: updates.status ? mapStatusToFe(updates.status) : undefined,
  }
  const data = await apiClient.put<BeBookingResponse>(`/bookings/${reservationId}`, body)
  return mapToReservation(data)
}

export async function cancelReservation(reservationId: number): Promise<boolean> {
  await apiClient.put<unknown>(`/bookings/${reservationId}/cancel`)
  return true
}

