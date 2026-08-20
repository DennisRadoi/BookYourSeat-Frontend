import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, Clock, MapPin, Trash2 } from "lucide-react"
import { Button, PillGroup } from "@/components/ui"
import { StatusBadge } from "./StatusBadge"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/common/Modal"
import { FormField, FormInput } from "@/components/common/FormField"
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
            <Button
              size="xs"
              variant="outline"
              onClick={handleChangeSeat}
              leftIcon={<MapPin size={11} />}
              className="text-[11px] font-semibold text-[var(--primary)] whitespace-nowrap"
              title="Schimbă locul – deschide harta"
            >
              Schimbă locul
            </Button>
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
            onChange={(val) => setStatus(val)}
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
        <Button
          variant={confirmCancel ? "destructive" : "outline"}
          size="sm"
          onClick={handleCancel}
          isLoading={isCancelling}
          disabled={isSaving || success}
          leftIcon={!isCancelling && <Trash2 size={13} />}
          className={confirmCancel ? "" : "text-[var(--destructive)] border-[var(--destructive)]/30 hover:bg-[var(--destructive)]/10"}
        >
          {confirmCancel ? "Confirmă anularea" : "Anulează rezervarea"}
        </Button>

        {/* Right: close + save */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="text-[13px] font-semibold text-[var(--muted-foreground)]"
          >
            Închide
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={success}
            className="rounded-xl font-semibold"
          >
            Salvează
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
