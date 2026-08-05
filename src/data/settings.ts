import type { UserSettings } from "@/types"

// TODO: Replace mock data with backend API integration
export const defaultSettings: UserSettings = {
  autoReserve: true,
  notificationsEnabled: true,
  defaultStartTime: "09:00",
  defaultEndTime: "18:00",
  preferredFloor: 0,
  preferredArea: "window",
  preferredDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
}

export const availableFloors = ["Parter", "Etaj 1", "Etaj 2"]
export const availableWorkspaceTypes = [
  "Lângă fereastră",
  "Zone liniștite",
  "Zone deschise",
  "Lângă cafenea",
  "Colțuri izolate",
]
export const availableWeekdays = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"]
