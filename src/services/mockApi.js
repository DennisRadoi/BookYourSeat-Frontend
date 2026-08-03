import {
  users,
  currentUserId,
  reservations,
  locations,
} from "../data";

const delay = (milliseconds = 300) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function getCurrentUser() {
  await delay();

  const user = users.find((item) => item.id === currentUserId);

  if (!user) {
    throw new Error("Utilizatorul curent nu a fost găsit.");
  }

  return structuredClone(user);
}

export async function getDetailedReservationsByUserId(userId) {
  await delay();

  const userReservations = reservations.filter(
    (reservation) => reservation.userId === userId
  );

  return userReservations.map((reservation) => {
    const location = locations.find(
      (item) => item.id === reservation.locationId
    );

    const floor = location?.floors.find(
      (item) => item.id === reservation.floorId
    );

    const seat = floor?.seats.find(
      (item) => item.id === reservation.seatId
    );

    return {
      ...reservation,

      location: location
        ? {
            id: location.id,
            name: location.name,
            address: location.address,
            building: location.building,
          }
        : null,

      floor: floor
        ? {
            id: floor.id,
            number: floor.number,
            name: floor.name,
          }
        : null,

      seat: seat
        ? {
            id: seat.id,
            code: seat.code,
            area: seat.area,
            type: seat.type,
          }
        : null,
    };
  });
}