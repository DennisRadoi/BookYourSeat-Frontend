import { useEffect, useState, type ReactNode } from "react"
import { BarChart, Bar, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ClipboardList, Presentation, Building2, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getAnalyticsDashboardData } from "@/services"
import type { AnalyticsDashboardData } from "@/types"
 
interface KpiCardProps {
  icon: ReactNode
  value: string
  label: string
}
 
function KpiCard({ icon, value, label }: KpiCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:h-12 sm:w-12">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-tight text-foreground sm:text-2xl">{value}</p>
        <p className="truncate text-xs text-muted-foreground sm:text-[13px]">{label}</p>
      </div>
    </div>
  )
}
 
interface DonutSegment {
  label: string
  value: number
  color: string
}
 
interface ZoneDonutChartProps {
  segments: DonutSegment[]
}
 
const SIZE = 220
const RADIUS = 72
const STROKE = 28
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
 
function ZoneDonutChart({ segments }: ZoneDonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const normalizedTotal = total || 1
  let cumulative = 0
 
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-[260px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="mx-auto h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Birouri dupa zone"
        >
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            {segments.map((segment) => {
              const length = (segment.value / normalizedTotal) * CIRCUMFERENCE
              const dashArray = `${length} ${CIRCUMFERENCE - length}`
              const dashOffset = -cumulative
              cumulative += length
 
              return (
                <circle
                  key={segment.label}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                />
              )
            })}
          </g>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS - STROKE / 2} fill="var(--card)" />
        </svg>
 
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-foreground">{total}</span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Birouri</span>
        </div>
      </div>
 
      <ul className="grid w-full gap-3 text-xs text-muted-foreground">
        {segments.map((segment) => (
          <li key={segment.label} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate text-foreground">{segment.label}</span>
            </div>
            <span className="font-semibold text-foreground">{segment.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
 
interface WeeklyBookingsChartProps {
  data: AnalyticsDashboardData["weeklyBookings"]
  maxValue: number
}
 
function WeeklyBookingsChart({ data, maxValue }: WeeklyBookingsChartProps) {
  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="var(--muted-foreground)"
            domain={[0, Math.max(maxValue + 4, 20)]}
          />
          <Tooltip wrapperClassName="bg-card text-xs text-foreground shadow-lg" />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }} />
          <Bar dataKey="officeBookings" name="Birouri" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="conferenceRoomBookings" name="Săli" fill="var(--warning)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
 
interface OccupancyLineChartProps {
  data: AnalyticsDashboardData["occupancyTrend"]
  maxValue: number
}
 
function OccupancyLineChart({ data, maxValue }: OccupancyLineChartProps) {
  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="var(--muted-foreground)"
            domain={[0, Math.max(maxValue + 8, 100)]}
          />
          <Tooltip wrapperClassName="bg-card text-xs text-foreground shadow-lg" />
          <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
 
interface TopBookingListProps {
  topBookings: AnalyticsDashboardData["topBookings"]
  totalBookings: number
}
 
function TopBookingList({ topBookings, totalBookings }: TopBookingListProps) {
  if (topBookings.length === 0) {
    return (
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-foreground">Top bookings</h3>
          <span className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Total {totalBookings}
          </span>
        </div>
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
          Top bookings indisponibil momentan.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-foreground">Top bookings</h3>
        <span className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Total {totalBookings}
        </span>
      </div>
      <ul className="flex flex-col gap-4">
        {topBookings.map((entry, index) => (
          <li key={`${entry.name}-${index}`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-foreground">{entry.name}</span>
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {entry.seats} locuri
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${entry.percent}%` }}
                />
              </div>
              <span className="w-10 shrink-0 rounded-full bg-primary px-2 py-0.5 text-center text-[11px] font-bold text-primary-foreground">
                {entry.percent}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
 
const kpiIcons = {
  totalBookings: <ClipboardList className="h-5 w-5" />,
  roomOccupancy: <Presentation className="h-5 w-5" />,
  deskOccupancy: <Building2 className="h-5 w-5" />,
  peopleInOffice: <Users className="h-5 w-5" />,
}
 
export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
 
  useEffect(() => {
    let isMounted = true
 
    async function loadAnalytics() {
      try {
        const data = await getAnalyticsDashboardData()
        if (isMounted) {
          setAnalyticsData(data)
        }
      } catch (error) {
        console.error("Eroare la încărcarea analiticelor:", error)
        if (isMounted) {
          setHasError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
 
    loadAnalytics()
    return () => {
      isMounted = false
    }
  }, [])
 
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6 text-sm text-muted-foreground">
        Se încarcă datele pentru Analytics...
      </div>
    )
  }
 
  if (hasError || analyticsData === null) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6 text-sm text-destructive">
        Nu s-a putut încărca pagina Analytics. Încercați din nou mai târziu.
      </div>
    )
  }
 
  const totalBookings = analyticsData.weeklyBookings.reduce(
    (sum, item) => sum + item.officeBookings + item.conferenceRoomBookings,
    0,
  )
  const maxBookingValue = Math.max(
    ...analyticsData.weeklyBookings.flatMap((item) => [item.officeBookings, item.conferenceRoomBookings]),
    0,
  )
  const maxOccupancyValue = Math.max(...analyticsData.occupancyTrend.map((item) => item.value), 100)
 
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsData.kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            icon={kpiIcons[kpi.id as keyof typeof kpiIcons] ?? <ClipboardList className="h-5 w-5" />}
            value={kpi.value}
            label={kpi.label}
          />
        ))}
      </div>
 
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-foreground">Bookings pe săptămână</h3>
          <WeeklyBookingsChart data={analyticsData.weeklyBookings} maxValue={maxBookingValue} />
        </Card>
 
        <Card className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Birouri după zone</h3>
          <div className="min-h-[340px] w-full">
            <ZoneDonutChart segments={analyticsData.zoneSegments} />
          </div>
        </Card>
      </div>
 
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-foreground">Rată de ocupare</h3>
          <OccupancyLineChart data={analyticsData.occupancyTrend} maxValue={maxOccupancyValue} />
        </Card>
 
        <Card className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <TopBookingList topBookings={analyticsData.topBookings} totalBookings={totalBookings} />
        </Card>
      </div>
    </div>
  )
}

