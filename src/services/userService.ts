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
      workPreferences:    [be.nearWindow ? "Lângă fereastră" : "", be.quietPlace ? "Loc liniștit" : ""].filter(Boolean),
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
  userId: number,
  updates: Partial<Pick<User, "firstName" | "lastName" | "email" | "department" | "domiciliu" | "phone" | "hireDate" | "avatarUrl">>,
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
  if (preferenceUpdates.workPreferences !== undefined) {
    body.nearWindow = preferenceUpdates.workPreferences.includes("Lângă fereastră")
    body.quietPlaces = preferenceUpdates.workPreferences.includes("Loc liniștit")
  }

  const data = await apiClient.patch<BeMyAccountResponse>("/users/me/preferences", body)
  return mapToUser(data)
}

// Endpoint de schimbare parolă nu este disponibil în backend deocamdată.
export async function changeCurrentUserPassword(current: string, next: string): Promise<void> {
  await apiClient.patch<void>("/users/me/change-password", {
    currentPassword: current,
    newPassword: next,
  })
}

export interface AddressFormData { county: string; locality: string; street: string; number: string; apartmentBlock: string; floor: string; postalCode: string }
export interface OnboardingData { departmentName: string; phoneNumber: string; role: string; employmentDate: string; address: AddressFormData }

export function completeOnboarding(data: OnboardingData): Promise<User> {
  return apiClient.patch<BeMyAccountResponse>("/users/me", {
    departmentName: data.departmentName,
    phoneNumber: data.phoneNumber,
    role: data.role,
    employmentDate: data.employmentDate,
    updateMyAdressRequest: { ...data.address, floor: data.address.floor ? Number(data.address.floor) : null },
  }).then(mapToUser)
}

export function updateUserAddress(address: AddressFormData): Promise<User> {
  return apiClient.patch<BeMyAccountResponse>("/users/me", {
    updateMyAdressRequest: { ...address, floor: address.floor ? Number(address.floor) : null },
  }).then(mapToUser)
}

export function getDepartments(): Promise<Array<{ id: number; name: string }>> {
  return apiClient.get<Array<{ id: number; name: string }>>("/departments")
}

export async function registerUser(userData: { firstName: string; lastName: string; email: string }): Promise<User> {
  await delay()
  const newUser: User = {
    id: Date.now(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    initials: `${userData.firstName[0] || ""}${userData.lastName[0] || ""}`.toUpperCase(),
    email: userData.email,
    role: "User",
    department: "General",
    isOnline: true,
    avatarUrl: null,
    domiciliu: "",
    isFirstTimeUser: true,
    preferences: {
      preferredFloor: 1,
      preferredArea: "window",
      preferredStartTime: "09:00",
      preferredDays: [],
      workPreferences: [],
      preferredLocation: "",
      favoriteColleagueIds: [],
    },
  }

  users.push(newUser)
  return newUser
}
