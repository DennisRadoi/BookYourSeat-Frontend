import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  WeeklyCalendarCard,
  UpcomingReservationsCard,
  FavoriteColleaguesCard,
  AIInsightsPanel,
} from "@/features/dashboard"
import {
  getCurrentUser,
  getDetailedReservationsByUserId,
  getColleagues,
  getDefaultInsights,
  getAIInsights,
  type InsightContext,
} from "@/services"
import { formatDateIso } from "@/utils"
import type { User, DetailedReservation, Colleague, AIInsightsData } from "@/types"

export default function HomePage() {
  const navigate = useNavigate()
  const today = new Date()
  const todayIso = formatDateIso(today)

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [reservations, setReservations] = useState<DetailedReservation[]>([])
  const [colleaguesList, setColleaguesList] = useState<Colleague[]>([])
  const [insightsData, setInsightsData] = useState<AIInsightsData | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayIso)

  const hasApiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY)

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [userData, defaultInsightData, allColleagues] = await Promise.all([
          getCurrentUser(),
          getDefaultInsights(),
          getColleagues(),
        ])
        setCurrentUser(userData)
        setInsightsData(defaultInsightData)
        setColleaguesList(allColleagues)

        const userReservations = await getDetailedReservationsByUserId(userData.id)
        setReservations(userReservations)
      } catch (error) {
        console.error("Eroare la încărcarea datelor:", error)
      }
    }

    loadInitialData()
  }, [])

  const handleFetchAiInsights = useCallback(async () => {
    if (!currentUser || !insightsData) return
    setIsAiLoading(true)
    try {
      const insightContext: InsightContext = {
        user: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          role: currentUser.role,
          department: currentUser.department,
          preferences: {
            preferredFloor: currentUser.preferences.preferredFloor,
            preferredArea: currentUser.preferences.preferredArea,
            preferredDays: currentUser.preferences.preferredDays,
            workPreferences: currentUser.preferences.workPreferences,
          },
        },
        reservations: reservations.map((r) => ({
          date: r.date,
          startTime: r.startTime,
          endTime: r.endTime,
          status: r.status,
          seat: r.seat,
          floor: r.floor,
          location: r.location,
        })),
        colleaguesInOfficeToday: colleaguesList.filter((c) => c.status === "La birou").length,
        totalColleagues: 30,
        currentDate: today.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" }),
        currentTime: today.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
      }

      await getAIInsights(insightContext)

      const leaveTime = new Date(new Date().getTime() + 23 * 60000)
      const hours = String(leaveTime.getHours()).padStart(2, "0")
      const minutes = String(leaveTime.getMinutes()).padStart(2, "0")

      setInsightsData((prev) =>
        prev
          ? {
              ...prev,
              departure: {
                ...prev.departure,
                time: `${hours}:${minutes}`,
              },
            }
          : null,
      )
    } finally {
      setIsAiLoading(false)
    }
  }, [currentUser, reservations, colleaguesList, insightsData, today])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-5 min-w-0">
        <WeeklyCalendarCard
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          reservations={reservations}
          onNavigateToSeats={() => navigate("/seats")}
        />

        <UpcomingReservationsCard
          reservations={reservations}
          onNavigateToSeats={() => navigate("/seats")}
        />

        <FavoriteColleaguesCard
          colleagues={colleaguesList}
          totalColleaguesCount={30}
          onNavigateToCompany={() => navigate("/companie")}
        />
      </div>

      <div className="lg:sticky lg:top-0 flex flex-col gap-4">
        {insightsData && (
          <AIInsightsPanel
            insightsData={insightsData}
            isLoading={isAiLoading}
            onRefresh={handleFetchAiInsights}
            hasApiKey={hasApiKey}
            onReserveAdjacent={() => navigate("/seats")}
          />
        )}
      </div>
    </div>
  )
}
