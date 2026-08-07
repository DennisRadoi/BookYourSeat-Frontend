import type {
  AnalyticsDashboardData,
} from "@/types"

export const analyticsDashboardData: AnalyticsDashboardData = {
  kpis: [
    { id: "totalBookings", label: "Rezervări totale", value: "65" },
    { id: "roomOccupancy", label: "Ocupare săli conferință", value: "58%" },
    { id: "deskOccupancy", label: "Ocupare birouri", value: "76%" },
    { id: "peopleInOffice", label: "Persoane în birou", value: "18" },
  ],
  weeklyBookings: [
    { day: "Luni", officeBookings: 16, conferenceRoomBookings: 4 },
    { day: "Marți", officeBookings: 28, conferenceRoomBookings: 10 },
    { day: "Miercuri", officeBookings: 8, conferenceRoomBookings: 2 },
    { day: "Joi", officeBookings: 36, conferenceRoomBookings: 8 },
    { day: "Vineri", officeBookings: 12, conferenceRoomBookings: 3 },
  ],
  zoneSegments: [
    { label: "Lângă fereastră", value: 24, color: "#34d399" },
    { label: "Zona liniștită", value: 38, color: "#60a5fa" },
    { label: "Open space", value: 18, color: "#fbbf24" },
  ],
  occupancyTrend: [
    { label: "W1", value: 45 },
    { label: "W2", value: 72 },
    { label: "W3", value: 62 },
    { label: "W4", value: 73 },
    { label: "W5", value: 98 },
    { label: "W6", value: 84 },
  ],
  topBookings: [
    { name: "George", seats: 10, percent: 87 },
    { name: "Ana", seats: 8, percent: 66 },
    { name: "Claudiu", seats: 6, percent: 55 },
    { name: "Mihaela", seats: 5, percent: 42 },
    { name: "Andrei", seats: 4, percent: 36 },
  ],
}
