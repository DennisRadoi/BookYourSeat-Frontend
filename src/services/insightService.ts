import { defaultInsights } from "@/data"
import type { AIInsightsData } from "@/types"

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Replace mock data with backend API integration
export async function getDefaultInsights(): Promise<AIInsightsData> {
  await delay()
  return structuredClone(defaultInsights)
}
