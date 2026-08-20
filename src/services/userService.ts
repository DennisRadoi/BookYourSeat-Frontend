import { apiClient } from "./apiClient"
import { withCache, invalidateCache } from "./cache"
import type { User, UserPreferences } from "@/types"

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

function mapToUser(be: BeMyAccountResponse & { id?: number; userId?: number }): User {
  const initials = (be.firstName?.[0] ?? "").toUpperCase() + (be.lastName?.[0] ?? "").toUpperCase()
  return {
    id: be.id ?? be.userId ?? 0,
    firstName: be.firstName,
    lastName: be.lastName,
    initials,
    email: be.email,
    role: "",
    department: be.departmentName ?? "",
    isOnline: true,
    avatarUrl: be.profilePhoto ?? null,
    domiciliu: be.formatedAdress ?? undefined,
    preferences: {
      preferredFloor: 1,
      preferredArea: be.nearWindow ? "window" : (be.quietPlace || (be as { quietPlaces?: boolean }).quietPlaces) ? "quiet" : "open",
      preferredStartTime: "09:00",
      preferredDays: [],
      workPreferences: [be.nearWindow ? "Lângă fereastră" : "", be.quietPlace ? "Loc liniștit" : ""].filter(Boolean),
    },
  }
}

export async function getCurrentUser(): Promise<User> {
  return withCache("currentUser", async () => mapToUser(await apiClient.get<BeMyAccountResponse>("/users/me")), 300_000) // 5 min
}


export async function updateUserProfile(
  _userId: number,
  updates: Partial<Pick<User, "firstName" | "lastName" | "email" | "department" | "domiciliu" | "phone" | "hireDate" | "avatarUrl">>,
): Promise<User> {
  const body: Record<string, unknown> = {}
  if (updates.firstName !== undefined || updates.lastName !== undefined) body.fullname = `${updates.firstName ?? ""} ${updates.lastName ?? ""}`.trim()
  if (updates.email !== undefined) body.email = updates.email
  if (updates.department !== undefined) body.departmentName = updates.department
  const result = mapToUser(await apiClient.patch<BeMyAccountResponse>("/users/me", body))
  invalidateCache("currentUser")
  return result
}

export async function updateUserPreferences(_userId: number, preferenceUpdates: Partial<UserPreferences>): Promise<User> {
  const body: Record<string, unknown> = {}
  if (preferenceUpdates.preferredArea !== undefined) {
    body.nearWindow = preferenceUpdates.preferredArea === "window"
    body.quietPlaces = preferenceUpdates.preferredArea === "quiet"
  }
  if (preferenceUpdates.workPreferences !== undefined) {
    body.nearWindow = preferenceUpdates.workPreferences.includes("Lângă fereastră")
    body.quietPlaces = preferenceUpdates.workPreferences.includes("Loc liniștit")
  }
  return mapToUser(await apiClient.patch<BeMyAccountResponse>("/users/me/preferences", body))
}

export async function changeCurrentUserPassword(current: string, next: string): Promise<void> {
  await apiClient.patch<void>("/users/me/change-password", { currentPassword: current, newPassword: next })
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
