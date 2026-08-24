import { apiClient } from "./apiClient"
import { withCache } from "./cache"

interface BuildingResponse {
  id: number
  name: string
}

export function getBuildings(): Promise<BuildingResponse[]> {
  return withCache("buildings", () => apiClient.get<BuildingResponse[]>("/buildings"), 300_000) // 5 min
}

