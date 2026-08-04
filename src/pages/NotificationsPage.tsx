import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Star, Monitor, Bell, CheckCircle2, Users, CloudRain, Repeat, Moon, User } from "lucide-react"

const notificationsData = [
  {
    id: 1,
    type: "favorite",
    icon: Star,
    text: "Ruxandra B. (favorit) a rezervat Loc 15, Etaj 1",
    time: "acum 12 min",
    isUnread: true,
  },
  {
    id: 2,
    type: "freed",
    icon: Monitor,
    text: "Locul 9, Parter s-a eliberat - era pe lista ta de asteptare",
    time: "acum 40 min",
    isUnread: true,
  },
  {
    id: 3,
    type: "invite",
    icon: Bell,
    text: "Ai fost invitat de George B. la birou, joi 30 iulie.",
    time: "acum 2 ore",
    isUnread: true,
  },
  {
    id: 4,
    type: "confirmed",
    icon: CheckCircle2,
    text: "Rezervarea ta pentru Loc 14, Etaj 1 a fost confirmata",
    time: "ieri, 18:02",
    isUnread: false,
  },
  {
    id: 5,
    type: "team",
    icon: Users,
    text: "Denis R. s-a alaturat echipei tale de favoriti.",
    time: "ieri, 11:20",
    isUnread: false,
  },
  {
    id: 6,
    type: "weather",
    icon: CloudRain,
    text: "Trafic intens pe ruta ta de dimineata - pleaca cu 15 min mai devreme",
    time: "ieri, 7:20",
    isUnread: false,
  },
  {
    id: 7,
    type: "recurring",
    icon: Repeat,
    text: "Rezervarea ta recurenta pentru Etaj 2 a fost creata automat.",
    time: "2 zile",
    isUnread: false,
  },
  {
    id: 8,
    type: "canceled",
    icon: Bell,
    text: "Anna H. a anulat rezervarea pentru Loc 3, Parter",
    time: "2 zile",
    isUnread: false,
  },
  {
    id: 9,
    type: "verified",
    icon: CheckCircle2,
    text: "Contul tau a fost verificat cu succes",
    time: "3 zile",
    isUnread: false,
  },
]

export default function NotificationsPage() {
  const totalNotifications = notificationsData.length
  const unreadCount = notificationsData.filter((n) => n.isUnread).length

  return (
    <div className="w-full min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* Header-ul gri pe toată lățimea */}
      <header className="w-full bg-[#E3E5E8] px-6 sm:px-10 py-5 flex items-center justify-between border-b border-slate-300/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-wider">
            NOTIFICARI
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Echipa/colegi actualizari recente
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 shadow-sm">
            <Moon size={18} />
          </button>
          
          <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 shadow-sm relative">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button className="w-9 h-9 rounded-full bg-[#D1F2E8] flex items-center justify-center text-[#0D9488] shadow-sm">
            <User size={18} />
          </button>
        </div>
      </header>

      {}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl w-full mx-auto">
      </main>

      {}
      <Card className="border-none shadow-md overflow-hidden bg-white rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white py-4 px-6 space-y-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs sm:text-sm font-semibold text-slate-800">
              {totalNotifications} notificari
            </CardTitle>
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              {unreadCount} necitite
            </span>
          </div>
          
          <Button variant="link" className="text-[#008767] hover:text-[#006b52] p-0 h-auto font-medium text-xs sm:text-sm">
            Marcheaza toate ca citite
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col">
          {notificationsData.map((notif) => {
            const Icon = notif.icon
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-center justify-between px-3 sm:px-6 py-3.5 sm:py-4 border-b border-slate-50 last:border-0 transition-colors gap-2 sm:gap-4",
                  notif.isUnread ? "bg-[#E8F7F3]" : "bg-white"
                )}
              >
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#CEF3E6] text-[#008767] flex items-center justify-center shrink-0">
                     <Icon size={16} className="sm:hidden" strokeWidth={2.5} />
                    <Icon size={18} className="hidden sm:block" strokeWidth={2.5} />
                  </div>
                  
                  <div className="w-2.5 sm:w-4 flex justify-center shrink-0">
                    {notif.isUnread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00A884]" />
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-snug truncate sm:whitespace-normal">
                    {notif.text}
                  </p>
                </div>
                
                <span className="text-[11px] sm:text-xs text-slate-400 sm:text-slate-500 font-medium whitespace-nowrap shrink-0 pl-1">
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