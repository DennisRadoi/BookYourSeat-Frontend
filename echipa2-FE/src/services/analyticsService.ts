import { apiClient } from "./apiClient"
import type { AnalyticsDashboardData } from "@/types"

interface TodayAnalyticsResponse {
  conferenceRoomsOccupancyPercent: number
  officeOccupancyPercent: number
  peopleInOffice: number
}

interface WeeklyDayBookingsResponse {
  day: string
  officeBookings: number
  conferenceRoomBookings: number
}

interface WeeklyBookingsResponse {
  days: WeeklyDayBookingsResponse[]
}

interface MonthlyBookingsResponse {
  totalBookings: number
}

interface TopBookingResponse {
  employeeName: string
  bookingCount?: number
  percentage?: number
  // Compatibilitate cu backendul nerestartat, care poate expune încă vechile nume.
  seatCount?: number
  occupancyPercentage?: number
}

/** Datele Analytics sunt citite exclusiv din endpointurile backendului. */
export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  const now = new Date()
  const [today, weekly, monthly, topBookings] = await Promise.all([
    apiClient.get<TodayAnalyticsResponse>("/analytics/today"),
    apiClient.get<WeeklyBookingsResponse>("/analytics/bookings/current-week"),
    apiClient.get<MonthlyBookingsResponse>(
      `/analytics/bookings/total?year=${now.getFullYear()}&month=${now.getMonth() + 1}`,
    ),
    apiClient.get<TopBookingResponse[]>(
      `/analytics/top-bookings?year=${now.getFullYear()}&month=${now.getMonth() + 1}`,
    ),
  ])


  return {
    kpis: [
      { id: "totalBookings", label: "Rezervari luna curenta", value: String(monthly.totalBookings) },
      { id: "roomOccupancy", label: "Ocupare sali conferinta", value: `${today.conferenceRoomsOccupancyPercent}%` },
      { id: "deskOccupancy", label: "Ocupare birouri", value: `${today.officeOccupancyPercent}%` },
      { id: "peopleInOffice", label: "Persoane in birou", value: String(today.peopleInOffice) },
    ],
    weeklyBookings: weekly.days,
    topBookings: topBookings.slice(0, 5).map((entry) => ({
      name: entry.employeeName,
      bookings: entry.bookingCount ?? entry.seatCount ?? 0,
      percent: entry.percentage ?? entry.occupancyPercentage ?? 0,
    })),
  }
}
