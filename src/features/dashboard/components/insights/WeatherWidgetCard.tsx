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
    <div className="flex flex-col gap-2.5 rounded-xl border border-[#e5e7eb] bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{emoji}</span>
          <span className="text-[13px] font-bold text-[#1f2937]">Vreme live</span>
        </div>
        <span className="rounded-full bg-[#d1fae5] px-2 py-0.5 text-[10px] font-bold text-[#059669]">
          {weather.city} · Live
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[32px] font-extrabold leading-none text-[#1f2937]">{weather.temp}°C</span>
        <div className="flex flex-col gap-px">
          <span className="text-[13px] font-semibold text-[#1f2937]">{weather.condition}</span>
          <span className="text-[11px] text-[#6b7280]">Date meteorologice în timp real</span>
        </div>
      </div>
      <div className="flex rounded-xl bg-[#f3f4f6] px-2.5 py-2">
        {metrics.map(({ Icon, value, label }) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-0.5 text-[12px] font-semibold text-[#1f2937]">
            <Icon size={12} className="text-[#059669]" />
            <span>{value}</span>
            <span className="text-[10px] font-normal text-[#6b7280]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
