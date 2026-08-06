import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Building2, ClipboardList, Presentation, Users } from "lucide-react"
import { AnalyticsPanelCard } from "./components/AnalyticsPanelCard"
import { KpiCard } from "./components/KpiCard"
import { getAnalyticsDashboardData } from "@/services"
import type { AnalyticsDashboardData } from "@/types"

const kpiIcons = {
  totalBookings: <ClipboardList className="h-5 w-5" />,
  roomOccupancy: <Presentation className="h-5 w-5" />,
  deskOccupancy: <Building2 className="h-5 w-5" />,
  peopleInOffice: <Users className="h-5 w-5" />,
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboardData | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true
    getAnalyticsDashboardData().then((data) => { if (active) setAnalyticsData(data) }).catch((error) => { console.error("Eroare la încărcarea analiticelor:", error); if (active) setHasError(true) })
    return () => { active = false }
  }, [])

  const totalBookings = useMemo(() => analyticsData?.weeklyBookings.reduce((sum, item) => sum + item.officeBookings + item.conferenceRoomBookings, 0) ?? 0, [analyticsData])
  if (!analyticsData && !hasError) return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6 text-sm text-muted-foreground">Se încarcă datele pentru Analytics…</div>
  if (hasError || !analyticsData) return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6 text-sm text-destructive">Nu s-a putut încărca pagina Analytics. Încearcă din nou mai târziu.</div>

  const maxBookings = Math.max(...analyticsData.weeklyBookings.flatMap((item) => [item.officeBookings, item.conferenceRoomBookings]), 0)
  const maxOccupancy = Math.max(...analyticsData.occupancyTrend.map((item) => item.value), 100)
  const totalZones = analyticsData.zoneSegments.reduce((sum, segment) => sum + segment.value, 0)
  let cumulative = 0

  return <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{analyticsData.kpis.map((kpi) => <KpiCard key={kpi.id} icon={kpiIcons[kpi.id as keyof typeof kpiIcons] ?? <ClipboardList className="h-5 w-5" />} value={kpi.value} label={kpi.label} />)}</div>
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <AnalyticsPanelCard title="Bookings pe săptămână" className="lg:col-span-2"><div className="h-[340px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={analyticsData.weeklyBookings} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}><CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" /><YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" domain={[0, Math.max(maxBookings + 4, 20)]} /><Tooltip wrapperClassName="text-xs" /><Legend wrapperStyle={{ fontSize: 12 }} /><Bar dataKey="officeBookings" name="Birouri" fill="var(--primary)" radius={[8, 8, 0, 0]} /><Bar dataKey="conferenceRoomBookings" name="Săli" fill="var(--warning)" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></AnalyticsPanelCard>
      <AnalyticsPanelCard title="Birouri după zone"><div className="flex flex-col items-center gap-6"><div className="relative w-full max-w-[260px]"><svg viewBox="0 0 220 220" className="mx-auto h-auto w-full" role="img" aria-label="Birouri după zone"><g transform="rotate(-90 110 110)">{analyticsData.zoneSegments.map((segment) => { const length = segment.value / Math.max(totalZones, 1) * (2 * Math.PI * 72); const offset = -cumulative; cumulative += length; return <circle key={segment.label} cx="110" cy="110" r="72" fill="none" stroke={segment.color} strokeWidth="28" strokeDasharray={`${length} ${2 * Math.PI * 72 - length}`} strokeDashoffset={offset} /> })}</g><circle cx="110" cy="110" r="58" fill="var(--card)" /></svg><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"><span className="text-3xl font-bold text-foreground">{totalZones}</span><span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Birouri</span></div></div><ul className="grid w-full gap-3 text-xs">{analyticsData.zoneSegments.map((segment) => <li key={segment.label} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-3 py-2"><span className="flex items-center gap-2 text-foreground"><i className="size-2.5 rounded-full" style={{ backgroundColor: segment.color }} />{segment.label}</span><strong>{segment.value}</strong></li>)}</ul></div></AnalyticsPanelCard>
    </div>
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <AnalyticsPanelCard title="Rată de ocupare" className="lg:col-span-2"><div className="h-[340px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={analyticsData.occupancyTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}><CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" /><YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" domain={[0, Math.max(maxOccupancy + 8, 100)]} /><Tooltip wrapperClassName="text-xs" /><Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div></AnalyticsPanelCard>
      <AnalyticsPanelCard title="Top bookings"><div className="mb-4 flex items-center justify-end"><span className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Total {totalBookings}</span></div><ul className="flex flex-col gap-4">{analyticsData.topBookings.map((entry) => <li key={entry.name}><div className="mb-1.5 flex items-baseline justify-between gap-2"><strong className="text-sm">{entry.name}</strong><span className="text-xs text-muted-foreground">{entry.seats} locuri</span></div><div className="flex items-center gap-2.5"><div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${entry.percent}%` }} /></div><span className="w-10 rounded-full bg-primary px-2 py-0.5 text-center text-[11px] font-bold text-primary-foreground">{entry.percent}%</span></div></li>)}</ul></AnalyticsPanelCard>
    </div>
  </div>
}
