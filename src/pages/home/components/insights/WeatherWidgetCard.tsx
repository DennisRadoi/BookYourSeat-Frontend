import { Droplets, Wind, CloudRain } from "lucide-react"
import type { WeatherInsight } from "@/types"

interface WeatherWidgetCardProps {
  weather: WeatherInsight
}

function getWeatherEmoji(condition: string): string {
  const cond = (condition || "").toLowerCase()
  if (cond.includes("furtun")) return "⛈️"
  if (cond.includes("ploi") || cond.includes("avers") || cond.includes("burni")) return "🌧️"
  if (cond.includes("nins")) return "❄️"
  if (cond.includes("ceat") || cond.includes("ceață")) return "🌫️"
  if (cond.includes("parțial") || cond.includes("innorat") || cond.includes("înnorat")) return "⛅"
  if (cond.includes("senin")) return "☀️"
  return "🌤️"
}

export function WeatherWidgetCard({ weather }: WeatherWidgetCardProps) {
  const metrics = [
    { Icon: Droplets, value: `${weather.humidity}%`, label: "Umiditate" },
    { Icon: Wind, value: `${weather.windKmh} km/h`, label: "Vânt" },
    { Icon: CloudRain, value: `${weather.rainChance}%`, label: "Ploaie" },
  ]

  const emoji = getWeatherEmoji(weather.condition)

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{emoji}</span>
          <span className="text-[13px] font-bold text-[var(--foreground)]">Vreme live</span>
        </div>
        <span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--secondary-foreground)]">
          {weather.city} · Live
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[32px] font-extrabold leading-none text-[var(--foreground)]">{weather.temp}°C</span>
        <div className="flex flex-col gap-px">
          <span className="text-[13px] font-semibold text-[var(--foreground)]">{weather.condition}</span>
          <span className="text-[11px] text-[var(--muted-foreground)]">Date meteorologice în timp real</span>
        </div>
      </div>
      <div className="flex rounded-xl bg-[var(--muted)] px-2.5 py-2">
        {metrics.map(({ Icon, value, label }) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-0.5 text-[12px] font-semibold text-[var(--foreground)]">
            <Icon size={12} className="text-[var(--primary)]" />
            <span>{value}</span>
            <span className="text-[10px] font-normal text-[var(--muted-foreground)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
