import { Navigation } from "lucide-react"
import type { DepartureInsight } from "@/types"

interface DepartureCardProps {
  departure: DepartureInsight
}

function getTrafficColor(level: string): string {
  if (level === "Scăzut") return "#10b981"
  if (level === "Ridicat") return "#ef4444"
  return "#f59e0b"
}

export function DepartureCard({ departure }: DepartureCardProps) {
  const stats = [
    { label: "Durată", value: `~${departure.durationMin} min` },
    { label: "Distanță", value: `${departure.distanceKm} km` },
    { label: "Trafic", value: `⚡ ${departure.trafficLevel}`, color: getTrafficColor(departure.trafficLevel) },
  ]

  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-[#1f2937] p-4 text-white">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1px] text-white/70">
        <Navigation size={12} className="text-[#10b981]" /> RECOMANDARE PLECARE
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[38px] font-extrabold leading-none tracking-[-1px] text-white">
          {departure.time}
        </span>
        <span className="text-xs text-white/70">ora recomandată</span>
      </div>
      <p className="text-xs leading-[1.5] text-white/80">
        Bazat pe traficul actual și prognoza vremii, pleacă în{" "}
        <strong className="text-white">{departure.minutesToLeave} min</strong>{" "}
        pentru a ajunge la birou la 9:00.
      </p>
      <div className="flex items-center rounded-xl bg-white/10 px-3 py-2.5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] text-white/60">{stat.label}</span>
            <span className="text-[13px] font-bold text-white" style={stat.color ? { color: stat.color } : {}}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
      <button className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#059669] py-2.5 text-[13px] font-semibold text-white border-0 cursor-pointer transition hover:bg-[#047857] shadow-sm">
        <Navigation size={13} /> Pornește navigația →
      </button>
    </div>
  )
}
