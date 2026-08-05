/**
 * weatherService.ts
 * Furnizează date meteorologice reale în timp real pentru București
 * folosind Open-Meteo API (gratuit, fără cheie API necesară).
 */

import type { WeatherInsight } from "@/types"

const WMO_CODE_MAP: Record<number, string> = {
  0: "Senin",
  1: "Predominant senin",
  2: "Parțial înnorat",
  3: "Înnorat",
  45: "Ceață",
  48: "Ceață cu depunere",
  51: "Burniță ușoară",
  53: "Burniță moderată",
  55: "Burniță densă",
  61: "Ploaie slabă",
  63: "Ploaie moderată",
  65: "Ploaie torențială",
  71: "Ninsoare slabă",
  73: "Ninsoare moderată",
  75: "Ninsoare puternică",
  80: "Averse slabe de ploaie",
  81: "Averse de ploaie",
  82: "Averse violente de ploaie",
  95: "Furtună cu descărcări",
  96: "Furtună cu grindină",
  99: "Furtună puternică cu grindină",
}

export async function fetchLiveWeather(
  latitude = 44.4323,
  longitude = 26.1063,
  city = "București",
): Promise<WeatherInsight> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=precipitation_probability&timezone=auto`
    const res = await fetch(url)
    
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`)
    }

    const data = await res.json()
    const current = data.current
    const currentHour = new Date().getHours()
    const rainChance =
      Array.isArray(data.hourly?.precipitation_probability) &&
      data.hourly.precipitation_probability[currentHour] !== undefined
        ? data.hourly.precipitation_probability[currentHour]
        : 10

    const code = current?.weather_code ?? 0
    const condition = WMO_CODE_MAP[code] || "Parțial înnorat"

    return {
      temp: Math.round(current?.temperature_2m ?? 22),
      condition,
      humidity: Math.round(current?.relative_humidity_2m ?? 70),
      windKmh: Math.round(current?.wind_speed_10m ?? 12),
      rainChance: Math.round(rainChance),
      city,
    }
  } catch (error) {
    console.warn("[weatherService] Nu s-au putut prelua datele live de vreme, folosim fallback:", error)
    return {
      temp: 24,
      condition: "Parțial înnorat",
      humidity: 65,
      windKmh: 12,
      rainChance: 10,
      city,
    }
  }
}
