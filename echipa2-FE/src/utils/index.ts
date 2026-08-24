import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ReservationStatus } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DAY_LABELS_SHORT = ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"]
export const DAY_LABELS_FULL = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"]
export const MONTH_LABELS = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function getWeekDays(referenceDate: Date): Date[] {
  const dayOfWeek = referenceDate.getDay()
  const monday = new Date(referenceDate)
  monday.setDate(referenceDate.getDate() - ((dayOfWeek + 6) % 7))
  return Array.from({ length: 5 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)
    return day
  })
}

export function formatDateIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getStatusLabel(status: ReservationStatus | string): string {
  switch (status) {
    case "confirmed":
      return "Confirmat"
    case "pending":
      return "În așteptare"
    case "completed":
      return "Finalizat"
    case "cancelled":
      return "Anulat"
    default:
      return status
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
