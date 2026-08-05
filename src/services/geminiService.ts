/**
 * geminiService.ts
 * Apelează Gemini 2.5 Flash Lite API pentru a calcula ruta optimă (de la domiciliu la sediu)
 * și a genera AI Insights pe baza contextului utilizatorului, corelat cu date meteo reale în timp real.
 */

import type { AIInsightsData, WeatherInsight } from "@/types"
import { OFFICE_ADDRESS, defaultInsights } from "@/data/insights"
import { fetchLiveWeather } from "./weatherService"

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

function calculateFallbackRoute(ctx: InsightContext, liveWeather?: WeatherInsight): AIInsightsData {
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
    weather: liveWeather || defaultInsights.weather,
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

function buildPrompt(ctx: InsightContext, liveWeather?: WeatherInsight): string {
  const origin = ctx.user.domiciliu || "București, Nițu Vasile 58"
  const destination = ctx.officeAddress || OFFICE_ADDRESS
  const weatherContext = liveWeather
    ? `Vreme curentă București: ${liveWeather.temp}°C, ${liveWeather.condition}, umiditate ${liveWeather.humidity}%, vânt ${liveWeather.windKmh} km/h, șanse ploaie ${liveWeather.rainChance}%`
    : `Vreme curentă București: 24°C, Parțial înnorat`

  return `Ești un asistent inteligent de navigație și mobilitate urbană pentru București în aplicația "Book Your Seat".

Sarcina ta:
Calculează ruta de deplasare cu mașina și generează predicții reale de trafic pentru traseul exact al utilizatorului.

Context:
- Utilizator: ${ctx.user.firstName} ${ctx.user.lastName} (${ctx.user.role})
- Domiciliu (Plecare): ${origin}
- Sediu companie (Destinație): ${destination}
- Ora de sosire la birou: ${ctx.user.preferences.preferredStartTime || "15:00"}
- Ora curentă: ${ctx.currentTime}
- Colegi prezenți azi: ${ctx.colleaguesInOfficeToday} din ${ctx.totalColleagues}
- ${weatherContext}

Instrucțiuni specifice de navigație pentru București:
1. Analizează traseul rutier real între ${origin} și ${destination}. Identifică bulevardele și nodurile rutiere traversate efectiv pe acest coridor (ex: Bd. Constantin Brâncoveanu / Șos. Olteniței -> Pasajul Mărășești / Splaiul Independenței -> Pasajul Basarab / Șos. Grozăvești / Bd. Iuliu Maniu -> Aleea Țibleș).
2. Estimează durata reală de deplasare la ora indicată, distanța exactă în kilometri și ora la care trebuie să plece pentru a ajunge la timp.
3. Generează 2-3 ALERTE DE TRAFIC SPECIFICE punctelor critice de pe acest traseu direct (ex: intersecții aglomerate, lucrări, cozi la semafoare, poduri/pasaje aglomerate pe sensul de mers) cu locația exactă și impactul în minute.

Răspunde STRICT cu un JSON valid (fără comentarii, markdown suplimentar sau alt text):
{
  "departure": {
    "time": "HH:MM",
    "minutesToLeave": 25,
    "durationMin": 32,
    "distanceKm": 11.8,
    "trafficLevel": "Scăzut | Moderat | Ridicat",
    "originAddress": "${origin}",
    "destinationAddress": "${destination}",
    "routeVia": "numele arterelor principale de pe traseu (ex: via Splaiul Independenței & Șos. Grozăvești)"
  },
  "trafficAlerts": [
    {
      "id": "1",
      "type": "warning",
      "location": "Numele exact al străzii / pasajului de pe traseul calculat",
      "detail": "Descriere scurtă a congestiei (+X min întârziere)"
    },
    {
      "id": "2",
      "type": "warning",
      "location": "Alt punct critic de pe acest traseu specific",
      "detail": "Descriere congestie (+X min)"
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

  // Preluăm vremea reală live pentru București în paralel
  const liveWeatherPromise = fetchLiveWeather().catch(() => defaultInsights.weather)

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const liveWeather = await liveWeatherPromise
    return calculateFallbackRoute(ctx, liveWeather)
  }

  const modelName =
    (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || DEFAULT_MODEL
  const requestUrl = `${GEMINI_API_BASE}/${modelName}:generateContent?key=${apiKey}`

  try {
    const liveWeather = await liveWeatherPromise

    let res = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(ctx, liveWeather) }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
      }),
    })

    if (res.status === 404 && modelName === "gemini-2.5-flash-lite") {
      const fallbackUrl = `${GEMINI_API_BASE}/gemini-2.0-flash:generateContent?key=${apiKey}`
      res = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(ctx, liveWeather) }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
        }),
      })
    }

    if (!res.ok) {
      console.warn("[geminiService] API error, falling back to calculation:", res.status)
      return calculateFallbackRoute(ctx, liveWeather)
    }

    const data = await res.json()
    const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const jsonMatch = raw.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return calculateFallbackRoute(ctx, liveWeather)
    }

    const parsed = JSON.parse(jsonMatch[0]) as Partial<AIInsightsData>
    return {
      ...defaultInsights,
      ...parsed,
      weather: liveWeather || parsed.weather || defaultInsights.weather,
      departure: {
        ...defaultInsights.departure,
        ...parsed.departure,
        originAddress: ctx.user.domiciliu || "București, Nițu Vasile 58",
        destinationAddress: ctx.officeAddress || OFFICE_ADDRESS,
      },
    }
  } catch (error) {
    console.error("[geminiService] Error fetching AI insights:", error)
    const liveWeather = await liveWeatherPromise
    return calculateFallbackRoute(ctx, liveWeather)
  }
}
