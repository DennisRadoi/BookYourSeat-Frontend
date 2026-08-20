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

export interface AnalyticsTopBooking {
  name: string
  bookings: number
  percent: number
}

export interface AnalyticsDashboardData {
  kpis: AnalyticsKpi[]
  weeklyBookings: AnalyticsWeeklyBooking[]
  topBookings: AnalyticsTopBooking[]
}
