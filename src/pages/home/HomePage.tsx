import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  WeeklyCalendarCard,
  UpcomingReservationsCard,
  FavoriteColleaguesCard,
  AIInsightsPanel,
} from "./components"
import {
  getCurrentUser,
  getDetailedReservationsByUserId,
  getColleagues,
  getFavoriteColleagues,
  calculateRouteInsights,
  OFFICE_ADDRESS,
  type InsightContext,
} from "@/services"
import { formatDateIso } from "@/utils"
import type { User, DetailedReservation, Colleague, AIInsightsData } from "@/types"

export default function HomePage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [reservations, setReservations] = useState<DetailedReservation[]>([])
  const [colleaguesList, setColleaguesList] = useState<Colleague[]>([])
  const [insightsData, setInsightsData] = useState<AIInsightsData | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => formatDateIso(new Date()))

  const hasApiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY)

  const loadData = useCallback(async () => {
    try {
      const today = new Date()
      const [userData, allColleagues, favoriteColleagues] = await Promise.all([
        getCurrentUser(),
        getColleagues(),
        getFavoriteColleagues(),
      ])
      setCurrentUser(userData)
      setColleaguesList(favoriteColleagues)

      const userReservations = await getDetailedReservationsByUserId(userData.id)
      setReservations(userReservations)

      const context: InsightContext = {
        user: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          department: userData.department,
          domiciliu: userData.domiciliu || "București, Nițu Vasile 58",
          preferences: {
            preferredFloor: userData.preferences.preferredFloor,
            preferredArea: userData.preferences.preferredArea,
            preferredDays: userData.preferences.preferredDays,
            workPreferences: userData.preferences.workPreferences,
            preferredStartTime: userData.preferences.preferredStartTime || "15:00",
          },
        },
        officeAddress: OFFICE_ADDRESS,
        reservations: userReservations.map((r) => ({
          date: r.date,
          startTime: r.startTime,
          endTime: r.endTime,
          status: r.status,
          seat: r.seat,
          floor: r.floor,
          location: r.location,
        })),
        colleaguesInOfficeToday: allColleagues.filter((c) => c.status === "La birou").length,
        totalColleagues: 30,
        currentDate: today.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" }),
        currentTime: today.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
      }

      const generatedInsights = await calculateRouteInsights(context)
      setInsightsData(generatedInsights)
    } catch (error) {
      console.error("Eroare la încărcarea datelor:", error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFetchAiInsights = useCallback(async () => {
    if (!currentUser) return
    setIsAiLoading(true)
    try {
      const today = new Date()
      const context: InsightContext = {
        user: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          role: currentUser.role,
          department: currentUser.department,
          domiciliu: currentUser.domiciliu || "București, Nițu Vasile 58",
          preferences: {
            preferredFloor: currentUser.preferences.preferredFloor,
            preferredArea: currentUser.preferences.preferredArea,
            preferredDays: currentUser.preferences.preferredDays,
            workPreferences: currentUser.preferences.workPreferences,
            preferredStartTime: currentUser.preferences.preferredStartTime || "15:00",
          },
        },
        officeAddress: OFFICE_ADDRESS,
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

      const freshInsights = await calculateRouteInsights(context)
      setInsightsData(freshInsights)
    } finally {
      setIsAiLoading(false)
    }
  }, [currentUser, reservations, colleaguesList])

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
          totalColleaguesCount={colleaguesList.length}
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
            onReserveAdjacent={() => {
              const rec = insightsData.seatRec
              navigate("/seats", {
                state: {
                  jumpToSeat: true,
                  building: rec?.building || "Corp T1",
                  floorId: rec?.floorId || 1,
                  zoneType: rec?.zoneType || "birouri",
                  roomId: rec?.roomId || 100,
                  targetSeatCode: rec?.targetSeatCode || "A2",
                },
              })
            }}
          />
        )}
      </div>
    </div>
  )
}
