import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, Clock, Loader2, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/common/Modal"
import { FormField, FormInput } from "@/components/common/FormField"
import { PillGroup } from "@/components/common/PillButton"
import { AlertBanner } from "@/components/common/AlertBanner"
import { updateReservation, cancelReservation } from "@/services"
import { MONTH_LABELS } from "@/utils"
import type { DetailedReservation, ReservationStatus } from "@/types"
import type { SeatsPageRouterState } from "@/pages/seats/SeatsPage"

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
        const updated: DetailedReservation = { ...reservation, date, startTime, endTime, status }
        setTimeout(() => { onSaved(updated); onClose() }, 800)
      }
    } catch {
      setError("A apărut o eroare. Încearcă din nou.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCancel() {
    if (!confirmCancel) { setConfirmCancel(true); return }
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
    <Modal onClose={onClose}>
      <ModalHeader
        title="Editează rezervarea"
        subtitle={`${MONTH_LABELS[reservationDate.getMonth()]} ${reservationDate.getDate()} · ${reservation.floor?.name ?? "—"} · Loc ${reservation.seat?.code ?? "—"}`}
        onClose={onClose}
      />

      <ModalBody>
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
        <FormField label={<><CalendarDays size={13} /> Dată</>}>
          <FormInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </FormField>

        {/* Time range */}
        <div className="flex gap-3">
          <FormField label={<><Clock size={13} /> Ora start</>} className="flex-1">
            <FormInput type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </FormField>
          <FormField label={<><Clock size={13} /> Ora sfârșit</>} className="flex-1">
            <FormInput type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </FormField>
        </div>

        {/* Status */}
        <FormField label="Status">
          <PillGroup
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
          />
        </FormField>

        {/* Banners */}
        {confirmCancel && (
          <AlertBanner variant="warning">
            Ești sigur? Apasă din nou pe <strong>Anulează rezervarea</strong> pentru a confirma.
          </AlertBanner>
        )}
        {error && <AlertBanner variant="error">{error}</AlertBanner>}
        {success && <AlertBanner variant="success">Rezervarea a fost actualizată!</AlertBanner>}
      </ModalBody>

      <ModalFooter align="between">
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
          {isCancelling ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
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
            {isSaving ? <><Loader2 size={14} className="animate-spin" /> Salvez...</> : "Salvează"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
