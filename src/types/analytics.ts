export interface AnalyticsKpi {
  id: string
  label: string
  value: string
}

export interface AnalyticsWeeklyBooking {
  day: string
  officeBookings: number
  conferenceRoomBookings: number
}

export interface AnalyticsZoneSegment {
  label: string
  value: number
  color: string
}

export interface AnalyticsOccupancyPoint {
  label: string
  value: number
}

export interface AnalyticsTopBooking {
  name: string
  seats: number
  percent: number
}

export interface AnalyticsDashboardData {
  kpis: AnalyticsKpi[]
  weeklyBookings: AnalyticsWeeklyBooking[]
  zoneSegments: AnalyticsZoneSegment[]
  occupancyTrend: AnalyticsOccupancyPoint[]
  topBookings: AnalyticsTopBooking[]
}
