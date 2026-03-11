# FloodGuard — รู้ทันน้ำท่วม จังหวัดสุโขทัย

Flood incident management system for Sukhothai province.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **React Router v6** (data router / `createBrowserRouter`)
- **Tailwind CSS v4**
- **react-leaflet v5** + **Leaflet** — interactive maps
- **Recharts** — statistics charts
- **Lucide React** — icons

## Project Structure

```
src/
├── App.tsx                          # Entry: RouterProvider
├── index.tsx                        # React DOM root
├── index.css                        # Global styles + Tailwind
│
├── routes/
│   ├── router.tsx                   # All routes (createBrowserRouter)
│   └── ProtectedRoute.tsx           # Role-based route guard
│
├── providers/
│   ├── Providers.tsx                # Legacy (unused – kept for tests)
│   ├── AuthContext.tsx              # JWT auth state
│   ├── ThemeContext.tsx             # light/dark/system + font-size
│   └── AlertContext.tsx            # Global alert/confirm modal
│
├── components/
│   ├── AppComponents/
│   │   ├── AppBar.tsx               # Top navigation bar
│   │   └── AppNavBar.tsx            # (reserved)
│   ├── BaseComponents/
│   │   └── BaseButton.tsx           # Primary button component
│   ├── BottomNav.tsx                # Role-aware bottom navigation
│   ├── AlertModal.tsx               # Alert / confirm modal
│   ├── FontSizeControl.tsx          # Font-size stepper
│   ├── ErrorBoundary.tsx            # React error boundary
│   └── FuzzyText.tsx                # Canvas fuzzy text effect
│
├── pages/
│   ├── MapPage/                     # / — interactive map
│   │   ├── index.tsx
│   │   ├── hooks/useMapPage.ts
│   │   └── sections/
│   │       ├── MapSection.tsx       # react-leaflet map
│   │       ├── MapFilters.tsx       # Filter overlay buttons
│   │       └── IncidentModal.tsx    # Incident detail drawer
│   ├── IncidentListPage/            # /list — incident work list
│   │   ├── index.tsx
│   │   ├── hooks/useIncidentList.ts
│   │   └── sections/IncidentListSection.tsx
│   ├── StatsDashboardPage/          # /stats — analytics (ADMIN)
│   │   ├── index.tsx
│   │   ├── hooks/useStatsDashboard.ts
│   │   └── sections/
│   │       ├── StatsCardsSection.tsx
│   │       └── StatsChartsSection.tsx
│   ├── ReportFormPage/              # /report — submit incident
│   │   ├── index.tsx
│   │   ├── hooks/useReportForm.ts
│   │   └── sections/
│   │       ├── CitizenReportSection.tsx
│   │       ├── OfficerReportSection.tsx
│   │       └── FormMap.tsx
│   ├── AnnouncementsPage/           # /announcements
│   │   ├── index.tsx
│   │   ├── hooks/useAnnouncements.ts
│   │   └── sections/AnnouncementListSection.tsx
│   ├── AnnouncementFormPage/        # /announcements/new, /:id/edit (ADMIN)
│   │   ├── index.tsx
│   │   └── hooks/useAnnouncementForm.ts
│   ├── ErrorPage.tsx
│   ├── NotFoundPage.tsx             # 404
│   ├── ForbiddenPage.tsx            # 403
│   └── demo/
│       ├── ButtonDemoPage.tsx       # /demo/buttons
│       └── AlertDemoPage.tsx        # /demo/alerts
│
├── services/
│   ├── api.ts                       # Base fetch wrapper + JWT headers
│   ├── auth.service.ts              # login / logout
│   ├── incidents.service.ts         # fetchIncidents, createIncident, updateStatus
│   ├── announcements.service.ts     # CRUD announcements
│   ├── roads.service.ts             # fetchRoads
│   └── shelters.service.ts          # fetchShelters
│
├── interfaces/
│   ├── incidents.interfaces.ts      # Location, Incident, RoadStatus, Shelter, Announcement
│   ├── components.interfaces.ts
│   ├── pages.interfaces.ts
│   └── providers.interfaces.ts
│
├── types/
│   ├── index.types.ts               # Role, AppView, IncidentType, TicketStatus, …
│   └── components.types.ts
│
└── constants/
    ├── incidents.constants.ts       # TYPE_LABELS, STATUS_LABELS, FILTER_LABELS, DEMO_CENTER
    ├── components.constants.tsx     # Button styles, alert icons, roles list
    └── zindex.constants.tsx
```

## Routes

| Path | Page | Access |
|------|------|--------|
| `/` | MapPage | All |
| `/list` | IncidentListPage | All |
| `/stats` | StatsDashboardPage | ADMIN |
| `/report` | ReportFormPage | All |
| `/announcements` | AnnouncementsPage | All |
| `/announcements/new` | AnnouncementFormPage | ADMIN |
| `/announcements/:id/edit` | AnnouncementFormPage | ADMIN |
| `/demo/buttons` | ButtonDemoPage | All |
| `/demo/alerts` | AlertDemoPage | All |
| `/forbidden` | ForbiddenPage | — |
| `*` | NotFoundPage | — |

## Getting Started

```bash
npm install
npm run dev
```

## Environment

Create a `.env` file:

```
VITE_API_URL=http://localhost:3001/api
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Format with Prettier |
