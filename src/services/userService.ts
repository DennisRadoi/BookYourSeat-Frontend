import { users, currentUserId } from "@/data"
import type { User, UserPreferences } from "@/types"

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))
let currentPassword = "password123"

// TODO: Replace mock data with backend API integration
export async function getCurrentUser(): Promise<User> {
  await delay()
  const user = users.find((item) => item.id === currentUserId)
  if (!user) {
    throw new Error("Utilizatorul curent nu a fost găsit.")
  }
  return structuredClone(user)
}

export async function updateUserProfile(
  userId: number,
  updates: Partial<Pick<User, "firstName" | "lastName" | "email" | "department" | "domiciliu" | "phone" | "hireDate" | "avatarUrl">>,
): Promise<User> {
  await delay()
  const userIndex = users.findIndex((item) => item.id === userId)
  if (userIndex === -1) {
    throw new Error(`Utilizatorul cu ID-ul ${userId} nu a fost găsit.`)
  }
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
  }
  return structuredClone(users[userIndex])
}

export async function updateUserPreferences(
  userId: number,
  preferenceUpdates: Partial<UserPreferences>,
): Promise<User> {
  await delay()
  const userIndex = users.findIndex((item) => item.id === userId)
  if (userIndex === -1) {
    throw new Error(`Utilizatorul cu ID-ul ${userId} nu a fost găsit.`)
  }
  users[userIndex].preferences = {
    ...users[userIndex].preferences,
    ...preferenceUpdates,
  }
  return structuredClone(users[userIndex])
}

// Mock implementation; replace with an authenticated backend endpoint in production.
export async function changeCurrentUserPassword(current: string, next: string): Promise<void> {
  await delay()
  if (current !== currentPassword) throw new Error("Parola curentă nu este corectă.")
  if (next.length < 8) throw new Error("Parola nouă trebuie să conțină minimum 8 caractere.")
  currentPassword = next
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
