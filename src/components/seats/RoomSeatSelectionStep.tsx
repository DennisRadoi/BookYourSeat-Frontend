import { useState, useMemo, useEffect, type ReactElement } from "react"
import { FilterPill } from "./FilterPill"
import { RoomSelector } from "./RoomSelector"
import { SeatSearchBar } from "./SeatSearchBar"
import { RoomMap } from "@/maps"
import { SeatSummaryCard } from "./SeatSummaryCard"
import { ReservationSuccessModal } from "./ReservationSuccessModal"
import type { Location, Floor, Room, Seat, RoomZoneType, RecurrenceType } from "@/types"

interface RoomSeatSelectionStepProps {
  locations: Location[]
  selectedBuilding: string
  onSelectBuilding: (building: string) => void
  selectedFloorId: number
  onSelectFloorId: (floorId: number) => void
  selectedZoneType: RoomZoneType
  onSelectZoneType: (zone: RoomZoneType) => void
  selectedRoomId?: number
  onSelectRoomId?: (roomId: number) => void
  selectedSeat: Seat | null
  onSelectSeat: (seat: Seat) => void
  selectedDate: Date | null
  startTime: string
  endTime: string
  recurrence: RecurrenceType
  onConfirmReservation: () => void
  onEditSchedule: () => void
  isSubmitting?: boolean
  isSuccessModalOpen?: boolean
  onCloseSuccessModal?: () => void
  onBookAnother?: () => void
}

export function RoomSeatSelectionStep({
  locations,
  selectedBuilding,
  onSelectBuilding,
  selectedFloorId,
  onSelectFloorId,
  selectedZoneType,
  onSelectZoneType,
  selectedRoomId,
  onSelectRoomId,
  selectedSeat,
  onSelectSeat,
  selectedDate,
  startTime,
  endTime,
  recurrence,
  onConfirmReservation,
  onEditSchedule,
  isSubmitting,
  isSuccessModalOpen = false,
  onCloseSuccessModal = () => {},
  onBookAnother = () => {},
}: RoomSeatSelectionStepProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState("")

  // Find the current location / building
  const currentLocation = useMemo(() => {
    return (
      locations.find((l) => l.building === selectedBuilding) ||
      locations[0] ||
      null
    )
  }, [locations, selectedBuilding])

  // Get floors of the current building
  const floors: Floor[] = useMemo(() => {
    return currentLocation?.floors || []
  }, [currentLocation])

  // Current floor
  const currentFloor: Floor | undefined = useMemo(() => {
    return floors.find((f) => f.id === selectedFloorId) || floors[0]
  }, [floors, selectedFloorId])

  // Sync floor id if building changed and current floor is not in the new building
  useEffect(() => {
    if (floors.length > 0 && !floors.some((f) => f.id === selectedFloorId)) {
      onSelectFloorId(floors[0].id)
    }
  }, [floors, selectedFloorId, onSelectFloorId])

  // Get all rooms on the current floor matching the selected zone type ("birouri" vs "conferinte")
  const availableRooms: Room[] = useMemo(() => {
    if (!currentFloor?.rooms) return []
    return currentFloor.rooms.filter((r) => r.type === selectedZoneType)
  }, [currentFloor, selectedZoneType])

  // Current active room
  const currentRoom: Room | undefined = useMemo(() => {
    if (availableRooms.length === 0) return undefined
    if (selectedRoomId) {
      const found = availableRooms.find((r) => r.id === selectedRoomId)
      if (found) return found
    }
    return availableRooms[0]
  }, [availableRooms, selectedRoomId])

  // Auto-sync selectedRoomId if it doesn't match available rooms
  useEffect(() => {
    if (availableRooms.length > 0) {
      if (!selectedRoomId || !availableRooms.some((r) => r.id === selectedRoomId)) {
        onSelectRoomId?.(availableRooms[0].id)
      }
    }
  }, [availableRooms, selectedRoomId, onSelectRoomId])

  // Seats list for current room or floor fallback
  const seats: Seat[] = useMemo(() => {
    if (currentRoom && currentRoom.seats) return currentRoom.seats
    if (currentFloor && currentFloor.seats) return currentFloor.seats
    return []
  }, [currentRoom, currentFloor])

  // Auto-select initial available seat when room or seats change
  useEffect(() => {
    const isSelectedInRoom = selectedSeat && seats.some((s) => s.id === selectedSeat.id)
    if (!isSelectedInRoom && seats.length > 0) {
      const defaultSeat =
        seats.find((s) => s.code === "M6" && s.isAvailable) ||
        seats.find((s) => s.code === "B1" && s.isAvailable) ||
        seats.find((s) => s.isAvailable)
      if (defaultSeat) {
        onSelectSeat(defaultSeat)
      }
    }
  }, [seats, selectedSeat, onSelectSeat])

  const roomDisplayName = currentRoom?.name || `Sala ${selectedZoneType === "birouri" ? "Birouri" : "Conferințe"} - ${currentFloor?.name || "Parter"}`

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Controls Toolbar */}
      <div className="space-y-3.5 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-2xs">
        {/* Row 1: Building Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider min-w-16">
            Clădire:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {locations.map((loc) => {
              const isSelected = loc.building === selectedBuilding
              return (
                <FilterPill
                  key={loc.id}
                  active={isSelected}
                  variant="primary"
                  onClick={() => onSelectBuilding(loc.building)}
                  className="min-w-20 text-xs sm:text-sm font-medium"
                >
                  {loc.building}
                </FilterPill>
              )
            })}
          </div>
        </div>

        {/* Row 2: Floor + Zone Switchers & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1 border-t border-[var(--border)]/60">
          {/* Left: Floors & Zones */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider min-w-16">
              Etaj:
            </span>
            {floors.map((floor) => {
              const isFloorSelected = floor.id === (currentFloor?.id ?? selectedFloorId)
              return (
                <FilterPill
                  key={floor.id}
                  active={isFloorSelected}
                  variant="dark"
                  onClick={() => onSelectFloorId(floor.id)}
                >
                  {floor.name}
                </FilterPill>
              )
            })}

            <div className="h-5 w-px bg-[var(--border)] mx-1 hidden sm:block" />

            <FilterPill
              active={selectedZoneType === "birouri"}
              variant="dark"
              onClick={() => onSelectZoneType("birouri")}
            >
              Birouri
            </FilterPill>

            <FilterPill
              active={selectedZoneType === "conferinte"}
              variant="dark"
              onClick={() => onSelectZoneType("conferinte")}
            >
              Sali conferinte
            </FilterPill>
          </div>

          {/* Right: Search & Filter */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <SeatSearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
            />
          </div>
        </div>

        {/* Row 3: Specific Room Selector (if multiple rooms exist on floor) */}
        {availableRooms.length > 0 && (
          <div className="pt-2 border-t border-[var(--border)]/60">
            <RoomSelector
              rooms={availableRooms}
              selectedRoomId={currentRoom?.id}
              onSelectRoom={(r) => {
                onSelectRoomId?.(r.id)
              }}
            />
          </div>
        )}
      </div>

      {/* Main Grid: Room Map (Left) & Summary Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Room Map Canvas */}
        <div className="lg:col-span-8 col-span-1">
          <RoomMap
            roomName={roomDisplayName}
            seats={seats}
            selectedSeat={selectedSeat}
            onSeatSelect={onSelectSeat}
            searchQuery={searchQuery}
            layout={currentRoom?.layout}
            roomType={selectedZoneType}
            building={selectedBuilding}
            floor={currentFloor?.number ?? 1}
            hasTv={currentRoom?.hasTv ?? true}
            hasWhiteboard={currentRoom?.hasWhiteboard ?? true}
          />
        </div>

        {/* Right Info & Booking Summary Card */}
        <div className="lg:col-span-4 col-span-1">
          <SeatSummaryCard
            selectedSeat={selectedSeat}
            buildingName={selectedBuilding}
            floorName={currentFloor?.name || "Parter"}
            selectedDate={selectedDate}
            startTime={startTime}
            endTime={endTime}
            recurrence={recurrence}
            onConfirm={onConfirmReservation}
            onEditSchedule={onEditSchedule}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Confirmation Success Modal */}
      <ReservationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={onCloseSuccessModal}
        seat={selectedSeat}
        buildingName={selectedBuilding}
        floorName={currentFloor?.name || "Parter"}
        date={selectedDate}
        startTime={startTime}
        endTime={endTime}
        recurrence={recurrence}
        onBookAnother={onBookAnother}
      />
    </div>
  )
}
