import type { ReactElement } from "react"
import { CheckCircle2, Calendar, Clock, MapPin, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Seat, RecurrenceType } from "@/types"
import { Button, IconButton } from "@/components/ui"

interface ReservationSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  seat: Seat | null
  buildingName: string
  floorName: string
  date: Date | null
  startTime: string
  endTime: string
  recurrence: RecurrenceType
  roomName?: string
  isConferenceRoom?: boolean
  onBookAnother: () => void
}

export function ReservationSuccessModal({
  isOpen,
  onClose,
  seat,
  buildingName,
  floorName,
  date,
  startTime,
  endTime,
  recurrence,
  roomName,
  isConferenceRoom = false,
  onBookAnother,
}: ReservationSuccessModalProps): ReactElement | null {
  const navigate = useNavigate()

  if (!isOpen || !seat) return null

  const locationLabel = isConferenceRoom && roomName
    ? `Sala ${roomName} · ${buildingName}`
    : `Loc ${seat.code} · ${buildingName} ${floorName}`

  const formattedDate = date
    ? date.toLocaleDateString("ro-RO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Astăzi"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-[var(--card)] rounded-2xl p-6 sm:p-7 border border-[var(--border)] shadow-2xl animate-in zoom-in-95 duration-200">
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Închide"
          size="xs"
          className="absolute right-4 top-4 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
        >
          <X size={18} />
        </IconButton>

        {/* Success Icon Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center mb-3 shadow-xs">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-[var(--foreground)]">
            Rezervare Confirmată!
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Locul tău a fost rezervat cu succes în sistem.
          </p>
        </div>

        {/* Reservation Details Box */}
        <div className="rounded-xl bg-[var(--muted)] p-4 border border-[var(--border)] space-y-3 text-sm mb-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
            <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
              <MapPin size={15} className="text-[var(--primary)]" /> Locație
            </span>
            <span className="font-bold text-[var(--foreground)]">
              {locationLabel}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[var(--border)]/70 pb-2.5">
            <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
              <Calendar size={15} className="text-[var(--primary)]" /> Data
            </span>
            <span className="font-semibold text-[var(--foreground)] capitalize">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[var(--border)]/70 pb-2.5">
            <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
              <Clock size={15} className="text-[var(--primary)]" /> Interval
            </span>
            <span className="font-semibold text-[var(--foreground)]">
              {startTime} — {endTime}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Recurență</span>
            <span className="font-semibold text-[var(--foreground)] capitalize">
              {recurrence === "niciuna" ? "Fără recurență" : recurrence}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 py-2.5 rounded-xl font-semibold"
          >
            Vezi în Dashboard
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBookAnother}
            className="flex-1 py-2.5 rounded-xl font-semibold"
          >
            Altă rezervare
          </Button>
        </div>
      </div>
    </div>
  )
}
