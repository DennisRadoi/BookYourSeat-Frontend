import { Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Colleague } from "@/types"

interface FavoriteColleaguesCardProps {
  colleagues: Colleague[]
  totalColleaguesCount: number
  onNavigateToCompany: () => void
}

export function FavoriteColleaguesCard({
  colleagues,
  totalColleaguesCount,
  onNavigateToCompany,
}: FavoriteColleaguesCardProps) {
  return (
    <Card className="rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <h2 className="text-[15px] font-bold text-[#1f2937]">Colegi favoriți</h2>
        <div className="flex items-center gap-1.5 text-[13px] text-[#6b7280]">
          <Users size={13} className="text-[#059669]" />
          {colleagues.length} / {totalColleaguesCount}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        {colleagues.slice(0, 3).map((colleague) => {
          const isOffice = colleague.status === "La birou"
          return (
            <div
              key={colleague.id}
              className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-[#f3f4f6]"
            >
              <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold bg-[#d1fae5] text-[#059669] border border-[#059669]/30">
                {colleague.initials}
              </div>
              <div className="flex flex-1 min-w-0 flex-col gap-px">
                <span className="truncate text-sm font-semibold text-[#1f2937]">{colleague.name}</span>
                <span className="text-[11px] text-[#6b7280]">
                  {colleague.floor} · {colleague.role}
                </span>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                  isOffice
                    ? "bg-[#d1fae5] text-[#059669]"
                    : "bg-[#fee2e2] text-[#ef4444]"
                }`}
              >
                {colleague.status}
              </span>
            </div>
          )
        })}

        <button
          onClick={onNavigateToCompany}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-[#e5e7eb] bg-transparent py-2 text-[13px] font-medium text-[#6b7280] cursor-pointer transition hover:border-[#059669] hover:text-[#059669] hover:bg-[#d1fae5]/30"
        >
          <Users size={14} /> Invită un coleg
        </button>
      </CardContent>
    </Card>
  )
}
