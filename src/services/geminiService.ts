/**
 * geminiService.ts
 * Apelează Gemini 2.0 Flash API pentru a genera AI Insights
 * pe baza datelor utilizatorului (rezervări, preferințe, colegi).
 *
 * Configurare: adaugă în .env la rădăcina proiectului:
 *   VITE_GEMINI_API_KEY=AIza...
 */

export interface AIInsight {
  id: string
  icon: string           // emoji icon
  category: string       // "Recomandare" | "Pattern" | "Alertă" | "Sfat" | "Colegi"
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
    preferences: {
      preferredFloor: number
      preferredArea: string
      preferredDays: string[]
      workPreferences: string[]
    }
  }
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

// ────────────────────────────────────────────────────────────
// Mock fallback — folosit când nu există API key
// ────────────────────────────────────────────────────────────
const MOCK_INSIGHTS: AIInsight[] = [
  {
    id: "1",
    icon: "📍",
    category: "Recomandare",
    title: "Loc recomandat pentru mâine",
    description:
      "Pe baza preferințelor tale (fereastră, Etaj 1), locul A-101 este disponibil și se potrivește perfect. Ana P. va fi și ea la birou.",
    accent: "green",
  },
  {
    id: "2",
    icon: "📊",
    category: "Pattern",
    title: "Obiceiuri de rezervare",
    description:
      "Rezervezi cel mai des marțea și miercurea, între 09:00–18:00. Prezența ta în birou este cu 20% mai mare decât media echipei.",
    accent: "blue",
  },
  {
    id: "3",
    icon: "👥",
    category: "Colegi",
    title: "Echipa ta azi",
    description:
      "12 din 30 de colegi sunt la birou astăzi. Mihai I. și Ana P. sunt deja prezenți la Etaj 1 — zona ta preferată.",
    accent: "green",
  },
  {
    id: "4",
    icon: "💡",
    category: "Sfat",
    title: "Optimizare program",
    description:
      "Traficul spre Bulevardul Unirii 10 este mai redus înainte de 08:30. O plecare mai devreme cu 15 min îți economisește ~20 min.",
    accent: "amber",
  },
]

// ────────────────────────────────────────────────────────────
// Gemini API call
// ────────────────────────────────────────────────────────────
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

function buildPrompt(ctx: InsightContext): string {
  return `Ești un asistent inteligent pentru o aplicație de rezervare locuri la birou (Book Your Seat).
  
Context utilizator:
- Nume: ${ctx.user.firstName} ${ctx.user.lastName}
- Rol: ${ctx.user.role}, Departament: ${ctx.user.department}
- Etaj preferat: ${ctx.user.preferences.preferredFloor}
- Zonă preferată: ${ctx.user.preferences.preferredArea}
- Zile preferate: ${ctx.user.preferences.preferredDays.join(", ")}
- Preferințe lucru: ${ctx.user.preferences.workPreferences.join(", ")}

Rezervări recente:
${ctx.reservations
  .map(
    (r) =>
      `- ${r.date} ${r.startTime}-${r.endTime}, ${r.floor?.name ?? "?"}, loc ${r.seat?.code ?? "?"} (${r.seat?.area ?? "?"}), status: ${r.status}`
  )
  .join("\n")}

Situație birou azi (${ctx.currentDate}, ora ${ctx.currentTime}):
- ${ctx.colleaguesInOfficeToday} din ${ctx.totalColleagues} colegi sunt prezenți

Generează exact 4 insights personalizate și utile pentru acest utilizator.
Răspunde DOAR cu un JSON valid, fără text extra, în formatul:
[
  {
    "id": "1",
    "icon": "<emoji>",
    "category": "<Recomandare|Pattern|Alertă|Sfat|Colegi>",
    "title": "<titlu scurt max 6 cuvinte>",
    "description": "<descriere 1-2 propoziții utile și specifice>",
    "accent": "<green|blue|amber|red>"
  }
]

Regulile pentru "accent": green=positiv/recomandare, blue=informație/pattern, amber=atenție/sfat, red=alertă urgentă.
Scrie totul în limba română. Fii specific și personalizat, nu generic.`
}

export async function getAIInsights(ctx: InsightContext): Promise<AIInsight[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

  // Fără cheie → fallback mock
  if (!apiKey) {
    console.info("[geminiService] No API key found — using mock insights.")
    await new Promise((r) => setTimeout(r, 900)) // simulare delay
    return MOCK_INSIGHTS
  }

  const body = {
    contents: [
      {
        parts: [{ text: buildPrompt(ctx) }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  }

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    console.error("[geminiService] API error:", res.status, res.statusText)
    return MOCK_INSIGHTS
  }

  const data = await res.json()
  const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

  // Extrage JSON din răspuns (poate fi înconjurat de ```json ... ```)
  const jsonMatch = raw.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    console.error("[geminiService] Could not parse JSON from response:", raw)
    return MOCK_INSIGHTS
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as AIInsight[]
    return parsed
  } catch (e) {
    console.error("[geminiService] JSON parse error:", e)
    return MOCK_INSIGHTS
  }
}
