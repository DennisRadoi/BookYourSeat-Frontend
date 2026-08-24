import type { User } from "@/types"

export const users: User[] = [
  {
    id: 1,
    firstName: "Claudiu",
    lastName: "Ciupitu",
    initials: "CC",
    email: "claudiu.ciupitu@bys.ro",
    role: "Frontend Developer",
    department: "Engineering",
    isOnline: true,
    avatarUrl: null,
    domiciliu: "București, Nițu Vasile 58",
    isFirstTimeUser: true,
    preferences: {
      preferredFloor: 1,
      preferredArea: "window",
      preferredStartTime: "15:00",
      preferredDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      workPreferences: ["Lângă fereastră", "Zone liniștite", "Aproape de Ana P."],
    },
  },
  {
    id: 2,
    firstName: "Ana",
    lastName: "Popescu",
    initials: "AP",
    email: "ana.popescu@bys.ro",
    role: "UI/UX Designer",
    department: "Design",
    isOnline: false,
    avatarUrl: null,
    preferences: {
      preferredFloor: 2,
      preferredArea: "quiet",
      preferredStartTime: "08:30",
      preferredDays: ["monday", "wednesday", "friday"],
      workPreferences: ["Zone liniștite", "Aproape de echipă"],
    },
  },
  {
    id: 3,
    firstName: "Mihai",
    lastName: "Ionescu",
    initials: "MI",
    email: "mihai.ionescu@bys.ro",
    role: "Backend Developer",
    department: "Engineering",
    isOnline: true,
    avatarUrl: null,
    preferences: {
      preferredFloor: 1,
      preferredArea: "team",
      preferredStartTime: "10:00",
      preferredDays: ["tuesday", "wednesday", "thursday"],
      workPreferences: ["Aproape de echipă", "Birou reglabil"],
    },
  },
]

export const currentUserId = 1
