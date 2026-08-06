import { analyticsDashboardData } from "@/data/analytics"
import type { AnalyticsDashboardData } from "@/types"

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  await delay()
  return structuredClone(analyticsDashboardData)
}
