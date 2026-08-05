import { Droplets, Wind, CloudRain } from "lucide-react"
import type { WeatherInsight } from "@/types"

interface WeatherWidgetCardProps {
  weather: WeatherInsight
}

export function WeatherWidgetCard({ weather }: WeatherWidgetCardProps) {
  const metrics = [
    { Icon: Droplets, value: `${weather.humidity}%`, label: "Umiditate" },
    { Icon: Wind, value: `${weather.windKmh} km/h`, label: "Vânt" },
    { Icon: CloudRain, value: `${weather.rainChance}%`, label: "Ploaie" },
  ]

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[#e5e7eb] bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">🌤</span>
          <span className="text-[13px] font-bold text-[#1f2937]">Vreme azi</span>
        </div>
        <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-semibold text-[#6b7280]">
          {weather.city}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[32px] font-extrabold leading-none text-[#1f2937]">{weather.temp}°</span>
        <div className="flex flex-col gap-px">
          <span className="text-[13px] font-semibold text-[#1f2937]">{weather.condition}</span>
          <span className="text-[11px] text-[#6b7280]">Max 31° · Min 16°</span>
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
