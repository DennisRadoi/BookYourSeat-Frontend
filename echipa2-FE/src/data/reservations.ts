import type { Reservation } from "@/types"

// TODO: Replace mock data with backend API integration
// Seat IDs reference (based on locations.ts generators):
//   Corp T1  – Floor 1 (Parter):
//     Stand-Up Desk:  L1=1000, L2=1001, L3=1002, L4=1003, R1=1004, R2=1005, R3=1006, R4=1007
//     Sală Relaxare:  A1=1020, A2=1021, A3=1022, C1=1023, C2=1024, C3=1025, C4=1026, S1=1027, S2=1028, S3=1029
//   Corp T2  – Floor 4 (Parter):
//     Stand-Up Desk:  L1=2000, L2=2001, L3=2002, L4=2003, R1=2004, R2=2005, R3=2006, R4=2007
//     Sală Relaxare:  A1=2020, A2=2021, A3=2022, C1=2023, C2=2024, C3=2025, C4=2026, S1=2027, S2=2028, S3=2029
//   Corp T2  – Floor 5 (Etaj 1):
//     Open Space:     D1-1=2100, D1-2=2101, D2-1=2102, D2-2=2103 … D10-2=2119
//     Sala 404:       A1=2120, A2=2121, A3=2122, A4=2123, A5=2124, B1=2125 … B5=2129, C1=2130, C2=2131
//   Corp T2  – Floor 6 (Etaj 2):
//     Sala Birou:     M1=2200, M2=2201 … M10=2209, W1=2210 … W10=2219, S1=2220, S2=2221, L1=2222, L2=2223
export const reservations: Reservation[] = [
  // ── Trecut / finalizat ──────────────────────────────────────────
  {
    id: 2,
    userId: 1,
    locationId: 1,
    floorId: 1,
    seatId: 1000, // Corp T1 – Stand-Up Desk – L1
    date: "2026-07-31",
    startTime: "09:00",
    endTime: "17:30",
    status: "completed",
    createdAt: "2026-07-28T14:15:00",
  },
  {
    id: 7,
    userId: 1,
    locationId: 2,
    floorId: 5,
    seatId: 2100, // Corp T2 – Open Space Etaj 1 – D1-1
    date: "2026-08-01",
    startTime: "08:30",
    endTime: "17:00",
    status: "completed",
    createdAt: "2026-07-30T10:00:00",
  },

  // ── Rezervări viitoare (userId=1) ───────────────────────────────
  {
    id: 1,
    userId: 1,
    locationId: 2,
    floorId: 5,
    seatId: 2102, // Corp T2 – Open Space Etaj 1 – D2-1
    date: "2026-08-07",
    startTime: "09:00",
    endTime: "18:00",
    status: "confirmed",
    createdAt: "2026-08-01T10:30:00",
  },
  {
    id: 5,
    userId: 1,
    locationId: 1,
    floorId: 1,
    seatId: 1004, // Corp T1 – Stand-Up Desk – R1
    date: "2026-08-14",
    startTime: "09:00",
    endTime: "18:00",
    status: "confirmed",
    createdAt: "2026-08-05T09:00:00",
  },
  {
    id: 6,
    userId: 1,
    locationId: 2,
    floorId: 6,
    seatId: 2200, // Corp T2 – Sala Birou Etaj 2 – M1
    date: "2026-08-29",
    startTime: "09:00",
    endTime: "18:00",
    status: "pending",
    createdAt: "2026-08-05T10:00:00",
  },
  {
    id: 8,
    userId: 1,
    locationId: 2,
    floorId: 4,
    seatId: 2023, // Corp T2 – Sală Relaxare Parter – C1
    date: "2026-09-03",
    startTime: "10:00",
    endTime: "14:00",
    status: "confirmed",
    createdAt: "2026-08-06T08:00:00",
  },
  {
    id: 9,
    userId: 1,
    locationId: 2,
    floorId: 5,
    seatId: 2120, // Corp T2 – Sala 404 Etaj 1 – A1
    date: "2026-09-10",
    startTime: "13:00",
    endTime: "17:00",
    status: "confirmed",
    createdAt: "2026-08-06T09:00:00",
  },

  // ── Alți utilizatori ────────────────────────────────────────────
  {
    id: 3,
    userId: 2,
    locationId: 1,
    floorId: 1,
    seatId: 1005, // Corp T1 – Stand-Up Desk – R2
    date: "2026-08-07",
    startTime: "08:30",
    endTime: "17:00",
    status: "confirmed",
    createdAt: "2026-08-02T09:20:00",
  },
  {
    id: 4,
    userId: 3,
    locationId: 2,
    floorId: 5,
    seatId: 2103, // Corp T2 – Open Space Etaj 1 – D2-2
    date: "2026-08-08",
    startTime: "10:00",
    endTime: "18:00",
    status: "confirmed",
    createdAt: "2026-08-02T11:45:00",
  },
]
