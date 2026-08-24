import { X, CalendarDays, Users } from "lucide-react"
import { useState } from "react"
import { Button, IconButton } from "@/components/ui"
import { createOfficeInvitation } from "@/services"

interface InviteColleagueDialogProps {
  colleagueId: number
  colleagueName: string
  open: boolean
  onClose: () => void
}

export function InviteColleagueDialog({ colleagueId, colleagueName, open, onClose }: InviteColleagueDialogProps) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split("T")[0]
  const [date, setDate] = useState(defaultDate)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function sendInvitation() {
    setError(null)
    if (!date) { setError("Alege data propusă."); return }
    setIsSending(true)
    try {
      await createOfficeInvitation(colleagueId, message.trim() || `Vii la birou pe ${date}?`, date)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invitația nu a putut fi trimisă.")
    } finally { setIsSending(false) }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] shadow-2xl" style={{ background: "var(--card)" }}>
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4"><div className="flex items-center gap-2.5"><div className="grid size-8 place-items-center rounded-lg bg-[var(--secondary)]"><Users size={15} /></div><div><h2 className="text-sm font-bold">Invită la muncă</h2><span className="text-xs text-[var(--muted-foreground)]">{colleagueName}</span></div></div><IconButton onClick={onClose} aria-label="Închide" size="xs"><X size={16} /></IconButton></div>
      <div className="flex flex-col gap-4 px-6 py-5"><div><label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold"><CalendarDays size={13} />Dată propusă</label><input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-sm" /></div><div><label className="mb-1.5 block text-xs font-semibold">Mesaj (opțional)</label><textarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={`Hei ${colleagueName.split(" ")[0]}, vii la birou?`} className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-sm" /></div>{error && <p className="text-xs text-[var(--destructive)]">{error}</p>}</div>
      <div className="flex justify-end gap-2.5 border-t border-[var(--border)] px-6 py-4"><Button variant="ghost" size="sm" onClick={onClose}>Anulează</Button><Button size="sm" isLoading={isSending} onClick={sendInvitation}>Trimite invitația</Button></div>
    </div>
  </div>
}
