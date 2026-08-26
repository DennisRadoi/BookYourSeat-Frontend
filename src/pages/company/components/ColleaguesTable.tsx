import { MapPin, Star } from "lucide-react"
import { useState } from "react"
import type { Colleague } from "@/types"
import { getInitials } from "@/utils"
import { Button, IconButton } from "@/components/ui"

interface ColleaguesTableProps { colleagues: Colleague[]; onToggleFavorite: (id: number) => void; onViewProfile: (colleague: Colleague) => void }

export function ColleaguesTable({ colleagues, onToggleFavorite, onViewProfile }: ColleaguesTableProps) {
  if (colleagues.length === 0) return <EmptyState />

  return <><div className="hidden max-w-[920px] overflow-x-auto rounded-[20px] border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_6px_rgba(0,0,0,0.04)] md:block"><table className="w-full min-w-[680px] table-fixed border-collapse"><colgroup><col style={{ width: "35%" }} /><col style={{ width: "20%" }} /><col style={{ width: "25%" }} /><col style={{ width: "10%" }} /><col style={{ width: "10%" }} /></colgroup><thead><tr className="border-b border-[var(--border)]"><th className="py-3 pt-[17px] pr-3 pb-3 pl-[22px] text-left text-xs font-semibold text-[var(--muted-foreground)]">Coleg</th><th className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[var(--muted-foreground)]">Status</th><th className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[var(--muted-foreground)]">Locație</th><th className="px-3 py-3 pt-[17px] text-left text-xs font-semibold text-[var(--muted-foreground)]">Favorit</th><th className="py-3 pt-[17px] pr-[22px] pl-3"><span className="sr-only">Profil</span></th></tr></thead><tbody>{colleagues.map((colleague) => <ColleagueRow key={colleague.id} colleague={colleague} onToggleFavorite={onToggleFavorite} onViewProfile={onViewProfile} />)}</tbody></table></div><div className="space-y-3 md:hidden">{colleagues.map((colleague) => <ColleagueCard key={colleague.id} colleague={colleague} onToggleFavorite={onToggleFavorite} onViewProfile={onViewProfile} />)}</div></>
}

function StatusBadge({ status }: { status: Colleague["status"] }) { return <span className={`inline-flex min-w-[74px] justify-center rounded-full px-2.5 py-1 text-[11px] font-bold ${status === "La birou" ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]" : status === "OOO" ? "bg-[var(--muted)] text-[var(--muted-foreground)]" : "bg-[var(--destructive)]/20 text-[var(--destructive)]"}`}>{status}</span> }

function ColleagueRow({ colleague, onToggleFavorite, onViewProfile }: { colleague: Colleague; onToggleFavorite: (id: number) => void; onViewProfile: (colleague: Colleague) => void }) {
  return <tr className="border-b border-[var(--border)] last:border-0 transition hover:bg-[var(--background)]/60"><td className="py-3 pr-3 pl-[22px] align-middle text-[13px]"><Person colleague={colleague} /></td><td className="px-3 py-3 align-middle text-[13px]"><StatusBadge status={colleague.status} /></td><td className="px-3 py-3 align-middle text-xs font-semibold text-[var(--foreground)]">{colleague.floor}</td><td className="px-3 py-3 align-middle"><FavoriteButton colleague={colleague} onToggleFavorite={onToggleFavorite} /></td><td className="py-3 pr-[22px] pl-3 align-middle"><ProfileButton onClick={() => onViewProfile(colleague)} /></td></tr>
}

function ColleagueCard({ colleague, onToggleFavorite, onViewProfile }: { colleague: Colleague; onToggleFavorite: (id: number) => void; onViewProfile: (colleague: Colleague) => void }) {
  return <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm"><div className="flex items-start gap-3"><Person colleague={colleague} /><FavoriteButton colleague={colleague} onToggleFavorite={onToggleFavorite} /></div><div className="mt-4 flex flex-wrap items-center gap-2"><StatusBadge status={colleague.status} /><span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted-foreground)]"><MapPin size={14} className="text-[var(--primary)]" />{colleague.floor}</span></div><ProfileButton className="mt-4 h-10 w-full rounded-lg bg-[var(--secondary)] text-center hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]" onClick={() => onViewProfile(colleague)} /></article>
}

function Person({ colleague }: { colleague: Colleague }) {
  const [imgError, setImgError] = useState(false)
  return <div className="flex min-w-0 flex-1 items-center gap-3">{
    colleague.avatarUrl && !imgError ? (
      <img
        src={colleague.avatarUrl}
        alt={colleague.name}
        className="size-10 shrink-0 rounded-full border-2 border-[var(--primary)] object-cover"
        onError={() => setImgError(true)}
      />
    ) : (
      <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-[var(--primary)] bg-[var(--secondary)] text-xs font-bold text-[var(--secondary-foreground)]">{getInitials(colleague.name)}</span>
    )
  }<div className="min-w-0"><p className="truncate text-sm font-bold text-[var(--foreground)]">{colleague.name}</p><p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">{colleague.role}</p></div></div>
}

function FavoriteButton({ colleague, onToggleFavorite }: { colleague: Colleague; onToggleFavorite: (id: number) => void }) { return <IconButton type="button" size="xs" variant="ghost" className={`shrink-0 rounded-md p-1.5 leading-none transition ${colleague.isFavorite ? "text-[var(--warning)]" : "text-[var(--border)] hover:text-[var(--warning)]"}`} onClick={() => onToggleFavorite(colleague.id)} aria-label={`${colleague.isFavorite ? "Elimină" : "Adaugă"} ${colleague.name} la favorite`}><Star size={20} fill={colleague.isFavorite ? "currentColor" : "none"} /></IconButton> }

function ProfileButton({ onClick, className = "" }: { onClick: () => void; className?: string }) { return <Button type="button" variant="link" size="xs" onClick={onClick} className={`whitespace-nowrap font-bold text-[var(--primary)] hover:text-[var(--sidebar-accent-hover)] hover:underline ${className}`}>Vezi profil</Button> }
function EmptyState() { return <div className="max-w-[920px] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">Nu am găsit colegi care să corespundă căutării.</div> }
