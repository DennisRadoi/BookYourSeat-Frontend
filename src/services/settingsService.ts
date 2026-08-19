import { apiClient } from "./apiClient"
import type { UserSettings } from "@/types"

// ─── Settings Service ──────────────────────────────────────────────────────────
// GET   /users/me/settings                    → setările curente
// PATCH /users/me/settings/preferences        → actualizează setările

// ─── Tipuri BE ────────────────────────────────────────────────────────────────

interface BeMySettingsResponse {
  quietPlace: boolean
  nearWindow: boolean
  daysOfWeek: string          // ex: "MONDAY,WEDNESDAY,FRIDAY"
  preferredStartTime: string  // ex: "09:00"
  preferredEndTime: string    // ex: "17:00"
  reminderBeforeBooking: boolean
  bookingConfirmationOnEmail: boolean
}

// ─── Mapare BE → UserSettings FE ──────────────────────────────────────────────

function mapToUserSettings(be: BeMySettingsResponse): UserSettings {
  return {
    autoReserve:          be.reminderBeforeBooking ?? false,
    notificationsEnabled: be.bookingConfirmationOnEmail ?? true,
    defaultStartTime:     be.preferredStartTime ?? "09:00",
    defaultEndTime:       be.preferredEndTime ?? "17:00",
    preferredFloor:       1,    // BE nu returnează etaj în settings
    preferredArea:        be.nearWindow ? "window" : be.quietPlace ? "quiet" : "open",
    preferredDays:        parseDays(be.daysOfWeek),
  }
}

type Weekday = UserSettings["preferredDays"][number]

function parseDays(daysStr: string): Weekday[] {
  if (!daysStr) return []
  const map: Record<string, Weekday> = {
    "1":       "monday",
    "2":       "tuesday",
    "3":       "wednesday",
    "4":       "thursday",
    "5":       "friday",
    "6":       "saturday",
    "7":       "sunday",
    MONDAY:    "monday",
    TUESDAY:   "tuesday",
    WEDNESDAY: "wednesday",
    THURSDAY:  "thursday",
    FRIDAY:    "friday",
    SATURDAY:  "saturday",
    SUNDAY:    "sunday",
  }
  return daysStr
    .split(",")
    .map((d) => map[d.trim().toUpperCase()])
    .filter(Boolean) as Weekday[]
}

function formatDays(days: Weekday[]): string {
  const map: Record<Weekday, string> = {
    monday:    "MONDAY",
    tuesday:   "TUESDAY",
    wednesday: "WEDNESDAY",
    thursday:  "THURSDAY",
    friday:    "FRIDAY",
    saturday:  "SATURDAY",
    sunday:    "SUNDAY",
  }
  return days.map((d) => map[d]).join(",")
}

// ─── API ───────────────────────────────────────────────────────────────────────

export async function getUserSettings(): Promise<UserSettings> {
  const data = await apiClient.get<BeMySettingsResponse>("/users/me/settings")
  return mapToUserSettings(data)
}

export async function updateUserSettings(settingsUpdate: Partial<UserSettings>): Promise<UserSettings> {
  const body: Record<string, unknown> = {}

  if (settingsUpdate.defaultStartTime !== undefined)
    body.preferredStartTime = settingsUpdate.defaultStartTime
  if (settingsUpdate.defaultEndTime !== undefined)
    body.preferredEndTime = settingsUpdate.defaultEndTime
  if (settingsUpdate.preferredDays !== undefined)
    body.daysOfWeek = formatDays(settingsUpdate.preferredDays)
  if (settingsUpdate.notificationsEnabled !== undefined)
    body.receivesNotificationOnEmail = settingsUpdate.notificationsEnabled
  if (settingsUpdate.autoReserve !== undefined)
    body.reminderBeforeBooking = settingsUpdate.autoReserve

  const data = await apiClient.patch<BeMySettingsResponse>("/users/me/settings/preferences", body)
  return mapToUserSettings(data)
}

export async function updatePreferredBuilding(preferredBuilding: string): Promise<void> {
  await apiClient.patch<void>("/users/me/settings/preferences", { preferredBuilding })
}
