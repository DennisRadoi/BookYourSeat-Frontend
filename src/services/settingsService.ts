import { defaultSettings } from "@/data"
import type { UserSettings } from "@/types"

let currentSettings: UserSettings = { ...defaultSettings }

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Replace mock data with backend API integration
export async function getUserSettings(): Promise<UserSettings> {
  await delay()
  return structuredClone(currentSettings)
}

export async function updateUserSettings(settingsUpdate: Partial<UserSettings>): Promise<UserSettings> {
  await delay()
  currentSettings = {
    ...currentSettings,
    ...settingsUpdate,
  }
  return structuredClone(currentSettings)
}
