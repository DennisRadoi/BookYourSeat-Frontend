import type { ReactElement } from "react"
import type { Room } from "@/types"

interface RoomSelectorProps {
  rooms: Room[]
  selectedRoomId?: number
  onSelectRoom: (room: Room) => void
  className?: string
}

export function RoomSelector({
  rooms,
  selectedRoomId,
  onSelectRoom,
  className = "",
}: RoomSelectorProps): ReactElement | null {
  if (!rooms || rooms.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider min-w-16">
        Săli:
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {rooms.map((room) => {
          const isSelected = room.id === selectedRoomId
          const availableSeatsCount = room.seats.filter((s) => s.isAvailable).length
          const totalSeatsCount = room.seats.length

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelectRoom(room)}
              className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer shadow-2xs ${
                isSelected
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-xs scale-[1.02]"
                  : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--accent)]/50"
              }`}
            >
              {/* Active Indicator Dot */}
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isSelected
                    ? "bg-[var(--primary-foreground)]"
                    : availableSeatsCount > 0
                      ? "bg-[var(--primary)]"
                      : "bg-[var(--destructive)]"
                }`}
              />

              {/* Room Name */}
              <span className="font-semibold tracking-tight">{room.name}</span>

              {/* Available count badge */}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium transition-colors ${
                  isSelected
                    ? "bg-black/20 text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                }`}
              >
                {availableSeatsCount}/{totalSeatsCount}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
