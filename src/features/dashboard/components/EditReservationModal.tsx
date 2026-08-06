import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { X, CalendarDays, Clock, CheckCircle2, Loader2, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { updateReservation, cancelReservation } from "@/services"
import { MONTH_LABELS } from "@/utils"
import type { DetailedReservation, ReservationStatus } from "@/types"
import type { SeatsPageRouterState } from "@/pages/SeatsPage"

interface EditReservationModalProps {
  reservation: DetailedReservation | null
  onClose: () => void
  onSaved: (updated: DetailedReservation) => void
  onCancelled: (reservationId: number) => void
}

const STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmat" },
  { value: "pending", label: "În așteptare" },
  { value: "completed", label: "Finalizat" },
  { value: "cancelled", label: "Anulat" },
]

export function EditReservationModal({
  reservation,
  onClose,
  onSaved,
  onCancelled,
}: EditReservationModalProps) {
  const navigate = useNavigate()
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [status, setStatus] = useState<ReservationStatus>("confirmed")
  const [isSaving, setIsSaving] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (reservation) {
      setDate(reservation.date)
      setStartTime(reservation.startTime)
      setEndTime(reservation.endTime)
      setStatus(reservation.status)
      setError(null)
      setSuccess(false)
      setConfirmCancel(false)
    }
  }, [reservation])

  if (!reservation) return null

  const reservationDate = new Date(`${reservation.date}T12:00:00`)

  async function handleSave() {
    if (!reservation) return
    if (!date || !startTime || !endTime) {
      setError("Completează toate câmpurile.")
      return
    }
    if (startTime >= endTime) {
      setError("Ora de început trebuie să fie înainte de ora de sfârșit.")
      return
    }
    setError(null)
    setIsSaving(true)
    try {
      const result = await updateReservation(reservation.id, { date, startTime, endTime, status })
      if (result) {
        setSuccess(true)
        const updated: DetailedReservation = {
          ...reservation,
          date,
          startTime,
          endTime,
          status,
        }
        setTimeout(() => {
          onSaved(updated)
          onClose()
        }, 800)
      }
    } catch {
      setError("A apărut o eroare. Încearcă din nou.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCancel() {
    if (!confirmCancel) {
      setConfirmCancel(true)
      return
    }
    if (!reservation) return
    setIsCancelling(true)
    try {
      await cancelReservation(reservation.id)
      onCancelled(reservation.id)
      onClose()
    } catch {
      setError("Anularea a eșuat. Încearcă din nou.")
    } finally {
      setIsCancelling(false)
    }
  }

  function handleChangeSeat() {
    if (!reservation) return
    const state: SeatsPageRouterState = {
      jumpToSeat: true,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    }
    onClose()
    navigate("/seats", { state })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden"
        style={{ background: "var(--card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[15px] font-bold text-[var(--foreground)]">Editează rezervarea</h2>
            <span className="text-[12px] text-[var(--muted-foreground)]">
              {MONTH_LABELS[reservationDate.getMonth()]} {reservationDate.getDate()} ·{" "}
              {reservation.floor?.name ?? "—"} · Loc {reservation.seat?.code ?? "—"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition"
            aria-label="Închide"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Seat info (read-only) + schimbă locul */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                Loc rezervat
              </span>
              <span className="text-[13px] font-bold text-[var(--foreground)] truncate">
                {reservation.floor?.name ?? "—"} · Loc {reservation.seat?.code ?? "—"}
              </span>
              {reservation.location && (
                <span className="text-[11px] text-[var(--muted-foreground)] truncate">
                  {reservation.location.name}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <StatusBadge status={reservation.status} />
              <button
                onClick={handleChangeSeat}
                className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] hover:border-[var(--primary)] transition whitespace-nowrap"
                title="Schimbă locul – deschide harta"
              >
                <MapPin size={11} />
                Schimbă locul
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
              <CalendarDays size={13} /> Dată
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
            />
          </div>

          {/* Time range */}
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                <Clock size={13} /> Ora start
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                <Clock size={13} /> Ora sfârșit
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold border transition ${
                    status === opt.value
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                      : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cancel confirm banner */}
          {confirmCancel && (
            <div className="rounded-xl border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 px-3.5 py-2.5 text-[12px] font-medium text-[var(--destructive)]">
              Ești sigur? Apasă din nou pe <strong>Anulează rezervarea</strong> pentru a confirma.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3.5 py-2.5 text-[12px] font-medium text-[var(--destructive)]">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-3.5 py-2.5 text-[12px] font-medium text-green-600 dark:text-green-400">
              <CheckCircle2 size={14} />
              Rezervarea a fost actualizată!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2.5 px-6 py-4 border-t border-[var(--border)]">
          {/* Left: anulează rezervarea */}
          <button
            onClick={handleCancel}
            disabled={isCancelling || isSaving || success}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition disabled:opacity-50 ${
              confirmCancel
                ? "bg-[var(--destructive)] text-white hover:opacity-90"
                : "text-[var(--destructive)] hover:bg-[var(--destructive)]/10 border border-[var(--destructive)]/30"
            }`}
          >
            {isCancelling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            {confirmCancel ? "Confirmă anularea" : "Anulează rezervarea"}
          </button>

          {/* Right: close + save */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition disabled:opacity-50"
            >
              Închide
            </button>
            <Button
              onClick={handleSave}
              disabled={isSaving || success}
              className="rounded-xl bg-[var(--primary)] hover:bg-[var(--sidebar-accent-hover)] text-[var(--primary-foreground)] gap-1.5 shadow-sm disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Salvez...
                </>
              ) : (
                "Salvează"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
