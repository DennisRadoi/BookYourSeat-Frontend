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
  seatCount: number
  occupancyPercentage: number
}

/** Analytics data is loaded only from backend endpoints. */
export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  const now = new Date()
  const [today, weekly, monthly] = await Promise.all([
    apiClient.get<TodayAnalyticsResponse>("/analytics/today"),
    apiClient.get<WeeklyBookingsResponse>("/analytics/bookings/current-week"),
    apiClient.get<MonthlyBookingsResponse>(
      `/analytics/bookings/total?year=${now.getFullYear()}&month=${now.getMonth() + 1}`,
    ),
  ])

  let topBookings: TopBookingResponse[] = []
  try {
    topBookings = await apiClient.get<TopBookingResponse[]>("/analytics/top-bookings")
  } catch (error) {
    console.warn("Top bookings endpoint unavailable. Rendering analytics without top bookings.", error)
  }

  return {
    kpis: [
      { id: "totalBookings", label: "Rezervari luna curenta", value: String(monthly.totalBookings) },
      { id: "roomOccupancy", label: "Ocupare sali conferinta", value: `${today.conferenceRoomsOccupancyPercent}%` },
      { id: "deskOccupancy", label: "Ocupare birouri", value: `${today.officeOccupancyPercent}%` },
      { id: "peopleInOffice", label: "Persoane in birou", value: String(today.peopleInOffice) },
    ],
    weeklyBookings: weekly.days,
    occupancyTrend: [{ label: "Azi", value: today.officeOccupancyPercent }],
    // Backend does not expose zone-level aggregation yet.
    zoneSegments: [],
    topBookings: topBookings.map((entry) => ({
      name: entry.employeeName,
      seats: entry.seatCount,
      percent: entry.occupancyPercentage,
    })),
  }
}
