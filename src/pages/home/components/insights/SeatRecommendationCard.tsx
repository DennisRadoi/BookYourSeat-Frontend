import { MapPin, MapPinned } from "lucide-react"
import { Button } from "@/components/ui"
import type { SeatRecommendation } from "@/types"

interface SeatRecommendationCardProps {
  seatRec: SeatRecommendation
  onReserveAdjacent?: () => void
}

export function SeatRecommendationCard({
  seatRec,
  onReserveAdjacent,
}: SeatRecommendationCardProps) {
  const targetCode = seatRec.targetSeatCode || "A2"
  const roomText = seatRec.roomName ? ` în ${seatRec.roomName}` : ""

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5">
      <div className="flex items-center gap-1.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)]">
          <MapPinned size={13} />
        </div>
        <span className="text-[13px] font-bold text-[var(--foreground)]">Recomandare loc</span>
      </div>
      <p className="text-[12px] leading-[1.5] text-[var(--foreground)]">
        Colega ta <strong>{seatRec.colleagueName}</strong> a rezervat <strong>{seatRec.seat}</strong>{roomText} ({seatRec.floor}). Vrei un loc alături?
      </p>
      <Button
        variant="secondary"
        size="sm"
        onClick={onReserveAdjacent}
        leftIcon={<MapPin size={13} />}
        className="w-full font-semibold"
      >
        Rezervă loc alături ({targetCode})
      </Button>
    </div>
  )
}
