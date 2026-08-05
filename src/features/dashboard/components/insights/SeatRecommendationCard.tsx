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
    <div className="flex flex-col gap-2.5 rounded-xl border border-[#e5e7eb] bg-white p-3.5">
      <div className="flex items-center gap-1.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d1fae5] text-[#059669]">
          <MapPinned size={13} />
        </div>
        <span className="text-[13px] font-bold text-[#1f2937]">Recomandare loc</span>
      </div>
      <p className="text-[12px] leading-[1.5] text-[#1f2937]">
        <strong>{seatRec.colleagueName}</strong> a rezervat {seatRec.seat}, {seatRec.floor}.
        Vrei un loc alături?
      </p>
      <button
        onClick={onReserveAdjacent}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#d1fae5] py-2.5 text-[12px] font-semibold text-[#059669] border-0 cursor-pointer transition hover:bg-[#059669] hover:text-white"
      >
        <MapPin size={13} /> Rezervă loc alături
      </button>
    </div>
  )
}
