export const locations = [
  {
    id: 1,
    name: "Sediul Central",
    address: "Bulevardul Unirii 10, București",
    city: "București",
    building: "Corp A",
    floors: [
      {
        id: 1,
        number: 0,
        name: "Parter",
        seats: [
          {
            id: 1,
            code: "A-001",
            area: "window",
            type: "standard",
            hasMonitor: true,
            isAvailable: true,
          },
          {
            id: 2,
            code: "A-002",
            area: "quiet",
            type: "standard",
            hasMonitor: true,
            isAvailable: true,
          },
        ],
      },
      {
        id: 2,
        number: 1,
        name: "Etajul 1",
        seats: [
          {
            id: 3,
            code: "A-101",
            area: "window",
            type: "standard",
            hasMonitor: true,
            isAvailable: true,
          },
          {
            id: 4,
            code: "A-102",
            area: "quiet",
            type: "standing",
            hasMonitor: true,
            isAvailable: true,
          },
          {
            id: 5,
            code: "A-103",
            area: "team",
            type: "standard",
            hasMonitor: false,
            isAvailable: true,
          },
        ],
      },
      {
        id: 3,
        number: 2,
        name: "Etajul 2",
        seats: [
          {
            id: 6,
            code: "A-201",
            area: "window",
            type: "standard",
            hasMonitor: true,
            isAvailable: true,
          },
          {
            id: 7,
            code: "A-202",
            area: "quiet",
            type: "standing",
            hasMonitor: true,
            isAvailable: true,
          },
        ],
      },
    ],
  },

  {
    id: 2,
    name: "Sediul Nord",
    address: "Șoseaua Pipera 42, București",
    city: "București",
    building: "Corp B",
    floors: [
      {
        id: 4,
        number: 0,
        name: "Parter",
        seats: [
          {
            id: 8,
            code: "B-001",
            area: "team",
            type: "standard",
            hasMonitor: true,
            isAvailable: true,
          },
          {
            id: 9,
            code: "B-002",
            area: "quiet",
            type: "standard",
            hasMonitor: false,
            isAvailable: true,
          },
        ],
      },
    ],
  },
];