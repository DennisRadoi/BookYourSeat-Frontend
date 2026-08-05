import type { AIInsightsData } from "@/types"

// TODO: Replace mock data with backend API integration
export const defaultInsights: AIInsightsData = {
  departure: {
    time: "08:37",
    minutesToLeave: 23,
    durationMin: 23,
    distanceKm: 7.4,
    trafficLevel: "Moderat",
  },
  weather: {
    temp: 22,
    condition: "Parțial Înnorat",
    humidity: 83,
    windKmh: 14,
    rainChance: 10,
    city: "București",
  },
  trafficAlerts: [
    {
      id: "1",
      type: "warning",
      location: "Coloană pe Bd. Unirii",
      detail: "+8 min față de normal · km 2–4",
    },
    {
      id: "2",
      type: "danger",
      location: "Accident pe Șos. Iancului",
      detail: "+10 min · Rută alternativă disponibilă",
    },
  ],
  seatRec: {
    colleagueName: "Ana H.",
    seat: "Loc 15",
    floor: "Etaj 1",
  },
  history: {
    topFloor: "etajul 1",
    topArea: "lângă fereastră",
    reservationsThisMonth: 12,
  },
}
