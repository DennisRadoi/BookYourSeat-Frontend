import { apiClient } from "./apiClient"
import type { Colleague } from "@/types"

// ─── Colleague Service ─────────────────────────────────────────────────────────
// GET    /users?search=&status=&floor=&favorite=&page=0&size=5  → paginated colegi
// GET    /users/me/favorites                                     → lista favorite
// GET    /users/{id}                                             → profil coleg
// PUT    /users/me/favorites/{id}                                → adaugă favorit
// DELETE /users/me/favorites/{id}                                → șterge favorit

// ─── Tipuri BE ────────────────────────────────────────────────────────────────

interface BeColleagueResponse {
  id: number
  fullname: string
  role: string
  status: string       // ex: "La birou", "Remote"
  location: string     // ex: "Etaj 2"
  building?: string | null
  room?: string | null
  isFavorite: boolean
}

interface BePageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// ─── Mapare BE → Colleague FE ──────────────────────────────────────────────────

function colleagueLocation(c: BeColleagueResponse): string {
  const parts = [c.building, c.location != null ? `Etaj ${c.location}` : null, c.room].filter(Boolean)
  return parts.join(" · ") || "—"
}

function mapToColleague(c: BeColleagueResponse): Colleague {
  return {
    id:         c.id,
    initials:   c.fullname
                  .split(" ")
                  .map((w) => w[0]?.toUpperCase() ?? "")
                  .join("")
                  .substring(0, 2),
    name:       c.fullname,
    role:       c.role,
    color:      "#6366f1",
    floor:      colleagueLocation(c),
    status:     (c.status === "La birou" || String(c.status).toLowerCase().includes("birou") || String(c.status).toLowerCase().includes("office") ? "La birou" : "Remote") as Colleague["status"],
    isFavorite: c.isFavorite,
  }
}

// ─── API ───────────────────────────────────────────────────────────────────────

export interface GetColleaguesParams {
  search?: string
  status?: string
  floor?: number
  building?: string
  favorite?: boolean
  page?: number
  size?: number
}

export interface ColleaguesPage {
  colleagues: Colleague[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ColleagueProfile {
  fullname: string
  departmentName: string | null
  role: string | null
  quietPlace: boolean
  nearWindow: boolean
  profilePhoto: string | null
  preferredStartTime: string | null
  daysOfWeek: string | null
  location: string | null
  isFavorite: boolean
  bookingDto: Array<{ dateOfBooking: string; startTime: string; endTime: string; floor: number; building: string }>
}

export async function getColleaguesPage(params: GetColleaguesParams = {}): Promise<ColleaguesPage> {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.status) query.set("status", params.status)
  if (params.floor != null) query.set("floor", String(params.floor))
  if (params.building) query.set("building", params.building)
  if (params.favorite != null) query.set("favorite", String(params.favorite))
  query.set("page", String(params.page ?? 0))
  query.set("size", String(params.size ?? 10))

  const data = await apiClient.get<BePageResponse<BeColleagueResponse>>(`/users?${query.toString()}`)
  return {
    colleagues: (data.content ?? []).map(mapToColleague),
    page: data.page,
    size: data.size,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
  }
}

export async function getColleagues(params: GetColleaguesParams = {}): Promise<Colleague[]> {
  const result = await getColleaguesPage({ ...params, size: params.size ?? 500 })
  return result.colleagues
}

export async function getFavoriteColleagues(): Promise<Colleague[]> {
  const data = await apiClient.get<BeColleagueResponse[]>("/users/me/favorites")
  return data.map((c) => mapToColleague(c))
}

export async function getColleagueById(colleagueId: number): Promise<Colleague | null> {
  const data = await apiClient.get<BeColleagueResponse>(`/users/${colleagueId}`)
  return mapToColleague(data)
}

export function getColleagueProfile(colleagueId: number): Promise<ColleagueProfile> {
  return apiClient.get<ColleagueProfile>(`/users/${colleagueId}`)
}

export async function toggleFavoriteColleague(colleagueId: number): Promise<Colleague> {
  // Citim starea curentă pentru a decide add sau remove
  const favorites = await getFavoriteColleagues()
  const isFav = favorites.some((c) => c.id === colleagueId)

  if (isFav) {
    await apiClient.delete(`/users/me/favorites/${colleagueId}`)
  } else {
    await apiClient.post(`/users/me/favorites/${colleagueId}`)
  }

  // Returnăm colegul cu starea actualizată
  const updated = await getColleagueById(colleagueId)
  if (!updated) throw new Error(`Colegul cu ID-ul ${colleagueId} nu a fost găsit.`)
  return { ...updated, isFavorite: !isFav }
}
