import type { ReactElement, ReactNode } from "react"
import { SeatLegend } from "./SeatLegend"
import { RoomEntrance } from "./RoomDecorators"

export interface RoomContainerProps {
  roomName?: string
  availableCount: number
  occupiedCount: number
  selectedCount: number
  entrancePosition?: "top" | "bottom" | "none"
  entranceLabel?: string
  minHeight?: string
  className?: string
  children: ReactNode
}

/**
 * Standardized container layout for all room maps across Corp T1, T2 & Parter:
 * Enforces unified styling, spacing, entrance placement, and live seat count legends.
 */
export function RoomContainer({
  roomName,
  availableCount,
  occupiedCount,
  selectedCount,
  entrancePosition = "top",
  entranceLabel = "Intrare",
  minHeight = "min-h-[520px] sm:min-h-[580px]",
  className = "",
  children,
}: RoomContainerProps): ReactElement {
  return (
    <div
      className={`relative w-full rounded-3xl border-2 border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-colors ${className}`}
    >
      {/* Optional Room Header */}
      {roomName && (
        <div className="mb-4">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider text-[var(--muted-foreground)] uppercase">
            {roomName}
          </h2>
        </div>
      )}

      {/* Main Room Canvas */}
      <div
        className={`relative w-full ${minHeight} rounded-2xl border-2 border-[var(--border)]/70 bg-[var(--background)]/40 p-6 sm:p-8 flex flex-col justify-between select-none overflow-hidden`}
      >
        {/* Top Entrance */}
        {entrancePosition === "top" && (
          <RoomEntrance label={entranceLabel} position="top" />
        )}

        {/* Room Inner Content */}
        {children}

        {/* Bottom Entrance */}
        {entrancePosition === "bottom" && (
          <RoomEntrance label={entranceLabel} position="bottom" />
        )}
      </div>

      {/* Bottom Footer Legend */}
      <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <SeatLegend
          availableCount={availableCount}
          occupiedCount={occupiedCount}
          selectedCount={selectedCount}
        />
      </div>
    </div>
  )
}
