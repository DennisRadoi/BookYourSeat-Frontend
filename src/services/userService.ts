import { apiClient, getToken } from "./apiClient"
import { withCache, invalidateCache, invalidateCachePrefix } from "./cache"
import type { User, UserPreferences } from "@/types"

const PROFILE_PHOTO_STORAGE_KEY = "profile_photo_data_url"

function getStoredProfilePhoto(): string | null {
  try {
    return localStorage.getItem(PROFILE_PHOTO_STORAGE_KEY)
  } catch {
    return null
  }
}

function setStoredProfilePhoto(avatarUrl: string | null): void {
  try {
    if (avatarUrl) {
      localStorage.setItem(PROFILE_PHOTO_STORAGE_KEY, avatarUrl)
      return
    }
    localStorage.removeItem(PROFILE_PHOTO_STORAGE_KEY)
  } catch {
    // Ignore storage errors in browsers that block localStorage access.
  }
}

interface BeMyAccountResponse {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  departmentName: string | null
  formatedAdress: string | null
  profilePhoto: string | null
  quietPlace: boolean
  nearWindow: boolean
  preferedColleague: string | null
}

function mapToUser(be: BeMyAccountResponse & { id?: number; userId?: number }): User {
  const initials = (be.firstName?.[0] ?? "").toUpperCase() + (be.lastName?.[0] ?? "").toUpperCase()
  const storedProfilePhoto = getStoredProfilePhoto()
  
  // Construct the full profile photo URL from the filename
  let avatarUrl: string | null = null
  if (be.profilePhoto) {
  // Accept data URLs (stored in DB), full URLs, absolute server paths or filenames
  if (be.profilePhoto.startsWith("data:")) {
      avatarUrl = be.profilePhoto
  } else if (be.profilePhoto.startsWith("http")) {
    avatarUrl = be.profilePhoto
  } else if (be.profilePhoto.startsWith("/")) {
    // profilePhoto is a rooted path (e.g. /api/uploads/profile-photos/xyz)
    const apiBase = import.meta.env.DEV ? "/backend" : (import.meta.env.VITE_API_BASE_URL || "http://localhost:8081")
    avatarUrl = `${apiBase.replace(/\/api$/, "")}${be.profilePhoto}`
  } else {
    // Construct the URL from the filename
    const apiBase = import.meta.env.DEV ? "/backend" : (import.meta.env.VITE_API_BASE_URL || "http://localhost:8081")
    avatarUrl = `${apiBase.replace(/\/api$/, "")}/api/uploads/profile-photos/${be.profilePhoto}`
  }
  } else if (storedProfilePhoto) {
  avatarUrl = storedProfilePhoto
  }

  return {
    id: be.id ?? be.userId ?? 0,
    firstName: be.firstName,
    lastName: be.lastName,
    initials,
    email: be.email,
    phone: be.phoneNumber ?? undefined,
    role: "",
    department: be.departmentName ?? "",
    isOnline: true,
    avatarUrl,
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

function parseDays(daysStr: string | null | undefined): Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"> {
  if (!daysStr) return []
  const map: Record<string, "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"> = {
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
    .filter(Boolean) as Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday">
}

export async function getCurrentUser(): Promise<User> {
  const token = getToken()
  if (!token) {
    throw new Error("No token available")
  }
  return withCache("currentUser", async () => {
    const [me, settings] = await Promise.all([
      apiClient.get<BeMyAccountResponse>("/users/me"),
      apiClient.get<{ preferredStartTime?: string; daysOfWeek?: string }>("/users/me/settings").catch(() => ({}) as Record<string, string | undefined>),
    ])
    const user = mapToUser(me)
    if (settings) {
      if (settings.preferredStartTime) {
        user.preferences.preferredStartTime = settings.preferredStartTime
      }
      if (settings.daysOfWeek) {
        user.preferences.preferredDays = parseDays(settings.daysOfWeek)
      }
    }
    return user
  }, 300_000) // 5 min
}



export async function uploadProfilePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Doar fișierele imagine sunt permise.")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Poza de profil trebuie să fie mai mică de 5 MB.")
  }

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await apiClient.postFormData<string>("/users/me/profile-photo", formData)
    invalidateCache("currentUser")
  // Invalidate colleagues cache so lists refresh with the new avatar
  invalidateCachePrefix("colleagues")
  return response
  } catch (error) {
  throw error
  }
}

export async function removeProfilePhoto(): Promise<void> {
  try {
    await apiClient.delete<void>("/users/me/profile-photo")
    invalidateCache("currentUser")
  } catch (error) {
    throw error
  }
}

export async function updateUserProfile(
  _userId: number,
  updates: Partial<Pick<User, "firstName" | "lastName" | "email" | "department" | "domiciliu" | "phone" | "hireDate" | "avatarUrl">>,
): Promise<User> {
  const body: Record<string, unknown> = {}
  if (updates.firstName !== undefined || updates.lastName !== undefined) body.fullname = `${updates.firstName ?? ""} ${updates.lastName ?? ""}`.trim()
  if (updates.email !== undefined) body.email = updates.email
  if (updates.phone !== undefined) body.phoneNumber = updates.phone
  if (updates.department !== undefined) body.departmentName = updates.department
  if (updates.avatarUrl === null) {
    setStoredProfilePhoto(null)
  } else if (updates.avatarUrl !== undefined) {
    setStoredProfilePhoto(updates.avatarUrl)
    body.profilePhoto = updates.avatarUrl
  }
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
    updateMyAdressRequest: { ...data.address, floor: data.address.floor ? Number(data.address.floor) : null, clearApartmentBlock: false, clearFloor: false },
  }).then(mapToUser)
}

export function updateUserAddress(address: AddressFormData): Promise<User> {
  const update = Object.fromEntries(
    Object.entries(address)
      .filter(([key, value]) => key === "floor" ? Boolean(String(value).trim()) : Boolean(String(value).trim())),
  ) as Partial<AddressFormData>
  return apiClient.patch<BeMyAccountResponse>("/users/me", {
    updateMyAdressRequest: {
      ...update,
      floor: update.floor ? Number(update.floor) : undefined,
      clearApartmentBlock: !address.apartmentBlock.trim(),
      clearFloor: !address.floor.trim(),
    },
  }).then(mapToUser)
}

export function getDepartments(): Promise<Array<{ id: number; name: string }>> {
  return apiClient.get<Array<{ id: number; name: string }>>("/departments")
}
