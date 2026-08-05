import { colleagues } from "@/data"
import type { Colleague } from "@/types"

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Replace mock data with backend API integration
export async function getColleagues(): Promise<Colleague[]> {
  await delay()
  return structuredClone(colleagues)
}

export async function getFavoriteColleagues(): Promise<Colleague[]> {
  await delay()
  return structuredClone(colleagues.filter((c) => c.isFavorite))
}

export async function toggleFavoriteColleague(colleagueId: number): Promise<Colleague> {
  await delay()
  const colleague = colleagues.find((c) => c.id === colleagueId)
  if (!colleague) {
    throw new Error(`Colegul cu ID-ul ${colleagueId} nu a fost găsit.`)
  }
  colleague.isFavorite = !colleague.isFavorite
  return structuredClone(colleague)
}
