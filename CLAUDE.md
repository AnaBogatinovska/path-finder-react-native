# CLAUDE.md — Project Guidelines

This file defines the engineering standards, architecture decisions, and design principles for this project. All code written in this repository must follow these guidelines.

---

## Stack

- **Framework**: React Native + Expo (New Architecture enabled)
- **Routing**: Expo Router (file-based)
- **State Management**: Zustand
- **Styling**: NativeWind v4 (Tailwind CSS)
- **Language**: TypeScript (strict mode)
- **Animations**: react-native-reanimated (StyleSheet only — never mix with NativeWind)

---

## Architecture

Follow **Clean Architecture** with strict layer separation. Dependencies always point inward — outer layers depend on inner layers, never the reverse.

```
app/                  → Routing layer (Expo Router screens)
features/             → Feature modules (self-contained vertical slices)
  [feature]/
    components/       → UI components scoped to this feature
    hooks/            → Feature-specific hooks
    store/            → Zustand store slice for this feature
    services/         → API calls, external integrations
    types.ts          → Feature-scoped TypeScript types
components/           → Shared/reusable UI components only
store/                → Global Zustand stores (cross-feature state)
services/             → Shared services (HTTP client, location, storage)
hooks/                → Shared hooks
constants/            → App-wide constants (theme, config, routes)
utils/                → Pure utility functions (no side effects)
types/                → Global TypeScript types and interfaces
```

### Rules

- Screens in `app/` are thin — they import from `features/`, never contain business logic directly.
- A feature module must not import from another feature module. Cross-feature communication goes through a shared store or service.
- `utils/` contains pure functions only — no API calls, no state access, no side effects.
- `services/` never imports from `store/` or `components/`.

---

## Separation of Concerns

### Screens (Routing Layer)
- Responsible for: layout composition, navigation params, screen-level error boundaries.
- Must NOT contain: business logic, API calls, raw data transformation.

```tsx
// app/(tabs)/index.tsx — correct
export default function HomeScreen() {
  return <RouteSearchFeature />
}
```

### Feature Components
- Responsible for: feature UI, connecting hooks to components.
- Must NOT contain: direct API calls or store mutations outside of hooks.

### Hooks
- Responsible for: data fetching, store access, derived state, side effects.
- Every hook must have a single, clear responsibility.
- Name hooks descriptively: `useRouteSearch`, `useCurrentLocation`, not `useData`.

### Services
- Responsible for: all external communication (API, device APIs, storage).
- Must return typed results — never return `any`.
- Must handle network/device errors internally and throw typed errors upward.

### Store (Zustand)
- Responsible for: global shared state only.
- Do not put server-fetched data in the store if it can live in a hook (use TanStack Query or SWR for server state if added later).
- Keep actions co-located with state in the same slice.

---

## Error Handling

### Principle: Errors must never be silent. Every error must be caught, categorized, and handled intentionally.

### Error Boundary (Screen Level)
Wrap every screen route with an error boundary. Use Expo Router's built-in `ErrorBoundary` export:

```tsx
// app/(tabs)/index.tsx
export function ErrorBoundary({ error }: { error: Error }) {
  return <ScreenError message={error.message} />
}
```

### Service Layer Errors
All services must throw typed errors, never raw `Error` or untyped rejections:

```ts
// types/errors.ts
export type AppErrorCode =
  | 'NETWORK_UNAVAILABLE'
  | 'LOCATION_PERMISSION_DENIED'
  | 'ROUTE_NOT_FOUND'
  | 'UNKNOWN'

export class AppError extends Error {
  constructor(public code: AppErrorCode, message: string) {
    super(message)
    this.name = 'AppError'
  }
}
```

### Hook Level
Hooks that fetch data must always expose an `error` state:

```ts
return { data, isLoading, error }
```

Never let a hook throw uncaught — catch at the hook boundary and set error state.

### Global Unhandled Errors
Register a global handler at app startup in `app/_layout.tsx`:

```ts
ErrorUtils.setGlobalHandler((error, isFatal) => {
  // Log to crash reporting service
  // Show user-facing fallback if fatal
})
```

---

## Edge Case Handling

Every data-dependent UI must explicitly handle all states. No implicit assumptions.

### Required States for Any Async Operation

| State | UI Requirement |
|---|---|
| Loading | Skeleton or spinner — never a blank screen |
| Empty | Intentional empty state with guidance copy |
| Error | Actionable error UI (retry button where applicable) |
| Partial data | Gracefully degrade, never crash |
| Offline | Detect with NetInfo, show offline banner |

### Location & Permissions
- Always check permission status before accessing device APIs.
- Handle `denied`, `blocked`, and `undetermined` states explicitly with user-facing guidance.
- Never assume location is available.

### Navigation Edge Cases
- Deep links and cold-start routes must be handled — never assume prior navigation state exists.
- Modal/sheet dismissal must not leave the app in a broken state.

### Input Edge Cases
- Validate all user input before processing.
- Handle empty strings, whitespace-only input, and special characters.
- Search fields must handle: no results, too many results, slow queries.

---

## UI Standards

### Principle: Every interaction must feel intentional. No janky transitions, no layout shifts, no raw loading states.

### Animation Rules
- Use `react-native-reanimated` for all animations — never `Animated` from React Native core.
- Transitions between screens must use shared element transitions or fade where appropriate.
- List items entering the viewport should animate in (staggered fade/slide).
- All interactive elements must have press feedback — use `Haptics` for key actions.
- Animation durations: micro-interactions 150ms, standard transitions 250–300ms, complex 400ms max.
- Reanimated styles use StyleSheet only — never `className` (NativeWind) on animated values.

### Styling Rules
- Use NativeWind (`className`) for all static styles.
- Use `dark:` variants for every color — no hardcoded colors that ignore theme.
- Spacing must follow the Tailwind scale — no arbitrary pixel values unless absolutely required.
- Typography must use the defined font scale from `constants/theme.ts` (mapped to Tailwind config).
- Touch targets must be minimum 44x44pt (Apple HIG / Material guidelines).

### Layout Rules
- All screens must respect safe area insets — use `SafeAreaView` or `useSafeAreaInsets`.
- Keyboards must be handled — use `KeyboardAvoidingView` on screens with inputs.
- No content should be hidden behind system UI (notch, home indicator, status bar).

### Loading States
- Use skeleton screens (not spinners) for content that has a known shape.
- Spinners are acceptable only for actions (submit button, pull-to-refresh).
- Never show a blank white/dark screen during any transition.

### Feedback & Affordance
- Every destructive action requires confirmation.
- Every async action (button press) must disable the trigger while in-flight.
- Success/failure states must be communicated visually — use toast or inline feedback.

---

## TypeScript Standards

- `strict: true` is non-negotiable.
- No `any`. Use `unknown` and narrow explicitly.
- All function parameters and return types must be explicitly typed.
- API response shapes must be typed — use `zod` for runtime validation if responses are untrusted.
- Use `type` for data shapes, `interface` for component props.

---

## File & Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `route-search.tsx` |
| Components | PascalCase | `RouteCard` |
| Hooks | camelCase + `use` prefix | `useCurrentLocation` |
| Stores | camelCase + `use` + `Store` suffix | `useRouteStore` |
| Services | camelCase + `Service` suffix | `locationService` |
| Types | PascalCase | `RouteStep`, `AppError` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_WAYPOINTS` |
| Directories | kebab-case | `features/route-search/` |

---

## What to Avoid

- Do not use `useEffect` to sync state — derive state or use Zustand selectors.
- Do not use `any` type. Ever.
- Do not place business logic in screen files.
- Do not use `Animated` API from React Native core — use Reanimated exclusively.
- Do not hardcode colors, spacing, or font sizes outside of the Tailwind config.
- Do not ignore errors with empty `catch` blocks.
- Do not use `console.log` in committed code — use a logger utility.
- Do not skip empty states or loading states — they are a UI requirement, not optional.
- Do not mix NativeWind `className` with Reanimated animated styles on the same element.
