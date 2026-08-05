/**
 * geminiService.ts
 * Apelează Gemini 2.0 Flash API pentru a calcula ruta optimă (de la domiciliu la sediu)
 * și a genera AI Insights pe baza contextului utilizatorului.
 */

import type { AIInsightsData } from "@/types"
import { OFFICE_ADDRESS, defaultInsights } from "@/data/insights"

export interface AIInsightItem {
  id: string
  icon: string
  category: string
  title: string
  description: string
  accent?: "green" | "amber" | "blue" | "red"
}

export interface InsightContext {
  user: {
    firstName: string
    lastName: string
    role: string
    department: string
    domiciliu?: string
    preferences: {
      preferredFloor: number
      preferredArea: string
      preferredDays: string[]
      workPreferences: string[]
      preferredStartTime?: string
    }
  }
  officeAddress?: string
  reservations: Array<{
    date: string
    startTime: string
    endTime: string
    status: string
    seat?: { code: string; area: string; type: string } | null
    floor?: { name: string; number: number } | null
    location?: { name: string; address: string } | null
  }>
  colleaguesInOfficeToday: number
  totalColleagues: number
  currentDate: string
  currentTime: string
}

const DEFAULT_MODEL = "gemini-2.5-flash-lite"
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

function calculateFallbackRoute(ctx: InsightContext): AIInsightsData {
  const origin = ctx.user.domiciliu || "București, Nițu Vasile 58"
  const destination = ctx.officeAddress || OFFICE_ADDRESS

  // Calcul estimare distanță și durată
  const distanceKm = 11.8
  const durationMin = 32
  const targetStartTime = ctx.user.preferences.preferredStartTime || "15:00"

  // Calcul oră de plecare (ex: 15:00 - 32 min = 14:28)
  const [targetH, targetM] = targetStartTime.split(":").map(Number)
  const targetDate = new Date()
  targetDate.setHours(targetH || 15, targetM || 0, 0, 0)
  const departureDate = new Date(targetDate.getTime() - durationMin * 60000)

  const depHours = String(departureDate.getHours()).padStart(2, "0")
  const depMinutes = String(departureDate.getMinutes()).padStart(2, "0")

  const now = new Date()
  const minutesToLeave = Math.max(
    5,
    Math.round((departureDate.getTime() - now.getTime()) / 60000),
  )

  return {
    ...defaultInsights,
    departure: {
      time: `${depHours}:${depMinutes}`,
      minutesToLeave: isNaN(minutesToLeave) || minutesToLeave < 0 ? 25 : minutesToLeave,
      durationMin,
      distanceKm,
      trafficLevel: "Moderat",
      originAddress: origin,
      destinationAddress: destination,
      routeVia: "via Pasajul Basarab & Șos. Grozăvești",
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
  }
}

function buildPrompt(ctx: InsightContext): string {
  const origin = ctx.user.domiciliu || "București, Nițu Vasile 58"
  const destination = ctx.officeAddress || OFFICE_ADDRESS

  return `Ești un asistent inteligent de mobilitate și productivitate pentru aplicația "Book Your Seat".
Calculează ruta de navigație și generează insights pentru utilizator:

Context:
- Utilizator: ${ctx.user.firstName} ${ctx.user.lastName} (${ctx.user.role})
- Domiciliu (punct de plecare): ${origin}
- Sediu companie (destinație): ${destination}
- Ora de începere a muncii / sosire la birou: ${ctx.user.preferences.preferredStartTime || "15:00"}
- Ora curentă: ${ctx.currentTime}
- Colegi prezenți azi la birou: ${ctx.colleaguesInOfficeToday} din ${ctx.totalColleagues}

Calculează ruta optimă cu mașina prin București între ${origin} și ${destination}, estimând distanța în km, durata în minute conform traficului de dimineață, ora optimă de plecare, ruta recomandată și 2 alerte de trafic reale pe traseu.

Răspunde STRICT cu un JSON valid conform următoarei scheme (fără alt text):
{
  "departure": {
    "time": "HH:MM",
    "minutesToLeave": 25,
    "durationMin": 32,
    "distanceKm": 11.8,
    "trafficLevel": "Moderat",
    "originAddress": "${origin}",
    "destinationAddress": "${destination}",
    "routeVia": "via Pasajul Basarab / Șos. Grozăvești"
  },
  "weather": {
    "temp": 22,
    "condition": "Parțial Înnorat",
    "humidity": 80,
    "windKmh": 14,
    "rainChance": 10,
    "city": "București"
  },
  "trafficAlerts": [
    {
      "id": "1",
      "type": "warning",
      "location": "Pasajul Basarab",
      "detail": "+7 min față de normal"
    },
    {
      "id": "2",
      "type": "warning",
      "location": "Bd. Iuliu Maniu",
      "detail": "+5 min încetinire"
    }
  ],
  "seatRec": {
    "colleagueName": "Ana H.",
    "seat": "Loc 15",
    "floor": "Etaj 1"
  },
  "history": {
    "topFloor": "etajul 1",
    "topArea": "lângă fereastră",
    "reservationsThisMonth": 12
  }
}`
}

export async function getAIInsightsData(ctx: InsightContext): Promise<AIInsightsData> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return calculateFallbackRoute(ctx)
  }

  const modelName =
    (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || DEFAULT_MODEL
  const requestUrl = `${GEMINI_API_BASE}/${modelName}:generateContent?key=${apiKey}`

  try {
    let res = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(ctx) }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
      }),
    })

    if (res.status === 404 && modelName === "gemini-2.5-flash-lite") {
      const fallbackUrl = `${GEMINI_API_BASE}/gemini-2.0-flash:generateContent?key=${apiKey}`
      res = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(ctx) }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
        }),
      })
    }

    if (!res.ok) {
      console.warn("[geminiService] API error, falling back to calculation:", res.status)
      return calculateFallbackRoute(ctx)
    }

    const data = await res.json()
    const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const jsonMatch = raw.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return calculateFallbackRoute(ctx)
    }

    const parsed = JSON.parse(jsonMatch[0]) as AIInsightsData
    return {
      ...defaultInsights,
      ...parsed,
      departure: {
        ...defaultInsights.departure,
        ...parsed.departure,
        originAddress: ctx.user.domiciliu || "București, Nițu Vasile 58",
        destinationAddress: ctx.officeAddress || OFFICE_ADDRESS,
      },
    }
  } catch (error) {
    console.error("[geminiService] Error fetching AI insights:", error)
    return calculateFallbackRoute(ctx)
  }
}
