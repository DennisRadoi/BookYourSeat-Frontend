import { useEffect, useState } from "react"

export function useLiveClock(updateIntervalMs = 1000) {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date())
    }, updateIntervalMs)

    return () => clearInterval(timerId)
  }, [updateIntervalMs])

  return currentDateTime
}
