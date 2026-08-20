import { apiClient } from "./apiClient"
import { getLocations } from "./locationService"
import type { Location, DetailedReservation, Reservation, ReservationStatus } from "@/types"

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

// Helper to find building and floor by seatId from dynamically loaded locations list
function findLocationInfo(seatId: number, locationsList?: Location[]) {
  const activeLocations = locationsList ?? []
  for (const loc of activeLocations) {
    for (const floor of loc.floors) {
      const matchInFloor = floor.seats?.find((s) => s.id === seatId)
      if (matchInFloor) {
        return { loc, floor, seat: matchInFloor }
      }
      if (floor.rooms) {
        for (const room of floor.rooms) {
          const matchInRoom = room.seats?.find((s) => s.id === seatId)
          if (matchInRoom) {
            return { loc, floor, seat: matchInRoom }
          }
        }
      }
    }
  }
  return null
}

function findRoomInfo(roomId: number, locationsList?: Location[]) {
  for (const loc of locationsList ?? []) {
    for (const floor of loc.floors) {
      const room = floor.rooms?.find((item) => item.id === roomId)
      if (room) return { loc, floor, room }
    }
  }
  return null
}

// ─── Mapare răspuns BE → Reservation FE ───────────────────────────────────────

function mapToReservation(b: BeBookingResponse, locationsList?: Location[]): Reservation {
  const seatId = b.seatId ?? 0
  const info = findLocationInfo(seatId, locationsList)

  return {
    id: b.id,
    userId: b.userId,
    locationId: info?.loc?.id ?? 0,
    floorId: info?.floor?.id ?? 0,
    seatId: seatId,
    date: b.startDate,
    startTime: b.startTime?.substring(0, 5) ?? "",  // "09:00:00" → "09:00"
    endTime: b.endTime?.substring(0, 5) ?? "",
    status: mapStatus(b.status),
    createdAt: b.createdAt,
  }
}

function mapToDetailedReservation(b: BeBookingResponse, locationsList?: Location[]): DetailedReservation {
  const r = mapToReservation(b, locationsList)
  const seatId = b.seatId ?? 0
  const seatInfo = b.seatId != null ? findLocationInfo(seatId, locationsList) : null
  const roomInfo = b.roomId != null ? findRoomInfo(b.roomId, locationsList) : null
  const info = seatInfo ?? roomInfo

  return {
    ...r,
    location: info?.loc
      ? {
          id: info.loc.id,
          name: info.loc.name,
          address: info.loc.address,
          building: info.loc.building,
        }
      : null,
    floor: info?.floor
      ? {
          id: info.floor.id,
          number: info.floor.number,
          name: info.floor.name,
        }
      : null,
    seat: seatInfo?.seat
      ? {
          id: seatInfo.seat.id,
          code: seatInfo.seat.code,
          area: seatInfo.seat.area,
          type: seatInfo.seat.type,
        }
      : roomInfo?.room
      ? {
          id: roomInfo.room.id,
          code: `Sala ${roomInfo.room.name}`,
          area: "team",
          type: "standard",
        }
      : {
          id: seatId,
          code: `Loc ${seatId}`,
          area: "open",
          type: "standard",
        },
  }
}

// ─── API ───────────────────────────────────────────────────────────────────────

export async function getReservations(): Promise<Reservation[]> {
  const [data, locationsList] = await Promise.all([
    apiClient.get<BeBookingResponse[]>("/bookings/me"),
    getLocations().catch(() => [] as Location[]),
  ])
  return data.map((b) => mapToReservation(b, locationsList))
}

export async function getDetailedReservationsByUserId(
  _userId: number,
  status?: string,
): Promise<DetailedReservation[]> {
  const params = status ? `?status=${encodeURIComponent(status)}` : ""
  const [data, locationsList] = await Promise.all([
    apiClient.get<BeBookingResponse[]>(`/bookings/me${params}`),
    getLocations().catch(() => [] as Location[]),
  ])
  return data.map((b) => mapToDetailedReservation(b, locationsList))
}

export async function createReservation(
  reservationData: Omit<Reservation, "id" | "createdAt">,
): Promise<Reservation> {
  // ID-ul selectat trebuie să existe în backend; harta vizuală nu are voie să
  // trimită ID-uri mock către tabela de booking-uri.
  const isWholeRoomReservation = reservationData.seatId < 0
  if (!isWholeRoomReservation) {
    await apiClient.get<{ id: number }>(`/seats/${reservationData.seatId}`)
  }

  // Format times to HH:mm:ss as required by backend API
  const formattedStartTime = reservationData.startTime.length === 5 ? `${reservationData.startTime}:00` : reservationData.startTime
  const formattedEndTime = reservationData.endTime.length === 5 ? `${reservationData.endTime}:00` : reservationData.endTime

  const body = {
    userId: reservationData.userId || 1,
    roomId: isWholeRoomReservation ? -reservationData.seatId : null,
    seatId: isWholeRoomReservation ? null : reservationData.seatId,
    startDate: reservationData.date,
    endDate: reservationData.date,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
    recurrenceFrequency: null,
    recurrenceDaysOfWeek: null,
    recurrenceIntervalOfRecurrence: null
  }
  const data = await apiClient.post<BeBookingResponse>("/bookings", body)
  return mapToReservation(data)
}

export async function updateReservation(
  reservationId: number,
  updates: Partial<Pick<Reservation, "date" | "startTime" | "endTime" | "status">>,
): Promise<Reservation | null> {
  const formattedStartTime = updates.startTime && updates.startTime.length === 5 ? `${updates.startTime}:00` : updates.startTime
  const formattedEndTime = updates.endTime && updates.endTime.length === 5 ? `${updates.endTime}:00` : updates.endTime

  const body = {
    startDate: updates.date,
    endDate: updates.date,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
    status: updates.status ? mapStatusToFe(updates.status) : undefined,
  }
  const data = await apiClient.put<BeBookingResponse>(`/bookings/${reservationId}`, body)
  return mapToReservation(data)
}

export async function cancelReservation(reservationId: number): Promise<boolean> {
  await apiClient.put<unknown>(`/bookings/${reservationId}/cancel`)
  return true
}
