import type { AIInsightsData } from "@/types"

export const OFFICE_ADDRESS = "Aleea Țibleș 26, Sector 6 · București"

// TODO: Replace mock data with backend API integration
export const defaultInsights: AIInsightsData = {
  departure: {
    time: "14:28",
    minutesToLeave: 25,
    durationMin: 32,
    distanceKm: 11.8,
    trafficLevel: "Moderat",
    originAddress: "București, Nițu Vasile 58",
    destinationAddress: OFFICE_ADDRESS,
    routeVia: "via Pasajul Basarab / Șos. Grozăvești",
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
      location: "Pasajul Basarab / Șos. Grozăvești",
      detail: "+7 min față de normal · Trafic aglomerat",
    },
    {
      id: "2",
      type: "warning",
      location: "Bd. Iuliu Maniu (intersecție Lujerului)",
      detail: "+5 min · Încetinire pe sensul spre centru",
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
