import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/utils"
import {
  Star,
  Monitor,
  Bell,
  CheckCircle2,
  Users,
  CloudRain,
  Repeat,
  type LucideIcon,
} from "lucide-react"
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/services"
import type { Notification, NotificationType } from "@/types"

const notificationIconMap: Record<NotificationType, LucideIcon> = {
  favorite: Star,
  freed: Monitor,
  invite: Bell,
  confirmed: CheckCircle2,
  team: Users,
  weather: CloudRain,
  recurring: Repeat,
  canceled: Bell,
  verified: CheckCircle2,
}

export default function NotificationsPage() {
  const [notificationsList, setNotificationsList] = useState<Notification[]>([])

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications()
        setNotificationsList(data)
      } catch (error) {
        console.error("Eroare la încărcarea notificărilor:", error)
      }
    }

    loadNotifications()
  }, [])

  async function handleMarkAllAsRead() {
    try {
      const updated = await markAllNotificationsAsRead()
      setNotificationsList(updated)
    } catch (error) {
      console.error("Eroare la marcarea notificărilor ca citite:", error)
    }
  }

  async function handleNotificationClick(id: number) {
    try {
      const updated = await markNotificationAsRead(id)
      setNotificationsList((current) =>
        current.map((n) => (n.id === updated.id ? updated : n)),
      )
    } catch (error) {
      console.error("Eroare la marcarea notificării:", error)
    }
  }

  const totalNotifications = notificationsList.length
  const unreadCount = notificationsList.filter((n) => n.isUnread).length

  return (
    <div className="w-full bg-[#f3f4f6]">
      <Card className="border border-[#e5e7eb] shadow-[0_1px_6px_rgba(0,0,0,0.04)] overflow-hidden bg-white rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#e5e7eb] bg-white py-4 px-6 space-y-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs sm:text-sm font-semibold text-[#1f2937]">
              {totalNotifications} notificări
            </CardTitle>
            <span className="text-xs sm:text-sm font-medium text-[#6b7280]">
              {unreadCount} necitite
            </span>
          </div>

          <Button
            variant="link"
            onClick={handleMarkAllAsRead}
            className="text-[#059669] hover:text-[#047857] p-0 h-auto font-medium text-xs sm:text-sm"
          >
            Marchează toate ca citite
          </Button>
        </CardHeader>

        <CardContent className="p-0 flex flex-col">
          {notificationsList.map((notif) => {
            const Icon = notificationIconMap[notif.type] ?? Bell
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id)}
                className={cn(
                  "flex items-center justify-between px-3 sm:px-6 py-3.5 sm:py-4 border-b border-[#e5e7eb] last:border-0 transition-colors gap-2 sm:gap-4 cursor-pointer",
                  notif.isUnread ? "bg-[#d1fae5]/30 hover:bg-[#d1fae5]/50" : "bg-white hover:bg-[#f3f4f6]",
                )}
              >
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#d1fae5] text-[#059669] flex items-center justify-center shrink-0">
                    <Icon size={16} className="sm:hidden" strokeWidth={2.5} />
                    <Icon size={18} className="hidden sm:block" strokeWidth={2.5} />
                  </div>

                  <div className="w-2.5 sm:w-4 flex justify-center shrink-0">
                    {notif.isUnread && <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />}
                  </div>

                  <p className="text-xs sm:text-sm text-[#1f2937] font-medium leading-snug truncate sm:whitespace-normal">
                    {notif.text}
                  </p>
                </div>

                <span className="text-[11px] sm:text-xs text-[#6b7280] font-medium whitespace-nowrap shrink-0 pl-1">
                  {notif.time}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
