# PROJECT RULES

## Stack

Use only:

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router

---

## Architecture

Use feature-based architecture.

src/
├── features/
├── components/
├── pages/
├── layouts/
├── routes/
├── services/
├── data/
├── types/
├── hooks/
├── utils/

---

## Mock Data

Backend is not implemented.

Store all mock data in:

src/data/

Examples:

- users.ts
- reservations.ts
- seats.ts

Never hardcode business data inside components.

Use service layer:

Component
→ Service
→ Mock Data

Services must be async.

Example:

```ts
export async function getReservations() {
  return reservations;
}
```

When backend is added, only services should change.

---

## TypeScript

Strict typing required.

Never use:

```ts
any
```

Always define types/interfaces for business entities.

Use:

- User
- Reservation
- Seat
- Floor
- Building
- Notification

---

## Naming

Use descriptive names.

Good:

```ts
availableSeats
selectedFloor
upcomingReservations
```

Bad:

```ts
data
item
tmp
result
```

Booleans:

```ts
isLoading
isOpen
isAvailable
hasPermission
canEdit
```

---

## Components

One responsibility per component.

Split components larger than ~200 lines.

Use:

```tsx
ReservationCard
SeatMap
AnalyticsPanel
```

Avoid generic names.

---

## React

- Functional components only
- Hooks only
- No class components
- Keep state local when possible
- Prefer composition over prop drilling

---

## Routing

Use React Router.

Centralize routes in:

routes/index.tsx

---

## Styling

Use Tailwind first.

Use shadcn/ui before building custom components.

Custom CSS only when Tailwind becomes impractical.

Avoid inline styles.

---

## Comments

Do not comment obvious code.

Only comment:

- complex business logic
- workarounds
- backend placeholders

Example:

```ts
// TODO: Replace mock data with backend API integration
```

---


## Generated Code

Always:

- generate complete files
- include imports
- include types
- include error states
- include loading states
- follow existing architecture

Never:

- generate pseudocode
- leave unfinished implementations
- hardcode business data in components

Code must be immediately runnable.