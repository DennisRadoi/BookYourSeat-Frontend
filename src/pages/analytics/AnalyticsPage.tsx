import { ClipboardList, Presentation, Building2, Users } from "lucide-react"
import { KpiCard } from "./components/KpiCard"
import { WeeklyBookingsChart } from "./components/WeeklyBookingsChart"
import { ZoneDonutChart } from "./components/ZoneDonutChart"
import { OccupancyLineChart } from "./components/OccupancyLineChart"
import { TopBookingsList } from "./components/TopBookingList"

const weeklyBookings = [
  { day: "Luni", birouri: 16, sali: 4 },
  { day: "Marti", birouri: 28, sali: 10 },
  { day: "Miercuri", birouri: 8, sali: 2 },
  { day: "Joi", birouri: 36, sali: 8 },
  { day: "Vineri", birouri: 6, sali: 1 },
]

const zoneSegments = [
  { label: "Langa fereastra", value: 24, color: "var(--chart-1)" },
  { label: "Zona linistita", value: 38, color: "var(--chart-2)" },
  { label: "Alt filtru", value: 25, color: "var(--chart-3)" },
]

const occupancyRate = [
  { label: "W1", value: 45 },
  { label: "W2", value: 99 },
  { label: "W3", value: 62 },
  { label: "W4", value: 73 },
  { label: "W5", value: 98 },
  { label: "W6", value: 10 },
]

const topBookings = [
  { name: "George", seats: 10, percent: 87 },
  { name: "Anna", seats: 8, percent: 50 },
  { name: "Claudiu", seats: 6, percent: 45 },
  { name: "George", seats: 10, percent: 87 },
  { name: "George", seats: 10, percent: 87 },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={<ClipboardList className="h-5 w-5" />} value="12" label="Bookings" />
        <KpiCard icon={<Presentation className="h-5 w-5" />} value="55%" label="Ocupare sali conferinta" />
        <KpiCard icon={<Building2 className="h-5 w-5" />} value="70%" label="Ocupare birouri" />
        <KpiCard icon={<Users className="h-5 w-5" />} value="10" label="Persoane in birou" />
      </div>

      {/* Bookings pe saptamana + Birouri dupa zone */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-foreground">Bookings pe saptamana</h3>
          <WeeklyBookingsChart data={weeklyBookings} maxValue={40} />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Birouri dupa zone</h3>
          <ZoneDonutChart segments={zoneSegments} />
        </div>
      </div>

      {/* Rata ocupare + Top bookings */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-foreground">Rata ocupare</h3>
          <OccupancyLineChart data={occupancyRate} maxValue={100} />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Top bookings</h3>
          <TopBookingsList entries={topBookings} />
        </div>
      </div>
    </div>
  )
}
