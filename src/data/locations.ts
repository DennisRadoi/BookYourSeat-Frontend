import type { Location, Seat } from "@/types"

const colleagueNames: Record<string, string> = {
  "1": "Andrei Popescu",
  "2": "Mihai Radu",
  "3": "Elena Ionescu",
  "4": "Cristian Vlad",
  "5": "Bogdan Stanciu",
  "6": "Ana Dumitrescu",
  "7": "Alexandru Marin",
  "8": "Raluca Georgescu",
  "9": "Diana Tudor",
  "10": "Gabriel Dobre",
  "11": "Ioana Vasile",
  "12": "Victor Nistor",
  "A1": "Andrei Popescu",
  "A2": "Mihai Radu",
  "A3": "Elena Ionescu",
  "A4": "Cristian Vlad",
  "A5": "Bogdan Stanciu",
  "B1": "Ana Dumitrescu",
  "B2": "Alexandru Marin",
  "B3": "Raluca Georgescu",
  "B4": "Diana Tudor",
  "B5": "Gabriel Dobre",
  "C1": "Ioana Vasile",
  "C2": "Victor Nistor",
  "C3": "Simona Halep",
  "C4": "Mircea Popa",
  "S1": "Laura Cosoi",
  "S2": "Dan Bittman",
  "S3": "Andra Maruta",
  "L1": "George Enescu",
  "L2": "Maria Tanase",
  "L3": "Constantin Brancusi",
  "L4": "Henri Coanda",
  "R1": "Aurel Vlaicu",
  "R2": "Traian Vuia",
  "R3": "Ion Luca Caragiale",
  "R4": "Mihai Eminescu",
  "M1": "Florin Piersic",
  "M2": "Gheorghe Hagi",
  "M3": "Ilie Nastase",
  "M4": "Nadia Comaneci",
  "M5": "Simona Halep",
  "M6": "Ion Tiriac",
  "M7": "Cristian Chivu",
  "M8": "Adrian Mutu",
  "M9": "Lucian Bute",
  "M10": "Catalina Ponor",
  "W1": "Mircea Eliade",
  "W2": "Emil Cioran",
  "W3": "Eugen Ionescu",
  "W4": "Nichita Stanescu",
  "W5": "Marin Sorescu",
  "W6": "Lucian Blaga",
  "W7": "George Bacovia",
  "W8": "Tudor Arghezi",
  "W9": "Ion Barbu",
  "W10": "Liviu Rebreanu",
}

// 🏢 Birou Open Space (Etaj 1, Corp T2): 20 locuri pe 10 birouri (D1..D10, 2 locuri/birou)
export function createOpenSpace20Seats(
  baseId: number,
  occupiedCodes: string[] = []
): Seat[] {
  const seats: Seat[] = []
  let id = baseId

  for (let deskNum = 1; deskNum <= 10; deskNum++) {
    const seat1Code = `D${deskNum}-1`
    const isOccupied1 = occupiedCodes.includes(seat1Code)
    seats.push({
      id: id++,
      code: seat1Code,
      area: "team",
      type: "standard",
      hasMonitor: true,
      isAvailable: !isOccupied1,
      occupiedBy: isOccupied1 ? colleagueNames[seat1Code] || "Coleg" : undefined,
      row: `D${deskNum}`,
      position: "left",
    })

    const seat2Code = `D${deskNum}-2`
    const isOccupied2 = occupiedCodes.includes(seat2Code)
    seats.push({
      id: id++,
      code: seat2Code,
      area: "team",
      type: "standard",
      hasMonitor: true,
      isAvailable: !isOccupied2,
      occupiedBy: isOccupied2 ? colleagueNames[seat2Code] || "Coleg" : undefined,
      row: `D${deskNum}`,
      position: "right",
    })
  }

  return seats
}

// 🏢 Sala Birou (T2 Etaj 2): 24 locuri
export function createOffice24Seats(
  baseId: number,
  occupiedCodes: string[] = ["M9", "M2", "M5", "W3"]
): Seat[] {
  const seats: Seat[] = []
  let id = baseId

  // Masă de conferință (M1..M10)
  for (let i = 1; i <= 10; i++) {
    const code = `M${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "team",
      type: "standard",
      hasMonitor: true,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "M",
      group: "meeting",
    })
  }

  // Birouri de lucru (W1..W10)
  for (let i = 1; i <= 10; i++) {
    const code = `W${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "focus",
      type: "standard",
      hasMonitor: true,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "W",
      group: "workspace",
    })
  }

  // Masă mică laterală (S1, S2)
  for (let i = 1; i <= 2; i++) {
    const code = `S${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "focus",
      type: "standard",
      hasMonitor: false,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "S",
      group: "small-table",
    })
  }

  // Fotolii (L1, L2)
  for (let i = 1; i <= 2; i++) {
    const code = `L${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "lounge",
      type: "armchair",
      hasMonitor: false,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "L",
      group: "lounge",
    })
  }

  return seats
}

// 🛋️ Sală de Relaxare (Parter Comun T1 & T2): 10 locuri (A1..A3, C1..C4 canapea sus, S1..S3 canapea dreapta)
export function createRelaxare10Seats(
  baseId: number,
  occupiedCodes: string[] = ["A2"]
): Seat[] {
  const seats: Seat[] = []
  let id = baseId

  // Locuri individuale fotolii A1..A3
  for (let i = 1; i <= 3; i++) {
    const code = `A${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "lounge",
      type: "armchair",
      hasMonitor: false,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "A",
      group: "lounge",
    })
  }

  // Canapea sus: C1..C4
  for (let i = 1; i <= 4; i++) {
    const code = `C${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "lounge",
      type: "sofa",
      hasMonitor: false,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "C",
      group: "sofa-top",
    })
  }

  // Canapea dreapta: S1..S3
  for (let i = 1; i <= 3; i++) {
    const code = `S${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "lounge",
      type: "sofa",
      hasMonitor: false,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "S",
      group: "sofa-right",
    })
  }

  return seats
}

// 🧍 Stand-Up Desk (Parter Comun T1 & T2): 8 locuri (L1..L4 pe Masă 1, R1..R4 pe Masă 2)
export function createStandup8Seats(
  baseId: number,
  occupiedCodes: string[] = ["L3"]
): Seat[] {
  const seats: Seat[] = []
  let id = baseId

  // Masă 1: L1..L4
  for (let i = 1; i <= 4; i++) {
    const code = `L${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "team",
      type: "standard",
      hasMonitor: false,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "L",
      group: "table-left",
    })
  }

  // Masă 2: R1..R4
  for (let i = 1; i <= 4; i++) {
    const code = `R${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "team",
      type: "standard",
      hasMonitor: false,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "R",
      group: "table-right",
    })
  }

  return seats
}

// Sala 404: 12 locuri (A1..A5, B1..B5, C1, C2)
export function createConference12Seats(
  baseId: number,
  occupiedCodes: string[] = ["A2", "A5", "B3"]
): Seat[] {
  const seats: Seat[] = []
  let id = baseId

  // Rândul A (sus): A1..A5
  for (let i = 1; i <= 5; i++) {
    const code = `A${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "team",
      type: "standard",
      hasMonitor: true,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "A",
      position: "top",
    })
  }

  // Rândul B (jos): B1..B5
  for (let i = 1; i <= 5; i++) {
    const code = `B${i}`
    const isOccupied = occupiedCodes.includes(code)
    seats.push({
      id: id++,
      code,
      area: "team",
      type: "standard",
      hasMonitor: true,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
      row: "B",
      position: "bottom",
    })
  }

  // Capăt stânga: C1
  seats.push({
    id: id++,
    code: "C1",
    area: "team",
    type: "standard",
    hasMonitor: true,
    isAvailable: !occupiedCodes.includes("C1"),
    occupiedBy: occupiedCodes.includes("C1") ? colleagueNames["C1"] || "Coleg" : undefined,
    row: "C",
    position: "left",
  })

  // Capăt dreapta: C2
  seats.push({
    id: id++,
    code: "C2",
    area: "team",
    type: "standard",
    hasMonitor: true,
    isAvailable: !occupiedCodes.includes("C2"),
    occupiedBy: occupiedCodes.includes("C2") ? colleagueNames["C2"] || "Coleg" : undefined,
    row: "C",
    position: "right",
  })

  return seats
}

// Locuri pentru hărțile personalizate din Corpul T1. Componentele de hartă
// identifică fiecare loc după cod, de aceea aceste coduri trebuie păstrate.
function createNamedSeats(
  baseId: number,
  codes: string[],
  occupiedCodes: string[] = []
): Seat[] {
  return codes.map((code, index) => {
    const isOccupied = occupiedCodes.includes(code)

    return {
      id: baseId + index,
      code,
      area: "team",
      type: "standard",
      hasMonitor: false,
      isAvailable: !isOccupied,
      occupiedBy: isOccupied ? colleagueNames[code] || "Coleg" : undefined,
    }
  })
}

export const locations: Location[] = [
  // ==========================================
  // CORP T2 (Sediul Principal cu toate hărțile implementate)
  // ==========================================
  {
    id: 2,
    name: "Sediul Tehnologic T2",
    address: "Șoseaua Pipera 42, București",
    city: "București",
    building: "Corp T2",
    floors: [
      // ----------------- PARTER (Comun T1 & T2) -----------------
      {
        id: 4,
        number: 0,
        name: "Parter",
        rooms: [
          {
            id: 201,
            name: "Stand-Up Desk",
            type: "birouri",
            layout: "standup",
            floorId: 4,
            building: "Corp T2",
            hasTv: false,
            hasWhiteboard: false,
            seats: createStandup8Seats(2000, ["L3"]),
          },
          {
            id: 202,
            name: "Sală de Relaxare",
            type: "conferinte",
            layout: "relaxare",
            floorId: 4,
            building: "Corp T2",
            hasTv: false,
            hasWhiteboard: false,
            seats: createRelaxare10Seats(2020, ["A2"]),
          },
        ],
        seats: createStandup8Seats(2000, ["L3"]),
      },

      // ----------------- ETAJ 1 (T2) -----------------
      {
        id: 5,
        number: 1,
        name: "Etaj 1",
        rooms: [
          {
            id: 210,
            name: "Birou Open Space",
            type: "birouri",
            layout: "openspace",
            floorId: 5,
            building: "Corp T2",
            hasTv: false,
            hasWhiteboard: false,
            seats: createOpenSpace20Seats(2100, []),
          },
          {
            id: 211,
            name: "404",
            type: "conferinte",
            layout: "conference",
            floorId: 5,
            building: "Corp T2",
            hasTv: true,
            hasWhiteboard: true,
            seats: createConference12Seats(2120, ["A2", "A5", "B3"]),
          },
        ],
        seats: createOpenSpace20Seats(2100, []),
      },

      // ----------------- ETAJ 2 (T2) -----------------
      {
        id: 6,
        number: 2,
        name: "Etaj 2",
        rooms: [
          {
            id: 220,
            name: "Sala Birou - Etaj 2",
            type: "birouri",
            layout: "office",
            floorId: 6,
            building: "Corp T2",
            hasTv: true,
            hasWhiteboard: true,
            seats: createOffice24Seats(2200, ["M9", "M2", "M5", "W3"]),
          },
        ],
        seats: createOffice24Seats(2200, ["M9", "M2", "M5", "W3"]),
      },
    ],
  },

  // ==========================================
  // CORP T1 (Parter Comun)
  // ==========================================
  {
    id: 1,
    name: "Sediul Tehnologic T1",
    address: "Bulevardul Dimitrie Pompeiu 10, București",
    city: "București",
    building: "Corp T1",
    floors: [
      // ----------------- PARTER (Comun T1 & T2) -----------------
      {
        id: 1,
        number: 0,
        name: "Parter",
        rooms: [
          {
            id: 101,
            name: "Stand-Up Desk",
            type: "birouri",
            layout: "standup",
            floorId: 1,
            building: "Corp T1",
            hasTv: false,
            hasWhiteboard: false,
            seats: createStandup8Seats(1000, ["L3"]),
          },
          {
            id: 102,
            name: "Sală de Relaxare",
            type: "conferinte",
            layout: "relaxare",
            floorId: 1,
            building: "Corp T1",
            hasTv: false,
            hasWhiteboard: false,
            seats: createRelaxare10Seats(1020, ["A2"]),
          },
        ],
        seats: createStandup8Seats(1000, ["L3"]),
      },
      {
        id: 2,
        number: 1,
        name: "Etaj 1",
        rooms: [
          {
            id: 103,
            name: "Sală Evenimente",
            type: "conferinte",
            layout: "events",
            floorId: 2,
            building: "Corp T1",
            hasTv: true,
            hasWhiteboard: true,
            seats: createNamedSeats(1100, [
              "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10",
              "B1", "B2", "B3", "B4", "B5", "B6",
            ], ["T5", "B3"]),
          },
          {
            id: 104,
            name: "Side Evenimente",
            type: "conferinte",
            layout: "small-meeting",
            floorId: 2,
            building: "Corp T1",
            hasTv: true,
            hasWhiteboard: true,
            seats: createNamedSeats(1120, ["1", "2", "3", "4"], ["2"]),
          },
          {
            id: 105,
            name: "La Terasă",
            type: "conferinte",
            layout: "conference",
            floorId: 2,
            building: "Corp T1",
            hasTv: true,
            hasWhiteboard: true,
            seats: createNamedSeats(1140, [
              "T1", "T2", "T3", "T4", "L1", "R1", "B1", "B2", "B3", "B4",
            ], ["B2"]),
          },
        ],
        seats: createNamedSeats(1100, ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10"]),
      },
      {
        id: 3,
        number: 2,
        name: "Etaj 2",
        rooms: [
          {
            id: 106,
            name: "Sala Gaming",
            type: "conferinte",
            layout: "events",
            floorId: 3,
            building: "Corp T1",
            hasTv: true,
            hasWhiteboard: false,
            seats: createNamedSeats(1200, [
              "A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4",
            ], ["C2"]),
          },
          {
            id: 107,
            name: "Sala Tenis",
            type: "conferinte",
            layout: "small-meeting",
            floorId: 3,
            building: "Corp T1",
            hasTv: false,
            hasWhiteboard: false,
            seats: createNamedSeats(1220, ["S1", "D1", "D2", "D3", "D4"], ["D3"]),
          },
        ],
        seats: createNamedSeats(1200, ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"]),
      },
    ],
  },
]
