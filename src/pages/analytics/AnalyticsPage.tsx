import { useEffect, useState, type ReactNode } from "react"
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ClipboardList, Presentation, Building2, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getAnalyticsDashboardData } from "@/services"
import type { AnalyticsDashboardData } from "@/types"

function KpiCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:h-12 sm:w-12">{icon}</div><div className="min-w-0"><p className="text-xl font-bold leading-tight text-foreground sm:text-2xl">{value}</p><p className="truncate text-xs text-muted-foreground sm:text-[13px]">{label}</p></div></div>
}

function WeeklyBookingsChart({ data, maxValue }: { data: AnalyticsDashboardData["weeklyBookings"]; maxValue: number }) {
  return <div className="h-[340px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}><CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" /><YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" domain={[0, Math.max(maxValue + 4, 20)]} /><Tooltip wrapperClassName="bg-card text-xs text-foreground shadow-lg" /><Legend wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }} /><Bar dataKey="officeBookings" name="Birouri" fill="var(--primary)" radius={[8, 8, 0, 0]} /><Bar dataKey="conferenceRoomBookings" name="Săli" fill="var(--warning)" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
}

function TopBookingList({ topBookings, totalBookings }: { topBookings: AnalyticsDashboardData["topBookings"]; totalBookings: number }) {
  const maxBookings = Math.max(...topBookings.map((entry) => entry.bookings), 1)
  return <div className="space-y-4"><div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-foreground">Top 5 utilizatori</h3><span className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Luna curentă</span></div>{topBookings.length === 0 ? <p className="text-sm text-muted-foreground">Nu există rezervări în această lună.</p> : <ul className="flex flex-col gap-4">{topBookings.map((entry, index) => { const percent = Math.round(entry.percent); const barWidth = Math.max(4, (entry.bookings / maxBookings) * 100); return <li key={`${entry.name}-${index}`}><div className="mb-1.5 flex items-baseline justify-between gap-2"><span className="text-sm font-bold text-foreground">{index + 1}. {entry.name}</span><span className="whitespace-nowrap text-xs text-muted-foreground">{entry.bookings} rezervări</span></div><div className="flex items-center gap-2.5"><div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${barWidth}%` }} /></div><span className="w-12 shrink-0 rounded-full bg-primary px-2 py-0.5 text-center text-[11px] font-bold text-primary-foreground">{percent}%</span></div></li> })}</ul>}<p className="border-t border-border pt-3 text-xs text-muted-foreground">Total: {totalBookings} rezervări</p></div>
}

const kpiIcons = { totalBookings: <ClipboardList className="h-5 w-5" />, roomOccupancy: <Presentation className="h-5 w-5" />, deskOccupancy: <Building2 className="h-5 w-5" />, peopleInOffice: <Users className="h-5 w-5" /> }

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  useEffect(() => { let active = true; getAnalyticsDashboardData().then((data) => { if (active) setAnalyticsData(data) }).catch((error) => { console.error("Eroare la încărcarea analiticelor:", error); if (active) setHasError(true) }).finally(() => { if (active) setIsLoading(false) }); return () => { active = false } }, [])

  if (isLoading) return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6 text-sm text-muted-foreground">Se încarcă datele pentru Analytics...</div>
  if (hasError || !analyticsData) return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6 text-sm text-destructive">Nu s-a putut încărca pagina Analytics. Încearcă din nou mai târziu.</div>

  const maxBookingValue = Math.max(...analyticsData.weeklyBookings.flatMap((item) => [item.officeBookings, item.conferenceRoomBookings]), 0)
  const totalBookings = Number(analyticsData.kpis.find((item) => item.id === "totalBookings")?.value ?? 0)
  return <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{analyticsData.kpis.map((kpi) => <KpiCard key={kpi.id} icon={kpiIcons[kpi.id as keyof typeof kpiIcons] ?? <ClipboardList className="h-5 w-5" />} value={kpi.value} label={kpi.label} />)}</div><div className="grid grid-cols-1 gap-5 lg:grid-cols-3"><Card className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2"><h3 className="mb-4 text-sm font-bold text-foreground">Bookings pe săptămână</h3><WeeklyBookingsChart data={analyticsData.weeklyBookings} maxValue={maxBookingValue} /></Card><Card className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"><TopBookingList topBookings={analyticsData.topBookings} totalBookings={totalBookings} /></Card></div></div>
}
