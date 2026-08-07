import { X, CalendarDays, Users } from "lucide-react"
import { Button, IconButton } from "@/components/ui"

interface InviteColleagueDialogProps {
  colleagueName: string
  open: boolean
  onClose: () => void
}

export function InviteColleagueDialog({ colleagueName, open, onClose }: InviteColleagueDialogProps) {
  if (!open) return null

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split("T")[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4" //de scos in componente nu doar o linie de cod
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden"
        style={{ background: "var(--card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)]">
              <Users size={15} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[14px] font-bold text-[var(--foreground)]">Invită la muncă</h2>
              <span className="text-[11px] text-[var(--muted-foreground)]">{colleagueName}</span>
            </div>
          </div>
          <IconButton
            onClick={onClose}
            aria-label="Închide"
            size="xs"
            className="rounded-full text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X size={16} />
          </IconButton>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-[13px] text-[var(--muted-foreground)]">
            Trimite o invitație lui <strong className="text-[var(--foreground)]">{colleagueName}</strong> să vină la birou în ziua selectată.
          </p>

          {/* Date picker */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
              <CalendarDays size={13} /> Dată propusă
            </label>
            <input
              type="date"
              defaultValue={defaultDate}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
              Mesaj (opțional)
            </label>
            <textarea
              rows={3}
              placeholder={`Hei ${colleagueName.split(" ")[0]}, vii mâine la birou?`}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition placeholder:text-[var(--muted-foreground)]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[var(--border)]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[13px] font-semibold text-[var(--muted-foreground)]"
          >
            Anulează
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="rounded-xl font-semibold"
          >
            Trimite invitația
          </Button>
        </div>
      </div>
    </div>
  )
}
