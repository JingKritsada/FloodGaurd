# FloodGuard Migration Plan: old-web → new-web

## Overview

Migrating the Sukhothai FloodGuard flood management app from a monolithic single-file architecture (`old-web/frontend/`) to a structured Vite + React + TypeScript project (`src/`) with proper routing, services, and role-based access control.

---

## File Tree: old → new Mapping

```
old-web/frontend/                          →  src/
├── App.tsx                                →  src/App.tsx ✅ (exists)
├── api.ts                                 →  src/services/api.ts ✅ (created)
├── src/services/auth.ts                   →  src/services/auth.service.ts ✅ (created)
├── types/index.ts                         →  src/types/index.types.ts ✅ (exists)
├── constants/index.ts                     →  src/constants/incidents.constants.ts ✅ (created)
│                                          →  src/constants/components.constants.tsx ✅ (exists)
│                                          →  src/constants/zindex.constants.tsx ✅ (exists)
├── components/
│   ├── AppBar.tsx                         →  src/components/AppComponents/AppBar.tsx ✅ (exists)
│   ├── BottomNav.tsx                      →  src/components/BottomNav.tsx ✅ (created)
│   ├── AnnouncementForm.tsx               →  src/pages/AnnouncementFormPage.tsx ⬜ (pending)
│   ├── AnnouncementList.tsx               →  src/pages/AnnouncementsPage.tsx ⬜ (pending)
│   ├── IncidentList.tsx                   →  src/pages/IncidentListPage.tsx ⬜ (pending)
│   ├── IncidentModal.tsx                  →  src/components/IncidentModal.tsx ⬜ (pending)
│   ├── LoginModal.tsx                     →  src/pages/LoginPage.tsx ⬜ (pending)
│   ├── MapBoard.tsx                       →  src/pages/MapPage.tsx ⬜ (pending)
│   ├── ReportForm.tsx                     →  src/pages/ReportPage.tsx ⬜ (pending)
│   └── StatsDashboard.tsx                 →  src/pages/StatsPage.tsx ⬜ (pending)
└── mock/index.ts                          →  (dev-only; inline or test fixtures)

New files (no old-web equivalent):
                                           →  src/interfaces/incidents.interfaces.ts ✅ (created)
                                           →  src/services/incidents.service.ts ✅ (created)
                                           →  src/services/announcements.service.ts ✅ (created)
                                           →  src/services/roads.service.ts ✅ (created)
                                           →  src/services/shelters.service.ts ✅ (created)
                                           →  src/routes/ProtectedRoute.tsx ✅ (created)
                                           →  src/pages/NotFoundPage.tsx ✅ (created)
                                           →  src/pages/ForbiddenPage.tsx ✅ (created)
                                           →  src/providers/AuthContext.tsx ✅ (exists)
                                           →  src/providers/ThemeContext.tsx ✅ (exists)
                                           →  src/providers/AlertContext.tsx ✅ (exists)
```

---

## Extracted Interfaces / Types / Constants

### Types (`src/types/index.types.ts`) ✅

- `Role` — `"CITIZEN" | "OFFICER" | "ADMIN"`
- `Theme`, `FontSize`
- `ReportType` — `"SOS" | "TRAFFIC"`
- `TicketStatus` — `"OPEN" | "IN_PROGRESS" | "RESOLVED"`
- `OfficerReportMode`, `AppView`, `IncidentType`

### Interfaces (`src/interfaces/incidents.interfaces.ts`) ✅

- `Location` — `{ lat, lng }`
- `Incident` — full incident with location, status, reporter info
- `RoadStatus` — road closure with status enum
- `Shelter` — evacuation shelter with capacity
- `Announcement` — news/alert with priority and publish state

### Constants (`src/constants/incidents.constants.ts`) ✅

- `TYPE_LABELS` — Thai display labels for `IncidentType`
- `STATUS_LABELS` — Thai display labels for `TicketStatus`
- `FILTER_LABELS` — Thai display labels for map filter modes
- `DEMO_CENTER` — Default map center `{ lat: 17.007, lng: 99.826 }` (Sukhothai)
- `ROAD_STATUS_COLORS` — Hex colors for road status indicators

---

## Component Strategy

### Layout

- `src/App.tsx` — wraps `<Providers>` → `<AppBar>` + `<AppMain>` (router outlet)
- `src/components/AppComponents/AppBar.tsx` — top header with role tabs, theme, font size, auth
- `src/components/BottomNav.tsx` — role-aware floating bottom navigation with SOS/report buttons

### Pages (route-level components)

| Route                     | Component              | Roles            |
| ------------------------- | ---------------------- | ---------------- |
| `/`                       | `MapPage`              | ALL              |
| `/list`                   | `IncidentListPage`     | OFFICER, ADMIN   |
| `/stats`                  | `StatsPage`            | ADMIN            |
| `/report`                 | `ReportPage`           | CITIZEN, OFFICER |
| `/announcements`          | `AnnouncementsPage`    | ALL              |
| `/announcements/new`      | `AnnouncementFormPage` | ADMIN            |
| `/announcements/:id/edit` | `AnnouncementFormPage` | ADMIN            |
| `/login`                  | `LoginPage`            | public           |
| `/forbidden`              | `ForbiddenPage`        | public           |
| `*`                       | `NotFoundPage`         | public           |

### Shared Components (pending)

- `IncidentModal` — detail + status update overlay
- `AlertModal` ✅ — reusable confirm/alert dialog

---

## Route Protection Strategy

`src/routes/ProtectedRoute.tsx` ✅ wraps React Router `<Outlet>`:

1. **Unauthenticated** → redirect to `/login`
2. **Authenticated, wrong role** → redirect to `/forbidden`
3. **Authenticated, correct role** → render `<Outlet />`

Example router setup (to be implemented in `App.tsx`):

```tsx
<Routes>
	{/* Public */}
	<Route element={<LoginPage />} path="/login" />
	<Route element={<ForbiddenPage />} path="/forbidden" />

	{/* All authenticated users */}
	<Route element={<ProtectedRoute />}>
		<Route element={<MapPage />} path="/" />
		<Route element={<AnnouncementsPage />} path="/announcements" />
		<Route element={<ReportPage />} path="/report" />
	</Route>

	{/* Officer + Admin */}
	<Route element={<ProtectedRoute requiredRoles={["OFFICER", "ADMIN"]} />}>
		<Route element={<IncidentListPage />} path="/list" />
	</Route>

	{/* Admin only */}
	<Route element={<ProtectedRoute requiredRoles={["ADMIN"]} />}>
		<Route element={<StatsPage />} path="/stats" />
		<Route element={<AnnouncementFormPage />} path="/announcements/new" />
		<Route element={<AnnouncementFormPage />} path="/announcements/:id/edit" />
	</Route>

	<Route element={<NotFoundPage />} path="*" />
</Routes>
```

---

## API Service Structure

```
src/services/
├── api.ts                  ✅  Base fetch wrapper (auth headers, error normalisation)
├── auth.service.ts         ✅  login() / logout()
├── incidents.service.ts    ✅  fetchIncidents(), updateIncidentStatus(), createIncident()
├── announcements.service.ts ✅ CRUD for announcements
├── roads.service.ts        ✅  fetchRoads()
└── shelters.service.ts     ✅  fetchShelters()
```

### Base API (`src/services/api.ts`)

- Reads `VITE_API_URL` env var, falls back to `/api`
- Reads JWT from `sessionStorage["auth_token"]` and injects `Authorization: Bearer` header
- Normalises JSON/text responses; throws typed errors with `.status` and `.body`
- Exports `api.get / post / put / patch / delete`

### Backend API Endpoints (from `old-web/backend/`)

| Method | Path                    | Auth | Roles            |
| ------ | ----------------------- | ---- | ---------------- |
| POST   | `/auth/login`           | —    | public           |
| GET    | `/incidents?limit=N`    | JWT  | ALL              |
| POST   | `/incidents`            | JWT  | CITIZEN, OFFICER |
| PATCH  | `/incidents/:id/status` | JWT  | OFFICER, ADMIN   |
| GET    | `/announcements`        | —    | public           |
| POST   | `/announcements`        | JWT  | ADMIN            |
| PATCH  | `/announcements/:id`    | JWT  | ADMIN            |
| DELETE | `/announcements/:id`    | JWT  | ADMIN            |
| GET    | `/roads`                | —    | public           |
| GET    | `/shelters`             | —    | public           |

---

## Remaining Work (Phase 3+)

- [ ] `src/pages/LoginPage.tsx` — login form using `authService.login()` + `useAuth().login()`
- [ ] `src/pages/MapPage.tsx` — Leaflet map with incident markers, road overlays, shelter pins
- [ ] `src/pages/IncidentListPage.tsx` — filterable/sortable ticket list for OFFICER/ADMIN
- [ ] `src/pages/StatsPage.tsx` — charts dashboard for ADMIN
- [ ] `src/pages/ReportPage.tsx` — SOS / traffic / officer report form
- [ ] `src/pages/AnnouncementsPage.tsx` — public announcements list
- [ ] `src/pages/AnnouncementFormPage.tsx` — create/edit announcements (ADMIN)
- [ ] `src/components/IncidentModal.tsx` — incident detail overlay
- [ ] Update `src/App.tsx` to use `<Routes>` with `<ProtectedRoute>`
