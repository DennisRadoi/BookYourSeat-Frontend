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

/** Datele Analytics sunt citite exclusiv din endpointurile backendului. */
export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  const now = new Date()
  const [today, weekly, monthly] = await Promise.all([
    apiClient.get<TodayAnalyticsResponse>("/analytics/today"),
    apiClient.get<WeeklyBookingsResponse>("/analytics/bookings/current-week"),
    apiClient.get<MonthlyBookingsResponse>(
      `/analytics/bookings/total?year=${now.getFullYear()}&month=${now.getMonth() + 1}`,
    ),
  ])

  return {
    kpis: [
      { id: "totalBookings", label: "Rezervări luna curentă", value: String(monthly.totalBookings) },
      { id: "roomOccupancy", label: "Ocupare săli conferință", value: `${today.conferenceRoomsOccupancyPercent}%` },
      { id: "deskOccupancy", label: "Ocupare birouri", value: `${today.officeOccupancyPercent}%` },
      { id: "peopleInOffice", label: "Persoane în birou", value: String(today.peopleInOffice) },
    ],
    weeklyBookings: weekly.days,
    occupancyTrend: [{ label: "Azi", value: today.officeOccupancyPercent }],
    // Backendul nu expune încă agregări pe zone sau utilizatori.
    zoneSegments: [],
    topBookings: [],
  }
}
