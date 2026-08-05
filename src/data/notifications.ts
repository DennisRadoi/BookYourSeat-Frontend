import type { Notification } from "@/types"

// TODO: Replace mock data with backend API integration
export const notifications: Notification[] = [
  {
    id: 1,
    type: "favorite",
    text: "Ruxandra B. (favorit) a rezervat Loc 15, Etaj 1",
    time: "acum 12 min",
    isUnread: true,
  },
  {
    id: 2,
    type: "freed",
    text: "Locul 9, Parter s-a eliberat - era pe lista ta de asteptare",
    time: "acum 40 min",
    isUnread: true,
  },
  {
    id: 3,
    type: "invite",
    text: "Ai fost invitat de George B. la birou, joi 30 iulie.",
    time: "acum 2 ore",
    isUnread: true,
  },
  {
    id: 4,
    type: "confirmed",
    text: "Rezervarea ta pentru Loc 14, Etaj 1 a fost confirmata",
    time: "ieri, 18:02",
    isUnread: false,
  },
  {
    id: 5,
    type: "team",
    text: "Denis R. s-a alaturat echipei tale de favoriti.",
    time: "ieri, 11:20",
    isUnread: false,
  },
  {
    id: 6,
    type: "weather",
    text: "Ploaie torentiala prognozata maine dimineata - pleaca cu 15 min mai devreme",
    time: "acum 2 zile",
    isUnread: false,
  },
  {
    id: 7,
    type: "recurring",
    text: "Rezervare recurenta activata: Luni si Miercuri, Loc 12, Etaj 2",
    time: "acum 3 zile",
    isUnread: false,
  },
  {
    id: 8,
    type: "canceled",
    text: "Rezervarea pentru 25 iulie a fost anulata cu succes",
    time: "acum 5 zile",
    isUnread: false,
  },
  {
    id: 9,
    type: "verified",
    text: "Check-in confirmat la birou pentru ziua de azi",
    time: "acum 6 zile",
    isUnread: false,
  },
]
