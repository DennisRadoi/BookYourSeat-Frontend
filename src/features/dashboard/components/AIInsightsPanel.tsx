import { Sparkles, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DepartureCard } from "./insights/DepartureCard"
import { WeatherWidgetCard } from "./insights/WeatherWidgetCard"
import { TrafficAlertsCard } from "./insights/TrafficAlertsCard"
import { SeatRecommendationCard } from "./insights/SeatRecommendationCard"
import { HistoryPreferencesCard } from "./insights/HistoryPreferencesCard"
import type { AIInsightsData } from "@/types"

interface AIInsightsPanelProps {
  insightsData: AIInsightsData
  isLoading: boolean
  onRefresh: () => void
  hasApiKey: boolean
  onReserveAdjacent?: () => void
}

export function AIInsightsPanel({
  insightsData,
  isLoading,
  onRefresh,
  hasApiKey,
  onReserveAdjacent,
}: AIInsightsPanelProps) {
  const { departure, weather, trafficAlerts, seatRec, history } = insightsData

  return (
    <Card className="overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)] rounded-2xl p-0 gap-0">
      <div className="flex items-center justify-between px-[18px] py-4 bg-[var(--primary)] text-[var(--primary-foreground)]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--card)] text-[var(--card-foreground)]">
            <Sparkles size={15} />
          </div>
          <span className="text-[15px] font-bold text-[var(--card-foreground)] tracking-[0.3px]">AI Insights</span>
        </div>
        <div className="flex items-center gap-2">
          {hasApiKey ? (
            <span className="flex items-center gap-1 rounded-full bg-[var(--card)] px-2 py-0.5 text-[10px] font-extrabold tracking-[1px] text-[var(--card-foreground)]">
              <span className="animate-blink h-1.5 w-1.5 rounded-full bg-[var(--card)]" />
              LIVE
            </span>
          ) : (
            <span className="rounded-full bg-[var(--card)] px-2 py-0.5 text-[10px] font-bold tracking-[1px] text-[var(--card-foreground)]">
              DEMO
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Regenerează insights"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--card)] text-[var(--card-foreground)] cursor-pointer border-0 transition hover:bg-[var(--sidebar-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <CardContent className="flex flex-col gap-2.5 p-3 bg-[var(--card)]">
        {isLoading ? (
          <div className="flex flex-col gap-2.5 py-1">
            <div className="animate-shimmer h-[72px] rounded-xl" />
            <div className="animate-shimmer animate-shimmer-delay-1 h-[72px] rounded-xl" />
            <div className="animate-shimmer animate-shimmer-delay-2 h-[60px] rounded-xl" />
            <p className="mt-1 text-center text-xs text-[var(--muted-foreground)]">Generez insights personalizate…</p>
          </div>
        ) : (
          <>
            <DepartureCard departure={departure} />
            <WeatherWidgetCard weather={weather} />
            <TrafficAlertsCard alerts={trafficAlerts} />
            <SeatRecommendationCard seatRec={seatRec} onReserveAdjacent={onReserveAdjacent} />
            <HistoryPreferencesCard history={history} />
          </>
        )}
      </CardContent>
    </Card>
  )
}
