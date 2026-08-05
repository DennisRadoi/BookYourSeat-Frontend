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
    <Card className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <h2 className="text-[15px] font-bold text-[var(--foreground)]">Colegi favoriți</h2>
        <div className="flex items-center gap-1.5 text-[13px] text-[var(--muted-foreground)]">
          <Users size={13} className="text-[var(--primary)]" />
          {colleagues.length} / {totalColleaguesCount}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        {colleagues.slice(0, 3).map((colleague) => {
          const isOffice = colleague.status === "La birou"
          return (
            <div
              key={colleague.id}
              className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-[var(--muted)]"
            >
              <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--primary)]/30">
                {colleague.initials}
              </div>
              <div className="flex flex-1 min-w-0 flex-col gap-px">
                <span className="truncate text-sm font-semibold text-[var(--foreground)]">{colleague.name}</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  {colleague.floor} · {colleague.role}
                </span>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                  isOffice
                    ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                    : "bg-[var(--destructive)]/15 text-[var(--destructive)]"
                }`}
              >
                {colleague.status}
              </span>
            </div>
          )
        })}

        <button
          onClick={onNavigateToCompany}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-[var(--border)] bg-transparent py-2 text-[13px] font-medium text-[var(--muted-foreground)] cursor-pointer transition hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--secondary)]/30"
        >
          <Users size={14} /> Invită un coleg
        </button>
      </CardContent>
    </Card>
  )
}
