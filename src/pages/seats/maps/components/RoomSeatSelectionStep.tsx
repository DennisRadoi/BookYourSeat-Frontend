import { useState, useMemo, useEffect, type ReactElement } from "react"
import { AlertCircle } from "lucide-react"
import { FilterPill } from "./FilterPill"
import { RoomSelector } from "./RoomSelector"
import { SeatSearchBar } from "./SeatSearchBar"
import { RoomMap } from "@/pages/seats/maps"
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
  const [isWholeRoomSelected, setIsWholeRoomSelected] = useState(false)
  const [birouriNotice, setBirouriNotice] = useState<string | null>(null)

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

  // Check if current floor has any rooms/seats of type "birouri"
  const hasBirouriOnFloor = useMemo(() => {
    if (!currentFloor?.rooms) return false
    return currentFloor.rooms.some((r) => r.type === "birouri")
  }, [currentFloor])

  const hasConferinteOnFloor = useMemo(() => {
    if (!currentFloor?.rooms) return false
    return currentFloor.rooms.some((r) => r.type === "conferinte")
  }, [currentFloor])

  // Keep the selected zone valid for the selected floor.
  useEffect(() => {
    if (!hasBirouriOnFloor && hasConferinteOnFloor && selectedZoneType === "birouri") {
      onSelectZoneType("conferinte")
    }
    if (!hasConferinteOnFloor && hasBirouriOnFloor && selectedZoneType === "conferinte") {
      onSelectZoneType("birouri")
    }
  }, [hasBirouriOnFloor, hasConferinteOnFloor, selectedZoneType, onSelectZoneType])

  // Reset notice when floor or building changes
  useEffect(() => {
    setBirouriNotice(null)
  }, [selectedFloorId, selectedBuilding])

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

  // Reset whole room selection when room or zone changes
  useEffect(() => {
    setIsWholeRoomSelected(false)
  }, [selectedZoneType, currentRoom?.id])

  // Auto-navigate to room matching search query (e.g. "sala tenis", "gaming", "404", "la terasa")
  useEffect(() => {
    const clean = (str = "") =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()

    const q = clean(searchQuery)
    if (!q || q.length < 2) return

    for (const loc of locations) {
      for (const floor of loc.floors || []) {
        for (const room of floor.rooms || []) {
          const roomNameClean = clean(room.name)
          if (roomNameClean.includes(q) || q.includes(roomNameClean)) {
            if (loc.building !== selectedBuilding) {
              onSelectBuilding(loc.building)
            }
            if (floor.id !== selectedFloorId) {
              onSelectFloorId(floor.id)
            }
            if (room.type !== selectedZoneType) {
              onSelectZoneType(room.type)
            }
            if (room.id !== selectedRoomId) {
              onSelectRoomId?.(room.id)
            }
            return
          }
        }
      }
    }
  }, [
    searchQuery,
    locations,
    selectedBuilding,
    selectedFloorId,
    selectedZoneType,
    selectedRoomId,
    onSelectBuilding,
    onSelectFloorId,
    onSelectZoneType,
    onSelectRoomId,
  ])

  // Seats list for current room or floor fallback
  const seats: Seat[] = useMemo(() => {
    if (currentRoom && currentRoom.seats) return currentRoom.seats
    if (currentFloor && currentFloor.seats) return currentFloor.seats
    return []
  }, [currentRoom, currentFloor])

  // Auto-select initial available seat when room or seats change
  useEffect(() => {
    const isSelectedInRoom = selectedSeat && seats.some((s) => s.id === selectedSeat.id)
    if (!isSelectedInRoom && seats.length > 0 && !isWholeRoomSelected) {
      const firstAvailable = seats.find((s) => s.isAvailable)
      if (firstAvailable) onSelectSeat(firstAvailable)
    }
  }, [seats, selectedSeat, onSelectSeat, isWholeRoomSelected])

  const roomDisplayName = currentRoom?.name || currentFloor?.name || "Sală"
  const roomCapacity = useMemo(
    () => seats.filter((seat) => seat.unavailableReason !== "Nu se poate rezerva").length,
    [seats],
  )
  const isRoomAvailable = useMemo(() => !seats.some((seat) => Boolean(seat.occupiedBy)), [seats])

  function handleToggleWholeRoom() {
    if (isWholeRoomSelected) {
      setIsWholeRoomSelected(false)
      const firstAvailable = seats.find((s) => s.isAvailable)
      if (firstAvailable) onSelectSeat(firstAvailable)
    } else {
      setIsWholeRoomSelected(true)
      if (currentRoom) {
        const wholeRoomSeat: Seat = {
          id: -currentRoom.id,
          code: `Toată sala (${currentRoom.name})`,
          area: "team",
          type: "standard",
          hasMonitor: true,
          isAvailable: true,
        }
        onSelectSeat(wholeRoomSeat)
      }
    }
  }

  function handleSeatSelect(seat: Seat) {
    if (seat.id > 0) {
      setIsWholeRoomSelected(false)
    }
    onSelectSeat(seat)
  }

  function handleBirouriClick() {
    if (!hasBirouriOnFloor) {
      setBirouriNotice(
        `Nu există birouri la ${currentFloor?.name || "acest etaj"} în ${selectedBuilding}. Sunt disponibile doar Săli de Conferințe.`
      )
    } else {
      setBirouriNotice(null)
      onSelectZoneType("birouri")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter Bar */}
      <div className="bg-[var(--card)] rounded-2xl p-4 sm:p-5 border border-[var(--border)] shadow-xs space-y-4">
        {/* Row 1: Building Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)]/60 pb-3.5">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mr-1">
            Clădire:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto">
            {locations.map((loc) => {
              const isSelected = loc.building === selectedBuilding
              return (
                <FilterPill
                  key={loc.id}
                  active={isSelected}
                  variant="dark"
                  onClick={() => onSelectBuilding(loc.building)}
                >
                  {loc.building}
                </FilterPill>
              )
            })}
          </div>
        </div>

        {/* Row 2: Floor Tabs + Zone Type + Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Left: Floor Selector & Zone Type Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mr-1">
              Etaj:
            </span>
            {floors.map((floor) => {
              const isFloorSelected = floor.id === selectedFloorId
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
              active={selectedZoneType === "birouri" && hasBirouriOnFloor}
              variant="dark"
              onClick={handleBirouriClick}
              className={!hasBirouriOnFloor ? "opacity-50 cursor-not-allowed bg-[var(--muted)]/40 border-dashed" : ""}
              ariaLabel={!hasBirouriOnFloor ? "Nu există birouri la acest etaj" : "Birouri"}
            >
              Birouri {!hasBirouriOnFloor && <span className="text-[10px] ml-1 opacity-75">(0)</span>}
            </FilterPill>

            {hasConferinteOnFloor && <FilterPill
              active={selectedZoneType === "conferinte"}
              variant="dark"
              onClick={() => {
                setBirouriNotice(null)
                onSelectZoneType("conferinte")
              }}
            >
              Sali conferinte
            </FilterPill>}
          </div>

          {/* Right: Search Bar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <SeatSearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
            />
          </div>
        </div>

        {/* Warning Banner if user clicked disabled Birouri pill */}
        {birouriNotice && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/30 text-xs font-medium text-[var(--warning)] animate-in fade-in-0 slide-in-from-top-1">
            <AlertCircle size={16} className="shrink-0 text-[var(--warning)]" />
            <span>{birouriNotice}</span>
          </div>
        )}

        {/* Row 3: Specific Room Selector */}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 col-span-1">
          <RoomMap
            roomName={roomDisplayName}
            seats={seats}
            selectedSeat={selectedSeat}
            onSeatSelect={handleSeatSelect}
            searchQuery={searchQuery}
            layout={currentRoom?.layout}
            roomType={selectedZoneType}
            building={selectedBuilding}
            floor={currentFloor?.number ?? 1}
            hasTv={currentRoom?.hasTv ?? true}
            hasWhiteboard={currentRoom?.hasWhiteboard ?? true}
          />
        </div>

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
            isConferenceZone={selectedZoneType === "conferinte"}
            isWholeRoomSelected={isWholeRoomSelected}
            onToggleWholeRoom={handleToggleWholeRoom}
            roomName={currentRoom?.name}
            roomCapacity={roomCapacity}
            isRoomAvailable={isRoomAvailable}
          />
        </div>
      </div>

      {/* Confirmation Success Modal */}
      <ReservationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={onCloseSuccessModal}
        onBookAnother={onBookAnother}
        seat={selectedSeat}
        buildingName={selectedBuilding}
        floorName={currentFloor?.name || "Parter"}
        date={selectedDate}
        startTime={startTime}
        endTime={endTime}
        recurrence={recurrence}
        roomName={currentRoom?.name}
        isConferenceRoom={selectedZoneType === "conferinte"}
      />
    </div>
  )
}
