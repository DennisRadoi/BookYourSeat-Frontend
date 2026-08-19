import { apiClient } from "./apiClient"

interface BuildingResponse {
  id: number
  name: string
}

export async function getBuildings(): Promise<BuildingResponse[]> {
  return apiClient.get<BuildingResponse[]>("/buildings")
}
