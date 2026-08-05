import { MapPin, MapPinned } from "lucide-react"
import type { SeatRecommendation } from "@/types"

interface SeatRecommendationCardProps {
  seatRec: SeatRecommendation
  onReserveAdjacent?: () => void
}

export function SeatRecommendationCard({
  seatRec,
  onReserveAdjacent,
}: SeatRecommendationCardProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <div className="flex items-center gap-1.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)]">
          <MapPinned size={13} />
        </div>
        <span className="text-[13px] font-bold text-[var(--foreground)]">Recomandare loc</span>
      </div>
      <p className="text-[12px] leading-[1.5] text-[var(--foreground)]">
        <strong>{seatRec.colleagueName}</strong> a rezervat {seatRec.seat}, {seatRec.floor}.
        Vrei un loc alături?
      </p>
      <button
        onClick={onReserveAdjacent}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--secondary)] py-2.5 text-[12px] font-semibold text-[var(--secondary-foreground)] border-0 cursor-pointer transition hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]"
      >
        <MapPin size={13} /> Rezervă loc alături
      </button>
    </div>
  )
}
