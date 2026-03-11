# Migration Plan: old-web → new-web

---

## Phase 0 — Analysis & Planning

```
Study the existing codebase before writing any code.

1. Read ALL files in `old-web/` thoroughly — understand the full app flow,
   data models, components, routing logic, auth/role logic, and API calls.
2. Read App.tsx to understand all 7 pages and their sections.
3. Read the existing folders: interfaces/, types/, constants/, components/, pages/
4. Produce a DETAILED migration plan as a markdown file saved to `migration-plan.md`:
   - Full file tree of the new structure
   - Which interfaces/types/constants get extracted and where
   - Which components are reusable and should live in components/
   - Which sections within each page should be split into sub-files
   - Route protection strategy (who can see what)
   - API service layer structure
   - Do NOT write any implementation code yet

Only output the migration-plan.md. Stop and wait for approval.
```

---

## Phase 1 — Scaffold & Foundation

```
Using migration-plan.md as your blueprint, scaffold the project structure.

Tasks (in order):
1. Create all folder structure under src/ as planned
2. Extract all TypeScript interfaces → src/interfaces/ (one file per domain)
3. Extract all TypeScript types → src/types/ (one file per domain)
4. Extract all constants → src/constants/ (one file per domain)
5. Create route config → src/routes/ with protected route wrapper
6. Create API service files → src/services/ (one file per resource/domain)

Rules:
- No page or component implementation yet — stubs/skeletons only
- Use pattern: `export default function Name() {}`
- Use path aliases: `@/components/...` not relative paths
- All files must compile without TypeScript errors

Commit message when done: "scaffold: foundation structure"
```

---

## Phase 2 — Reusable Components

```
Implement all shared/reusable UI components in src/components/

For each component:
- Typed props interface in the same file (or imported from interfaces/)
- Follows existing minimal/modern style
- Don't forget to override some HTML elements with styled-components for consistent styling
- Fully responsive (mobile-first)
- Export as default function

Priority components to build:
- Layout: PageLayout, Sidebar, Navbar, BottomNav
- UI: Button, Badge, Card, Modal, Drawer, Toast
- Form: Input, Select, Textarea, DatePicker, FileUpload
- Data: Table, StatusBadge, EmptyState, LoadingSpinner
- Map: MapContainer, MarkerLayer, PopupCard
- Auth: ProtectedRoute, RoleGuard

After all components are done, create src/pages/demo/ that showcases
every component with all its variants and states.

Style must match new-web exactly — copy color tokens, spacing, typography.
```

---

## Phase 3 — Pages (implement one at a time)

สั่งทีละหน้า เพื่อให้ตรวจสอบได้:

```
Implement Page [N]: [ชื่อหน้า]

Reference: old-web/App.tsx section "[ชื่อ section เดิม]"

Requirements:
- Split into sub-components under src/pages/[PageName]/sections/
- Each section file < 150 lines
- Use only components from src/components/
- Wire up API calls from src/services/
- Handle loading, error, and empty states
- Role-based visibility: [ระบุ role ที่เข้าถึงได้]
- Must be fully responsive

File structure for this page:
src/pages/[PageName]/
  index.tsx          ← page entry, composes sections
  sections/
    SectionA.tsx
    SectionB.tsx
  hooks/
    use[PageName].ts  ← page-specific data fetching hook

Do NOT touch other pages. Stop when this page is complete.
```

---

## Phase 4 — Routing & Auth

```
Wire up all routes in src/routes/ and src/App.tsx

1. Define route config array with: path, component, requiredRoles[], isPublic
2. Implement <ProtectedRoute> that:
   - Redirects unauthenticated users → /login
   - Redirects unauthorized roles → /forbidden
3. Implement <RouterProvider> using React Router v6 data router
4. Lazy-load all page components with React.lazy + Suspense
5. Add 404 page

Do NOT change any page components — routing only.
```

---

## Phase 5 — Cleanup

```
Final cleanup tasks:

1. Delete old-web/ folder entirely
2. Run TypeScript compiler — fix ALL type errors
3. Check for unused imports across all files and remove them
4. Verify all path aliases (@/) resolve correctly
5. Ensure DemoPage renders every component without errors
6. Update README.md with new project structure

Output a summary of every file changed/deleted.
```

---
