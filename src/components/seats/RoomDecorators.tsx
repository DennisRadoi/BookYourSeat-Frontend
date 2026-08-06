import type { ReactElement } from "react"

/**
 * Reusable Entrance Arch Marker for any room map
 */
export function RoomEntrance({
  label = "Intrare",
  position = "top",
  className = "",
}: {
  label?: string
  position?: "top" | "bottom" | "top-left" | "top-center" | "bottom-center"
  className?: string
}): ReactElement {
  if (position === "bottom" || position === "bottom-center") {
    return (
      <div
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 ${className}`}
      >
        <div className="w-20 sm:w-24 h-4 border-2 border-dashed border-[var(--border)] border-t-0 rounded-b-full bg-[var(--card)]" />
        <span className="text-[10px] font-medium text-[var(--muted-foreground)] mt-0.5">
          {label}
        </span>
      </div>
    )
  }

  if (position === "top-left") {
    return (
      <div
        className={`absolute -top-3 left-1/3 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 ${className}`}
      >
        <span className="text-[10px] text-[var(--muted-foreground)] font-medium mb-0.5">
          {label}
        </span>
        <div className="w-16 h-4 border-2 border-dashed border-[var(--border)] border-b-0 rounded-t-full bg-[var(--card)]" />
      </div>
    )
  }

  return (
    <div
      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 ${className}`}
    >
      <span className="text-[10px] font-semibold text-[var(--muted-foreground)] bg-[var(--card)] px-2.5 py-0.5 rounded-full border border-[var(--border)] shadow-2xs">
        {label}
      </span>
      <div className="w-20 sm:w-24 h-3.5 border-b-2 border-dashed border-[var(--border)] rounded-b-full bg-[var(--background)]/80" />
    </div>
  )
}

/**
 * Reusable TV / Display Screen Marker for any room map
 */
export function TvDisplay({
  orientation = "vertical",
  className = "",
}: {
  orientation?: "vertical" | "horizontal"
  className?: string
}): ReactElement {
  if (orientation === "horizontal") {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <div className="w-24 sm:w-32 h-3 bg-[var(--foreground)] text-[var(--background)] rounded-xs shadow-xs" />
        <span className="text-[9px] font-bold text-[var(--muted-foreground)] tracking-widest uppercase">
          TV
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-1.5 flex-shrink-0 ${className}`}>
      <div
        className="w-3.5 h-20 sm:h-28 bg-[var(--foreground)] text-[var(--background)] rounded-r-md sm:rounded-xs shadow-xs flex items-center justify-center"
        title="TV / Ecran Prezentare"
      >
        <span className="text-[8px] font-bold tracking-widest -rotate-90 uppercase text-[var(--background)] select-none">
          TV
        </span>
      </div>
      <span className="text-[9px] uppercase font-bold text-[var(--muted-foreground)] tracking-wider">
        TV
      </span>
    </div>
  )
}

/**
 * Reusable Window Segment Marker for walls
 */
export function WindowMarker({
  count = 3,
  className = "",
}: {
  count?: number
  className?: string
}): ReactElement {
  return (
    <div
      className={`absolute right-0 top-16 bottom-16 flex flex-col justify-between items-end pointer-events-none z-10 pr-0.5 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`window-${i}`}
          className="h-16 sm:h-24 w-2 sm:w-2.5 rounded-l-md bg-[var(--primary)]/20 border-y border-l border-[var(--primary)]/40 flex items-center justify-center"
        >
          <span className="text-[8px] font-semibold text-[var(--primary)] tracking-widest -rotate-90 select-none opacity-80">
            Fereastră
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Reusable Whiteboard / Tabla Marker for conference & meeting rooms
 */
export function WhiteboardMarker({
  className = "",
}: {
  className?: string
}): ReactElement {
  return (
    <div className={`flex flex-col items-center gap-1.5 flex-shrink-0 ${className}`}>
      <div
        className="w-3.5 h-20 sm:h-28 rounded-l-md sm:rounded-xs border-2 border-[var(--border)] bg-[var(--background)] shadow-xs flex items-center justify-center"
        title="Tablă / Whiteboard"
      >
        <div className="w-0.5 h-12 bg-[var(--border)]" />
      </div>
      <span className="text-[9px] font-semibold text-[var(--muted-foreground)] tracking-tight">
        Tablă
      </span>
    </div>
  )
}
