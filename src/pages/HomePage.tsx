import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  CalendarCheck, MapPin, Clock, Users, ChevronRight,
  Navigation, Wind, Droplets, CloudRain, AlertTriangle,
  MapPinned, TrendingUp, Sparkles, RefreshCw, Thermometer
} from "lucide-react"
import { getCurrentUser, getDetailedReservationsByUserId } from "@/services/mockApi"
import { getAIInsights, type InsightContext } from "@/services/geminiService"

// ─── helpers ────────────────────────────────────────────────
const DAY_LABELS_SHORT = ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"]
const DAY_LABELS_FULL  = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"]
const MONTH_LABELS = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function getWeekDays(from: Date): Date[] {
  const dow = from.getDay()
  const monday = new Date(from)
  monday.setDate(from.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function statusLabel(s: string) {
  switch (s) {
    case "confirmed":  return "Confirmat"
    case "pending":    return "În așteptare"
    case "completed":  return "Finalizat"
    case "cancelled":  return "Anulat"
    default:           return s
  }
}

function statusClass(s: string) {
  switch (s) {
    case "confirmed":  return "db-badge db-badge--green"
    case "pending":    return "db-badge db-badge--amber"
    case "completed":  return "db-badge db-badge--blue"
    case "cancelled":  return "db-badge db-badge--red"
    default:           return "db-badge"
  }
}

const COLLEAGUES = [
  { id: 2, initials: "AP", name: "Ana Popescu",    role: "UI/UX Designer",    color: "#2db874", floor: "Etaj 2" },
  { id: 3, initials: "MI", name: "Mihai Ionescu",  role: "Backend Developer", color: "#3b82f6", floor: "Etaj 1" },
  { id: 4, initials: "RB", name: "Ruxandra Bălan", role: "Product Manager",   color: "#8b5cf6", floor: "Etaj 1" },
  { id: 5, initials: "DR", name: "Denis Radu",     role: "QA Engineer",       color: "#f59e0b", floor: "Etaj 2" },
  { id: 6, initials: "AH", name: "Alina Hera",     role: "Data Analyst",      color: "#ec4899", floor: "Parter" },
]

// ─── AI Insights Panel — exact as in design ─────────────────
interface DepartureData {
  time: string
  minutesToLeave: number
  durationMin: number
  distanceKm: number
  trafficLevel: "Scăzut" | "Moderat" | "Ridicat"
}

interface WeatherData {
  temp: number
  condition: string
  humidity: number
  windKmh: number
  rainChance: number
  city: string
}

interface TrafficAlert {
  id: string
  type: "warning" | "danger"
  location: string
  detail: string
}

interface SeatRec {
  colleagueName: string
  seat: string
  floor: string
}

interface HistoryData {
  topFloor: string
  topArea: string
  reservationsThisMonth: number
}

interface InsightsData {
  departure: DepartureData
  weather: WeatherData
  trafficAlerts: TrafficAlert[]
  seatRec: SeatRec
  history: HistoryData
}

// Mock data that mirrors the image
const DEFAULT_INSIGHTS: InsightsData = {
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

function trafficColor(level: string) {
  if (level === "Scăzut") return "#2db874"
  if (level === "Ridicat") return "#ef4444"
  return "#f59e0b"
}

function AIInsightsPanel({
  data,
  loading,
  onRefresh,
  hasApiKey,
}: {
  data: InsightsData
  loading: boolean
  onRefresh: () => void
  hasApiKey: boolean
}) {
  const { departure, weather, trafficAlerts, seatRec, history } = data

  return (
    <div className="ai-panel">
      {/* ── Header ── */}
      <div className="ai-panel__header">
        <div className="ai-panel__header-left">
          <div className="ai-panel__icon">
            <Sparkles size={15} />
          </div>
          <span className="ai-panel__title">AI Insights</span>
        </div>
        <div className="ai-panel__header-right">
          <span className={hasApiKey ? "ai-panel__live-badge" : "ai-panel__demo-badge"}>
            {hasApiKey ? "LIVE" : "DEMO"}
          </span>
          <button
            className={`ai-panel__refresh ${loading ? "ai-panel__refresh--spinning" : ""}`}
            onClick={onRefresh}
            disabled={loading}
            aria-label="Regenerează"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="ai-panel__body">
          <div className="ai-panel__loading">
            <div className="ai-panel__pulse" />
            <div className="ai-panel__pulse ai-panel__pulse--2" />
            <div className="ai-panel__pulse ai-panel__pulse--3" />
            <p className="ai-panel__loading-text">Generez insights personalizate…</p>
          </div>
        </div>
      ) : (
        <div className="ai-panel__body">

          {/* ── 1. RECOMANDARE PLECARE ── */}
          <div className="ai-departure-card">
            <div className="ai-departure-card__label">
              <Navigation size={12} />
              RECOMANDARE PLECARE
            </div>
            <div className="ai-departure-card__time-row">
              <span className="ai-departure-card__time">{departure.time}</span>
              <span className="ai-departure-card__time-label">ora recomandată</span>
            </div>
            <p className="ai-departure-card__desc">
              Bazat pe traficul actual și prognoza vremii, pleacă în{" "}
              <strong>{departure.minutesToLeave} min</strong> pentru a ajunge la birou la 9:00.
            </p>
            <div className="ai-departure-card__stats">
              <div className="ai-departure-stat">
                <span className="ai-departure-stat__label">Durată</span>
                <span className="ai-departure-stat__value">~{departure.durationMin} min</span>
              </div>
              <div className="ai-departure-stat__divider" />
              <div className="ai-departure-stat">
                <span className="ai-departure-stat__label">Mile</span>
                <span className="ai-departure-stat__value">{departure.distanceKm} km</span>
              </div>
              <div className="ai-departure-stat__divider" />
              <div className="ai-departure-stat">
                <span className="ai-departure-stat__label">Trafic</span>
                <span
                  className="ai-departure-stat__value"
                  style={{ color: trafficColor(departure.trafficLevel) }}
                >
                  ⚡ {departure.trafficLevel}
                </span>
              </div>
            </div>
            <button className="ai-departure-card__nav-btn">
              <Navigation size={13} />
              Pornește navigația →
            </button>
          </div>

          {/* ── 2. VREME AZI ── */}
          <div className="ai-widget-card">
            <div className="ai-widget-card__header">
              <div className="ai-widget-card__header-left">
                <span className="ai-widget-card__icon">🌤</span>
                <span className="ai-widget-card__title">Vreme azi</span>
              </div>
              <span className="ai-widget-card__badge">{weather.city}</span>
            </div>
            <div className="ai-weather__main">
              <span className="ai-weather__temp">{weather.temp}°</span>
              <div className="ai-weather__cond-col">
                <span className="ai-weather__cond">{weather.condition}</span>
                <span className="ai-weather__range">Max 31 · Min 16</span>
              </div>
            </div>
            <div className="ai-weather__stats">
              <div className="ai-weather-stat">
                <Droplets size={12} />
                <span>{weather.humidity}%</span>
                <span className="ai-weather-stat__label">Umiditate</span>
              </div>
              <div className="ai-weather-stat">
                <Wind size={12} />
                <span>{weather.windKmh} km/h</span>
                <span className="ai-weather-stat__label">Vânt</span>
              </div>
              <div className="ai-weather-stat">
                <CloudRain size={12} />
                <span>{weather.rainChance}%</span>
                <span className="ai-weather-stat__label">Ploaie</span>
              </div>
            </div>
          </div>

          {/* ── 3. ALERTE TRAFIC ── */}
          <div className="ai-widget-card">
            <div className="ai-widget-card__header">
              <div className="ai-widget-card__header-left">
                <span className="ai-widget-card__icon">⚠️</span>
                <span className="ai-widget-card__title">Alerte trafic</span>
              </div>
              <span className="ai-traffic__count">{trafficAlerts.length} alerte</span>
            </div>
            <div className="ai-traffic__alerts">
              {trafficAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`ai-traffic-alert ai-traffic-alert--${alert.type}`}
                >
                  <AlertTriangle size={13} className="ai-traffic-alert__icon" />
                  <div className="ai-traffic-alert__text">
                    <span className="ai-traffic-alert__loc">{alert.location}</span>
                    <span className="ai-traffic-alert__detail">{alert.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. RECOMANDARE LOC ── */}
          <div className="ai-widget-card">
            <div className="ai-widget-card__header">
              <div className="ai-widget-card__header-left">
                <span className="ai-widget-card__icon-circle">
                  <MapPinned size={13} />
                </span>
                <span className="ai-widget-card__title">Recomandare loc</span>
              </div>
            </div>
            <p className="ai-seat-rec__desc">
              <strong>{seatRec.colleagueName}</strong> a rezervat {seatRec.seat}, {seatRec.floor}.
              Vrei un loc alături?
            </p>
            <button className="ai-seat-rec__btn">
              <MapPin size={13} />
              Rezervă loc alături
            </button>
          </div>

          {/* ── 5. ISTORIC + PREFERINȚE ── */}
          <div className="ai-widget-card">
            <div className="ai-widget-card__header">
              <div className="ai-widget-card__header-left">
                <span className="ai-widget-card__icon-circle ai-widget-card__icon-circle--blue">
                  <TrendingUp size={13} />
                </span>
                <span className="ai-widget-card__title">Istoric + preferințe</span>
              </div>
            </div>
            <p className="ai-history__desc">
              Cel mai des rezervi la <strong>{history.topFloor}</strong>,{" "}
              <strong>{history.topArea}</strong>:{" "}
              <strong>{history.reservationsThisMonth} rezervări</strong> luna aceasta.
            </p>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ─────────────────────────────────────────
export default function HomePage() {
  const navigate   = useNavigate()
  const today      = new Date()
  const weekDays   = getWeekDays(today)
  const todayStr   = formatDate(today)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser]                   = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reservations, setReservations]   = useState<any[]>([])
  const [insightsData, setInsightsData]   = useState<InsightsData>(DEFAULT_INSIGHTS)
  const [aiLoading, setAiLoading]         = useState(false)
  const [selectedDay, setSelectedDay]     = useState(todayStr)

  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY

  // Load user + reservations
  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      return getDetailedReservationsByUserId(u.id)
    }).then(setReservations)
  }, [])

  // Fetch AI insights (Gemini) for the departure card text
  const fetchInsights = useCallback(async () => {
    if (!user) return
    setAiLoading(true)
    try {
      const ctx: InsightContext = {
        user: {
          firstName:   user.firstName,
          lastName:    user.lastName,
          role:        user.role,
          department:  user.department,
          preferences: user.preferences,
        },
        reservations: reservations.map((r) => ({
          date: r.date, startTime: r.startTime, endTime: r.endTime,
          status: r.status, seat: r.seat, floor: r.floor, location: r.location,
        })),
        colleaguesInOfficeToday: COLLEAGUES.length,
        totalColleagues: 30,
        currentDate: today.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" }),
        currentTime: today.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
      }
      // Call Gemini — returns structured insights; we use them to update departure/seat desc
      await getAIInsights(ctx)
      // For now we keep the structured mock data but update the departure time dynamically
      const now   = new Date()
      const leave = new Date(now.getTime() + 23 * 60 * 1000)
      const hh    = String(leave.getHours()).padStart(2, "0")
      const mm    = String(leave.getMinutes()).padStart(2, "0")
      setInsightsData((prev) => ({
        ...prev,
        departure: { ...prev.departure, time: `${hh}:${mm}` },
      }))
    } finally {
      setAiLoading(false)
    }
  }, [user, reservations])

  useEffect(() => {
    if (user) fetchInsights()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const dayReservations = reservations.filter((r) => r.date === selectedDay)
  const myUpcoming = reservations
    .filter((r) => r.date >= todayStr && r.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  return (
    <div className="dashboard-layout">
      {/* ── LEFT COLUMN ─────────────────────────────── */}
      <div className="dashboard-main">

        {/* Weekly calendar */}
        <section className="db-card">
          <div className="db-card__header">
            <h2 className="db-card__title">Rezervări viitoare</h2>
            <span className="db-card__meta">
              {MONTH_LABELS[today.getMonth()]} {today.getFullYear()}
            </span>
          </div>

          <div className="db-week">
            {weekDays.map((day) => {
              const ds        = formatDate(day)
              const isToday   = ds === todayStr
              const isSelected = ds === selectedDay
              const hasDot    = reservations.some((r) => r.date === ds)
              return (
                <button
                  key={ds}
                  className={`db-day-btn${isToday ? " db-day-btn--today" : ""}${isSelected ? " db-day-btn--selected" : ""}`}
                  onClick={() => setSelectedDay(ds)}
                >
                  <span className="db-day-btn__label">{DAY_LABELS_SHORT[day.getDay()]}</span>
                  <span className="db-day-btn__num">{day.getDate()}</span>
                  {hasDot && <span className="db-day-btn__dot" />}
                </button>
              )
            })}
          </div>

          {dayReservations.length === 0 ? (
            <div className="db-empty">
              <MapPin size={18} />
              <span>Nicio rezervare pentru {DAY_LABELS_FULL[new Date(selectedDay + "T12:00:00").getDay()]}</span>
              <button className="db-cta-btn" onClick={() => navigate("/seats")}>
                <CalendarCheck size={15} /> Rezervă un loc
              </button>
            </div>
          ) : (
            <div className="db-res-list">
              {dayReservations.map((r) => (
                <div key={r.id} className="db-res-item">
                  <div className="db-res-item__left">
                    <div className="db-res-item__date">
                      <span className="db-res-item__month">{MONTH_LABELS[new Date(selectedDay + "T12:00:00").getMonth()]}</span>
                      <span className="db-res-item__day">{new Date(selectedDay + "T12:00:00").getDate()}</span>
                    </div>
                    <div className="db-res-item__info">
                      <span className="db-res-item__seat">{r.seat?.code ?? "—"} · {r.floor?.name ?? "—"}</span>
                      <span className="db-res-item__time"><Clock size={12} />{r.startTime}–{r.endTime}</span>
                    </div>
                  </div>
                  <span className={statusClass(r.status)}>{statusLabel(r.status)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My upcoming reservations */}
        <section className="db-card">
          <div className="db-card__header">
            <h2 className="db-card__title">Rezervările mele</h2>
            <button className="db-link-btn" onClick={() => navigate("/seats")}>
              Vezi toate <ChevronRight size={14} />
            </button>
          </div>

          {myUpcoming.length === 0 ? (
            <div className="db-empty">
              <CalendarCheck size={18} />
              <span>Nu ai rezervări viitoare</span>
              <button className="db-cta-btn" onClick={() => navigate("/seats")}>
                <CalendarCheck size={15} /> Rezervă acum
              </button>
            </div>
          ) : (
            <div className="db-res-list">
              {myUpcoming.map((r) => (
                <div key={r.id} className="db-res-item">
                  <div
                    className="db-res-item__accent-bar"
                    style={{ background: r.status === "confirmed" ? "var(--sidebar-accent)" : r.status === "pending" ? "#f59e0b" : "#3b82f6" }}
                  />
                  <div className="db-res-item__left" style={{ marginLeft: 8 }}>
                    <div className="db-res-item__date">
                      <span className="db-res-item__month">{MONTH_LABELS[new Date(r.date + "T12:00:00").getMonth()]}</span>
                      <span className="db-res-item__day">{new Date(r.date + "T12:00:00").getDate()}</span>
                    </div>
                    <div className="db-res-item__info">
                      <span className="db-res-item__seat">{r.floor?.name ?? "—"} · Loc {r.seat?.code ?? "—"}</span>
                      <span className="db-res-item__time">
                        <Clock size={12} />{r.startTime}–{r.endTime}
                        {r.location && <> · {r.location.name}</>}
                      </span>
                    </div>
                  </div>
                  <span className={statusClass(r.status)}>{statusLabel(r.status)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Colleagues in office */}
        <section className="db-card">
          <div className="db-card__header">
            <h2 className="db-card__title">Colegi favoriți</h2>
            <button className="db-link-btn" onClick={() => navigate("/companie")}>
              <span style={{ color: "var(--sidebar-accent)" }}>+ Adaugă</span>
            </button>
          </div>

          <div className="db-colleagues">
            {COLLEAGUES.slice(0, 3).map((c) => (
              <div key={c.id} className="db-colleague">
                <div className="db-colleague__avatar" style={{ background: c.color }}>
                  {c.initials}
                </div>
                <div className="db-colleague__info">
                  <span className="db-colleague__name">{c.name}</span>
                  <span className="db-colleague__meta">9 · {c.floor}</span>
                </div>
                <button className="db-colleague__action">La birou</button>
              </div>
            ))}
          </div>

          <button className="db-invite-btn" onClick={() => navigate("/companie")}>
            <Users size={14} /> Invită un coleg
          </button>
        </section>
      </div>

      {/* ── RIGHT COLUMN — AI Insights ─────────────── */}
      <div className="dashboard-aside">
        <AIInsightsPanel
          data={insightsData}
          loading={aiLoading}
          onRefresh={fetchInsights}
          hasApiKey={hasApiKey}
        />
      </div>
    </div>
  )
}
