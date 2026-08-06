import { useEffect, useState, type ReactElement } from "react"
import { DateTimeSelectionStep, RoomSeatSelectionStep } from "@/components/seats"
import { getLocations } from "@/services/locationService"
import { createReservation } from "@/services/reservationService"
import { formatDateIso } from "@/utils"
import type { Location, Seat, RoomZoneType, RecurrenceType } from "@/types"

export default function SeatsPage(): ReactElement {
  // Booking step: "datetime" (Step 1) or "seat" (Step 2)
  const [currentStep, setCurrentStep] = useState<"datetime" | "seat">("datetime")

  // Schedule state
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  })
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endTime, setEndTime] = useState<string>("10:00")
  const [recurrence, setRecurrence] = useState<RecurrenceType>("lunar")
  const [repeatEvery, setRepeatEvery] = useState<number>(1)
  const [endsMode, setEndsMode] = useState<"niciodata" | "la_data" | "dupa">("niciodata")
  const [endsOnDate, setEndsOnDate] = useState<string>("")
  const [endsAfterCount, setEndsAfterCount] = useState<number>(1)

  // Room & Building state
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string>("Corp T1")
  const [selectedFloorId, setSelectedFloorId] = useState<number>(1)
  const [selectedZoneType, setSelectedZoneType] = useState<RoomZoneType>("birouri")
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)

  // Submission & Modal state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false)

  // Fetch locations on mount
  useEffect(() => {
    async function loadData() {
      const locs = await getLocations()
      setLocations(locs)
    }
    loadData()
  }, [])

  // Step 1 -> Step 2 transition
  function handleConfirmSchedule() {
    if (!selectedDate) return
    setCurrentStep("seat")
  }

  // Confirm Reservation handler
  async function handleConfirmReservation() {
    if (!selectedSeat || !selectedDate) return

    setIsSubmitting(true)
    try {
      const activeLoc = locations.find((l) => l.building === selectedBuilding) || locations[0]
      await createReservation({
        userId: 1,
        locationId: activeLoc?.id ?? 1,
        floorId: selectedFloorId,
        seatId: selectedSeat.id,
        date: formatDateIso(selectedDate),
        startTime,
        endTime,
        status: "confirmed",
      })
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error("Eroare la crearea rezervării:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBookAnother() {
    setIsSuccessModalOpen(false)
    setSelectedSeat(null)
    setCurrentStep("datetime")
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--background)] text-[var(--foreground)] pb-12 pt-2">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Step Pill Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)]">
            {currentStep === "datetime" ? (
              <span>Selectează data, intervalul orar și recurența</span>
            ) : (
              <span>{selectedBuilding} · Hartă interactivă locuri</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--card)] p-1 rounded-full border border-[var(--border)] text-xs font-semibold shadow-xs">
            <button
              type="button"
              onClick={() => setCurrentStep("datetime")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                currentStep === "datetime"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              1. Dată & Oră
            </button>
            <button
              type="button"
              onClick={() => selectedDate && setCurrentStep("seat")}
              disabled={!selectedDate}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                currentStep === "seat"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              2. Hartă Săli
            </button>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "datetime" ? (
          <DateTimeSelectionStep
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            startTime={startTime}
            onStartTimeChange={setStartTime}
            endTime={endTime}
            onEndTimeChange={setEndTime}
            recurrence={recurrence}
            onRecurrenceChange={setRecurrence}
            repeatEvery={repeatEvery}
            onRepeatEveryChange={setRepeatEvery}
            endsMode={endsMode}
            onEndsModeChange={setEndsMode}
            endsOnDate={endsOnDate}
            onEndsOnDateChange={setEndsOnDate}
            endsAfterCount={endsAfterCount}
            onEndsAfterCountChange={setEndsAfterCount}
            onConfirmSchedule={handleConfirmSchedule}
          />
        ) : (
          <RoomSeatSelectionStep
            locations={locations}
            selectedBuilding={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
            selectedFloorId={selectedFloorId}
            onSelectFloorId={setSelectedFloorId}
            selectedZoneType={selectedZoneType}
            onSelectZoneType={setSelectedZoneType}
            selectedRoomId={selectedRoomId}
            onSelectRoomId={setSelectedRoomId}
            selectedSeat={selectedSeat}
            onSelectSeat={setSelectedSeat}
            selectedDate={selectedDate}
            startTime={startTime}
            endTime={endTime}
            recurrence={recurrence}
            onConfirmReservation={handleConfirmReservation}
            onEditSchedule={() => setCurrentStep("datetime")}
            isSubmitting={isSubmitting}
            isSuccessModalOpen={isSuccessModalOpen}
            onCloseSuccessModal={() => setIsSuccessModalOpen(false)}
            onBookAnother={handleBookAnother}
          />
        )}
      </div>
    </div>
  )
}
