/**
 * geminiService.ts
 * Integrează Google Routes API și Gemini 2.5 Flash pentru a genera
 * explicații AI personalizate și alerte de trafic reale bazate pe datele rutiere.
 */

import type { AIInsightsData, WeatherInsight } from "@/types"
import { OFFICE_ADDRESS, defaultInsights } from "@/data/insights"
import { fetchLiveWeather } from "./weatherService"
import { getRouteData, type RouteData } from "./routeService"

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

const DEFAULT_MODEL = "gemini-3.1-flash-lite"
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

function buildPrompt(
  ctx: InsightContext,
  routeData: RouteData,
  liveWeather?: WeatherInsight,
): string {
  const targetTime = ctx.user.preferences.preferredStartTime || "15:00"
  const weatherContext = liveWeather
    ? `Vreme curentă București: ${liveWeather.temp}°C, ${liveWeather.condition}, umiditate ${liveWeather.humidity}%, vânt ${liveWeather.windKmh} km/h`
    : `Vreme curentă București: 24°C, Parțial înnorat`

  const routePayload = {
    distanceKm: routeData.distanceKm,
    durationMin: routeData.durationMin,
    trafficDelayMin: routeData.trafficDelayMin,
    departureTime: routeData.departureTime,
    targetArrivalTime: targetTime,
    incidents: routeData.incidents,
  }

  return `Ești un asistent AI inteligent de navigație și mobilitate urbană pentru aplicația "Book Your Seat".

Aplicația a calculat prin Google Routes următoarele date reale despre traseu:
${JSON.stringify(routePayload, null, 2)}

Context utilizator & mediu:
- Utilizator: ${ctx.user.firstName} ${ctx.user.lastName} (${ctx.user.role})
- Punct plecare: ${ctx.user.domiciliu || "București, Nițu Vasile 58"}
- Traseu plecare: ${routeData.routeSummary}
- Oră dorită sosire birou: ${targetTime}
- ${weatherContext}

Sarcina ta:
1. Pe baza datelor din obiectul JSON de mai sus, generează o explicație clară, scurtă și prietenoasă în limba română pentru utilizator, RESPECTÂND EXACT STRUCTURA ȘI TONUL DIN ACEST EXEMPLU IDEAL:

Exemplu ideal de redactare:
"Traficul este mai intens pe Pasajul Basarab și pe Bd. Iuliu Maniu, unde întârzierile estimate sunt de aproximativ 14 minute în total.
Pentru a ajunge la birou la ora dorită (${targetTime}), recomandăm plecarea la ${routeData.departureTime}.
Condițiile meteo nu indică riscuri suplimentare."

2. Generează lista de ALERTE DE TRAFIC ("trafficAlerts") bazată pe punctele aglomerate (incidente/întârzieri) din datele transmise.

Răspunde STRICT cu un JSON valid (fără alt text sau blocuri markdown suplimentare):
{
  "explanation": "Textul tău explicativ în limba română conform exemplului ideal de mai sus",
  "trafficAlerts": [
    {
      "id": "1",
      "type": "warning",
      "location": "Pasaj Basarab",
      "detail": "+6 min față de normal · Trafic aglomerat pe tronson"
    },
    {
      "id": "2",
      "type": "warning",
      "location": "Bd. Iuliu Maniu",
      "detail": "+8 min față de normal · Întârziere estimată la semafoare"
    }
  ],
  "seatRec": {
    "colleagueName": "Ana Popescu",
    "seat": "Loc A1 (ocupat)",
    "floor": "Parter (Corp T1)",
    "building": "Corp T1",
    "floorId": 1,
    "zoneType": "birouri",
    "roomId": 100,
    "targetSeatCode": "A2",
    "roomName": "Birouri Parter"
  },
  "history": {
    "topFloor": "etajul 1",
    "topArea": "lângă fereastră",
    "reservationsThisMonth": 12
  }
}`
}

function calculateFallbackResult(
  ctx: InsightContext,
  routeData: RouteData,
  liveWeather?: WeatherInsight,
): AIInsightsData {
  const targetTime = ctx.user.preferences.preferredStartTime || "15:00"
  const totalDelay = routeData.trafficDelayMin || 14
  const incidentLocations = routeData.incidents.map((i) => i.location).join(" și pe ") || "Pasajul Basarab și Bd. Iuliu Maniu"

  const defaultExplanation = `Traficul este mai intens pe ${incidentLocations}, unde întârzierile estimate sunt de aproximativ ${totalDelay} minute în total.\n\nPentru a ajunge la birou la ora dorită (${targetTime}), recomandăm plecarea la ${routeData.departureTime}.\nCondițiile meteo nu indică riscuri suplimentare.`

  const trafficAlerts = routeData.incidents.map((inc, index) => ({
    id: String(index + 1),
    type: inc.delay >= 7 ? ("danger" as const) : ("warning" as const),
    location: inc.location,
    detail: `+${inc.delay} min față de normal · Întârziere estimată pe tronson`,
  }))

  return {
    ...defaultInsights,
    weather: liveWeather || defaultInsights.weather,
    departure: {
      time: routeData.departureTime,
      minutesToLeave: routeData.minutesToLeave,
      durationMin: routeData.durationMin,
      distanceKm: routeData.distanceKm,
      trafficLevel: routeData.trafficLevel,
      originAddress: ctx.user.domiciliu || "București, Nițu Vasile 58",
      destinationAddress: ctx.officeAddress || OFFICE_ADDRESS,
      routeVia: routeData.routeSummary,
      aiExplanation: defaultExplanation,
      incidents: routeData.incidents,
    },
    trafficAlerts: trafficAlerts.length > 0 ? trafficAlerts : defaultInsights.trafficAlerts,
  }
}

export async function getAIInsightsData(ctx: InsightContext): Promise<AIInsightsData> {
  const origin = ctx.user.domiciliu || "București, Nițu Vasile 58"
  const destination = ctx.officeAddress || OFFICE_ADDRESS
  const targetTime = ctx.user.preferences.preferredStartTime || "15:00"

  // 1. Obținere date rutiere din Google Routes (calcul distanță, durată, întârzieri, incidente)
  const routeDataPromise = getRouteData(origin, destination, targetTime)
  const liveWeatherPromise = fetchLiveWeather().catch(() => defaultInsights.weather)

  const [routeData, liveWeather] = await Promise.all([routeDataPromise, liveWeatherPromise])

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

  if (!apiKey) {
    return calculateFallbackResult(ctx, routeData, liveWeather)
  }

  const modelName = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || DEFAULT_MODEL
  const requestUrl = `${GEMINI_API_BASE}/${modelName}:generateContent?key=${apiKey}`

  try {
    const promptText = buildPrompt(ctx, routeData, liveWeather)

    let res = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 1024 },
      }),
    })

    if (!res.ok && (res.status === 404 || res.status === 400)) {
      const fallbackModels = ["gemini-2.0-flash", "gemini-1.5-flash"]
      for (const fallbackModel of fallbackModels) {
        if (fallbackModel === modelName) continue
        const fallbackUrl = `${GEMINI_API_BASE}/${fallbackModel}:generateContent?key=${apiKey}`
        res = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 1024 },
          }),
        })
        if (res.ok) break
      }
    }

    if (!res.ok) {
      console.warn("[geminiService] Gemini API returned error:", res.status)
      return calculateFallbackResult(ctx, routeData, liveWeather)
    }

    const data = await res.json()
    const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return calculateFallbackResult(ctx, routeData, liveWeather)
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      explanation?: string
      trafficAlerts?: AIInsightsData["trafficAlerts"]
      seatRec?: AIInsightsData["seatRec"]
      history?: AIInsightsData["history"]
    }

    const fallbackResult = calculateFallbackResult(ctx, routeData, liveWeather)

    return {
      ...fallbackResult,
      trafficAlerts: parsed.trafficAlerts && parsed.trafficAlerts.length > 0
        ? parsed.trafficAlerts
        : fallbackResult.trafficAlerts,
      seatRec: parsed.seatRec || fallbackResult.seatRec,
      history: parsed.history || fallbackResult.history,
      departure: {
        ...fallbackResult.departure,
        aiExplanation: parsed.explanation || fallbackResult.departure.aiExplanation,
      },
    }
  } catch (error) {
    console.error("[geminiService] Error fetching Gemini insights:", error)
    return calculateFallbackResult(ctx, routeData, liveWeather)
  }
}

export async function calculateRouteInsights(context: InsightContext): Promise<AIInsightsData> {
  return getAIInsightsData({
    ...context,
    officeAddress: context.officeAddress || OFFICE_ADDRESS,
  })
}

export { OFFICE_ADDRESS }
