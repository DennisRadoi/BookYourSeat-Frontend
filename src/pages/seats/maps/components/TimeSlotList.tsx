import React from "react"
import { Button } from "@/components/ui"

export type TimeSlotListProps = {
  slots: string[]
  selected: string
  onSelect: (t: string) => void
  isDisabled?: (t: string) => boolean
  containerRef?: React.RefObject<HTMLDivElement>
  dataAttr?: string
}

export function TimeSlotList({
  slots,
  selected,
  onSelect,
  isDisabled = () => false,
  containerRef,
  dataAttr = "data-timeslot",
}: TimeSlotListProps) {
  return (
    <div ref={containerRef} className="space-y-1 max-h-44 overflow-y-auto pr-1">
      {slots.map((t) => {
        const disabled = isDisabled(t)
        return (
          <Button
            key={t}
            {...{ [dataAttr]: t }}
            type="button"
            variant={selected === t ? "default" : "ghost"}
            size="xs"
            onClick={() => !disabled && onSelect(t)}
            disabled={disabled}
            className="w-full text-left justify-start px-2.5 py-1.5 text-xs font-medium"
          >
            {t}
          </Button>
        )
      })}
    </div>
  )
}

export default TimeSlotList
