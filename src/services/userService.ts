import { apiClient } from "./apiClient"
import type { User, UserPreferences } from "@/types"

// ─── User Service ──────────────────────────────────────────────────────────────
// GET   /users/me              → MyAccountResponse
// PATCH /users/me              → actualizare profil
// PATCH /users/me/preferences  → actualizare preferințe

// ─── Tipuri BE ────────────────────────────────────────────────────────────────

interface BeMyAccountResponse {
  firstName: string
  lastName: string
  email: string
  departmentName: string | null
  formatedAdress: string | null
  profilePhoto: string | null
  quietPlace: boolean
  nearWindow: boolean
  preferedColleague: string | null
}

// ─── Mapare BE → User FE ──────────────────────────────────────────────────────

function mapToUser(be: BeMyAccountResponse & { id?: number; userId?: number }): User {
  const initials =
    (be.firstName?.[0] ?? "").toUpperCase() + (be.lastName?.[0] ?? "").toUpperCase()

  return {
    id:         be.id ?? be.userId ?? 0,
    firstName:  be.firstName,
    lastName:   be.lastName,
    initials,
    email:      be.email,
    role:       "",
    department: be.departmentName ?? "",
    isOnline:   true,
    avatarUrl:  be.profilePhoto ?? null,
    domiciliu:  be.formatedAdress ?? undefined,
    preferences: {
      preferredFloor:     1,
      preferredArea:      be.nearWindow ? "window" : (be.quietPlace || (be as any).quietPlaces) ? "quiet" : "open",
      preferredStartTime: "09:00",
      preferredDays:      [],
      workPreferences:    [],
    },
  }
}

// ─── API ───────────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User> {
  const data = await apiClient.get<BeMyAccountResponse>("/users/me")
  return mapToUser(data)
}

export async function updateUserProfile(
  _userId: number,
  updates: Partial<Pick<User, "firstName" | "lastName" | "email" | "department" | "domiciliu">>,
): Promise<User> {
  const body: Record<string, unknown> = {}
  if (updates.firstName !== undefined || updates.lastName !== undefined) {
    body.fullname = `${updates.firstName ?? ""} ${updates.lastName ?? ""}`.trim()
  }
  if (updates.email !== undefined)      body.email = updates.email
  if (updates.department !== undefined) body.departmentName = updates.department

  const data = await apiClient.patch<BeMyAccountResponse>("/users/me", body)
  return mapToUser(data)
}

export async function updateUserPreferences(
  _userId: number,
  preferenceUpdates: Partial<UserPreferences>,
): Promise<User> {
  const body: Record<string, unknown> = {}
  if (preferenceUpdates.preferredArea !== undefined) {
    body.nearWindow   = preferenceUpdates.preferredArea === "window"
    body.quietPlaces  = preferenceUpdates.preferredArea === "quiet"
  }

  const data = await apiClient.patch<BeMyAccountResponse>("/users/me/preferences", body)
  return mapToUser(data)
}

// Endpoint de schimbare parolă nu este disponibil în backend deocamdată.
let currentPassword = "password123"

export async function changeCurrentUserPassword(current: string, next: string): Promise<void> {
  if (current !== currentPassword) throw new Error("Parola curentă nu este corectă.")
  if (next.length < 8) throw new Error("Parola nouă trebuie să conțină minimum 8 caractere.")
  currentPassword = next
}
