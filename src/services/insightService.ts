import { defaultInsights, OFFICE_ADDRESS } from "@/data"
import type { AIInsightsData } from "@/types"
import { getAIInsightsData, type InsightContext } from "./geminiService"

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Replace mock data with backend API integration
export async function getDefaultInsights(): Promise<AIInsightsData> {
  await delay()
  return structuredClone(defaultInsights)
}

export async function calculateRouteInsights(context: InsightContext): Promise<AIInsightsData> {
  return getAIInsightsData({
    ...context,
    officeAddress: context.officeAddress || OFFICE_ADDRESS,
  })
}

export { OFFICE_ADDRESS }
