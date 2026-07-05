# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server at http://localhost:3000
pnpm build        # production build
pnpm preview      # preview production build
pnpm generate     # static site generation
```

No test runner or linter is configured.

## Architecture

**Stack**: Nuxt 4, Vue 3, TypeScript, Tailwind CSS, pnpm

### App shell (`app.vue`)
Global layout: `BaseSidebar` (left, hidden on `/login` and `/signup`) + `<NuxtPage>` (right, scrollable) + global `ProfilePopup`. Auth state is initialized from localStorage via `useAuth().initAuth()` on `onMounted`.

**Role-based UI**: the sidebar menu and home path switch on `user.type` (`'Teacher'` vs `'Student'`). Teachers get `/teacher/*` routes and home `/teacher`; students (or unauthenticated visitors) get the root `/*` routes with certain items shown as locked until logged in (`isStudent = !isAuthenticated || user.type !== 'Teacher'`).

### Routing (`pages/`)
File-based. Key patterns:
- `pages/teacher/*` — teacher-facing mirror of the student pages (`club`, `flipped-learning`, `mk-lobby`, `consultation`, `cat-lesson`, `learning-task`, `index`). Pages guard access with `definePageMeta({ middleware: 'auth' })`
- `/mk-lobby` — parent page (`mk-lobby.vue`) handles tab UI; child route `pages/mk-lobby/new.vue` is rendered via `<NuxtPage>` within the parent when on the compose route
- `/learning-task` — uses query params (`?view=list`, `?taskId=...`) to toggle between `LearningTaskPopup` and `LearningTaskListPopup` overlays; `pages/learning-task/[id].vue` is the detail route
- `/course/[id]` — dynamic course detail

### Middleware (`middleware/`)
- `auth.ts` — route middleware that redirects to `/login` when `!isAuthenticated`. Opt in per-page with `definePageMeta({ middleware: 'auth' })` (not global)

### Components (`components/`)
- `Base*` — reusable primitives (BaseButton, BaseInput, BaseIcon, BaseDropdown, etc.)
- All others are feature-specific (CourseCard, MkPostPopup, ProfilePopup, etc.)

### State management (`composables/`)
No Pinia — uses Nuxt's `useState` for SSR-safe shared state. Composables act as stores:
- `useAuth` — fake/stub login (returns a hardcoded response; `type` is inferred as `'Teacher'` when the account contains "teacher", else `'Student'`); persists token + user via `useCookie` (SSR-readable, so `middleware/auth.ts` sees auth state on first render); exposes `user`, `token`, `isAuthenticated`, `login`, `logout`
- `useApi` — thin `$fetch` wrapper that prepends `config.public.apiBase`, attaches `Authorization: Bearer <token>` from `useAuth`, and redirects to `/login` on 401. Use this for authenticated external calls
- `useSearchStore` — fetches search suggestions from the external API
- Others: `useProfilePopup`, `useScreenSize`, `useOverlayScrollLock`, `usePasswordValidation`, `useRegister`, `useTaiwanAddress`, `useVerificationCode`

### API
- External base: `http://143.198.93.171/api` — override via `NUXT_PUBLIC_API_BASE` env var
- Prefer `useApi().call<T>(path, options)` for authenticated requests (token + 401 handling built in)
- Server routes in `server/api/` are Nitro stubs (currently only `search.get.ts` with hardcoded data)
- `useSearchStore` calls `${apiBase}/search/suggestions`

### Static data (`data/`)
Plain TS modules for static reference data (currently `taiwan-address.ts` — Taiwan counties/districts, consumed by `useTaiwanAddress`).

### Design system
- Design tokens (colors, type scale, spacing, radii, shadows) are defined in `tailwind.config.js` under `theme.extend` — use them as Tailwind classes (`text-h3`, `bg-primary-1`, `text-brown-5`, `shadow-popup`, etc.). There are **no** CSS custom properties for tokens; `assets/css/design-tokens.css` only holds a small global reset + `body` defaults
- Dynamic color/typography classes are kept via `safelist` in `tailwind.config.js` — add new dynamically-composed class patterns there or Tailwind will purge them
- Brown palette (`brown-1` through `brown-10` + `brown-30`), primary/secondary/alert/complementary color scales
- Fonts: `font-primary` (Noto Sans TC), `font-secondary` (Gen Jyuu Gothic XP), `font-genyogothic` (GenYoGothic TW)
- `tw-city-selector` is a third-party custom element (Taiwan city/district picker) — declared as custom element in `nuxt.config.ts` to suppress Vue warnings

### Types (`types/`)
Shared TypeScript interfaces:
- `search.ts` — `SearchSuggestionsParams`, `SearchSuggestionsData`, `SearchResult<T>`
- `auth.ts` — `User` (id, nickname, account, email, `type: 'Teacher' | 'Student'`, etc.), consumed by `useAuth`
