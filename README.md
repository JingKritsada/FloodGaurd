# Flood Guard

Flood Guard is a React + TypeScript + Vite front end for a flood-response platform focused on Sukhothai province. The project is positioned as an interactive prototype for three audiences: citizens, field officers, and command center administrators.

The current codebase already includes the shared application shell, theme and typography system, alert and loading infrastructure, role-aware UI controls, route protection scaffolding, and typed API service modules for backend integration.

## Current State

This repository is not just a Vite starter anymore, but it is still in an early application stage.

- The app shell and providers are in place.
- Demo pages currently exist for the reusable button system and alert modal system.
- Service modules are prepared for auth, incidents, roads, shelters, and announcements.
- Protected routing exists, but business pages are not wired in yet.
- The top-right auth action in the header is still a UI placeholder rather than a real login flow.

## Features Already Implemented

- React 19 application bootstrapped with Vite 7 and TypeScript 5.
- Tailwind CSS v4 styling with a custom theme and local fonts.
- Thai-first visual identity using Anuphan, SaoChingCha, and JetBrains Mono.
- Global provider composition for:
    - theme mode and font-size controls
    - alert modals
    - global loading overlay
    - auth state based on JWT payload decoding
    - React error boundary protection
- Reusable base button component with multiple variants, sizes, loading state, and icon-only mode.
- Alert and confirm modal flows exposed through context.
- Route scaffolding with a protected route wrapper.
- API wrapper with:
    - typed request helpers
    - bearer-token injection
    - global loading integration
    - centralized user-friendly error messages

## Demo Routes

At the moment, the UI that is directly reachable in the router is mostly demo-oriented.

- `/demo/button` renders the button design system showcase.
- `/demo/alert` renders alert and confirm modal examples.
- `*` falls back to a custom 404 page.

The root path currently lands on the catch-all not found page because no `/` route has been defined yet.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM 7
- Tailwind CSS v4
- Lucide React
- ESLint + Prettier

## Project Structure

```text
src/
	components/
		AppComponents/      # app shell pieces such as header and main layout
		BaseComponents/     # reusable primitives such as BaseButton
	constants/            # UI constants and shared configuration
	interfaces/           # TypeScript interfaces for components, providers, services
	pages/                # routeable pages and demo screens
	providers/            # auth, theme, alert, loading, and app provider composition
	routes/               # route guards such as PrivateRoute
	services/             # typed API clients for backend endpoints
	types/                # shared type aliases
	utils/                # utility helpers such as loadingManager
```

## Getting Started

### Prerequisites

- Node.js 20 or newer is recommended.
- npm is used in this repository.

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Environment Variables

Create a local environment file if needed:

```bash
.env.local
```

Supported variable:

```env
VITE_API_URL=https://platform.psru.ac.th:3019/api
```

If `VITE_API_URL` is not set, the frontend falls back to `/api`.

## Available Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs TypeScript project builds and then creates a production bundle.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.
- `npm run lint:fix` runs ESLint with automatic fixes.
- `npm run format` runs Prettier across the repository.

## Backend Integration Layer

The frontend already contains service modules for these backend areas:

- `authService` for login, registration, profile update, token verification, and logout.
- `incidentService` for listing, filtering, creating, and updating incident status.
- `roadService` for road status retrieval.
- `shelterService` for shelter retrieval.
- `announcementService` for public and admin announcement operations.

These services are typed and share a common request wrapper, but most of them are not yet connected to dedicated production pages.

## Authentication Model

There are currently two auth-related layers in the codebase:

- `AuthContext` manages in-app auth state and restores a JWT from `sessionStorage`.
- `authService` persists its token using `localStorage` for API requests.

That means the project has the pieces needed for authentication, but the end-to-end login flow is not fully unified yet. If you continue developing this project, aligning token storage and login/logout behavior should be one of the first cleanup steps.

## UI and Accessibility Notes

- The app supports light mode, dark mode, and system theme detection.
- Users can increase or decrease the root font size through the header controls.
- The design system includes reusable button variants and modal patterns.
- The interface includes Thai copy in several places, reflecting the intended audience.

## Suggested Next Build Steps

- Add a real home route at `/`.
- Connect the header auth button to actual login and logout actions.
- Build the first functional dashboards for citizen, officer, and admin roles.
- Connect the prepared service layer to real data-driven pages.
- Align token persistence between context state and API client helpers.
- Add tests for providers, route guards, and the API wrapper.

## License

No license has been defined in this repository yet.
