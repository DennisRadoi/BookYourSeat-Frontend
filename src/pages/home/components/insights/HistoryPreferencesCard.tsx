import { TrendingUp } from "lucide-react"
import type { HistoryInsight } from "@/types"

interface HistoryPreferencesCardProps {
  history: HistoryInsight
}

export function HistoryPreferencesCard({ history }: HistoryPreferencesCardProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <div className="flex items-center gap-1.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)]">
          <TrendingUp size={13} />
        </div>
        <span className="text-[13px] font-bold text-[var(--foreground)]">Istoric + preferințe</span>
      </div>
      <p className="text-[12px] leading-[1.5] text-[var(--foreground)]">
        Cel mai des rezervi la <strong>{history.topFloor}</strong>,{" "}
        <strong>{history.topArea}</strong>:{" "}
        <strong>{history.reservationsThisMonth} rezervări</strong> luna aceasta.
      </p>
    </div>
  )
}
