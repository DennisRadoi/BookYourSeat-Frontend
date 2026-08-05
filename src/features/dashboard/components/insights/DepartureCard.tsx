import { Navigation, MapPin, Home, Building2, ArrowRight } from "lucide-react"
import type { DepartureInsight } from "@/types"

interface DepartureCardProps {
  departure: DepartureInsight
}

function getTrafficColor(level: string): string {
  if (level === "Scăzut") return "var(--success)"
  if (level === "Ridicat") return "var(--destructive)"
  return "var(--warning)"
}

function getArrivalTime(depTime: string, durationMin: number): string {
  const [h, m] = (depTime || "").split(":").map(Number)
  if (isNaN(h) || isNaN(m)) return "15:00"
  const date = new Date()
  date.setHours(h, m + (durationMin || 0), 0, 0)
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

export function DepartureCard({ departure }: DepartureCardProps) {
  const origin = departure.originAddress || "București, Nițu Vasile 58"
  const destination = departure.destinationAddress || "Aleea Țibleș 26, Sector 6 · București"
  const arrivalTime = getArrivalTime(departure.time, departure.durationMin)

  const stats = [
    { label: "Durată", value: `~${departure.durationMin} min` },
    { label: "Distanță", value: `${departure.distanceKm} km` },
    { label: "Trafic", value: `⚡ ${departure.trafficLevel}`, color: getTrafficColor(departure.trafficLevel) },
  ]

  const handleStartNavigation = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
    window.open(mapsUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-[var(--accent-card)] p-4 text-[var(--accent-card-foreground)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1px] text-[var(--accent-card-foreground)]/70">
          <Navigation size={12} className="text-[var(--success)]" /> RECOMANDARE PLECARE
        </div>
        <span className="rounded-full bg-[var(--accent-card-foreground)]/10 px-2 py-0.5 text-[9px] font-medium text-[var(--accent-card-foreground)]/80">
          Traseu AI
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[38px] font-extrabold leading-none tracking-[-1px] text-[var(--accent-card-foreground)]">
          {departure.time}
        </span>
        <span className="text-xs text-[var(--accent-card-foreground)]/70">ora recomandată</span>
      </div>

      {/* Route Addresses */}
      <div className="rounded-lg bg-[var(--accent-card-foreground)]/5 p-2.5 text-[11px] space-y-1.5 border border-[var(--accent-card-foreground)]/10">
        <div className="flex items-center gap-2 text-[var(--accent-card-foreground)]/90">
          <Home size={13} className="text-[var(--success)] shrink-0" />
          <span className="truncate">
            <strong className="font-semibold text-[var(--accent-card-foreground)]/70 text-[10px] uppercase block">Domiciliu:</strong>
            {origin}
          </span>
        </div>
        <div className="flex items-center gap-2 pl-4 text-[var(--muted-foreground)] text-[10px]">
          <ArrowRight size={10} className="shrink-0" />
          <span className="italic truncate">{departure.routeVia || "Ruta optimizată AI"}</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--accent-card-foreground)]/90">
          <Building2 size={13} className="text-[var(--primary)] shrink-0" />
          <span className="truncate">
            <strong className="font-semibold text-[var(--accent-card-foreground)]/70 text-[10px] uppercase block">Sediu birou:</strong>
            {destination}
          </span>
        </div>
      </div>

      <p className="text-xs leading-[1.5] text-[var(--accent-card-foreground)]/80">
        Pleacă în <strong className="text-[var(--accent-card-foreground)]">{departure.minutesToLeave} min</strong> pentru a ajunge la birou la ora <strong className="text-[var(--accent-card-foreground)]">{arrivalTime}</strong>.
      </p>

      <div className="flex items-center rounded-xl bg-[var(--accent-card-foreground)]/10 px-3 py-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] text-[var(--accent-card-foreground)]/60">{stat.label}</span>
            <span className="text-[13px] font-bold text-[var(--accent-card-foreground)]" style={stat.color ? { color: stat.color } : {}}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleStartNavigation}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] py-2.5 text-[13px] font-semibold text-[var(--primary-foreground)] border-0 cursor-pointer transition hover:bg-[var(--sidebar-accent-hover)] shadow-sm"
      >
        <MapPin size={14} /> Deschide traseul în Google Maps →
      </button>
    </div>
  )
}
