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

### Routing (`pages/`)
File-based. Key patterns:
- `/mk-lobby` — parent page (`mk-lobby.vue`) handles tab UI; child routes in `pages/mk-lobby/` (`[id].vue`, `new.vue`) are rendered via `<NuxtPage>` within the parent when on a compose route
- `/learning-task` — uses query params (`?view=list`, `?taskId=...`) to toggle between `LearningTaskPopup` and `LearningTaskListPopup` overlays
- `/course/[id]` — dynamic course detail

### Components (`components/`)
- `Base*` — reusable primitives (BaseButton, BaseInput, BaseIcon, BaseDropdown, etc.)
- All others are feature-specific (CourseCard, MkPostPopup, ProfilePopup, etc.)

### State management (`composables/`)
No Pinia — uses Nuxt's `useState` for SSR-safe shared state. Composables act as stores:
- `useAuth` — fake/stub login; persists token + user to localStorage; exposes `user`, `token`, `isAuthenticated`
- `useSearchStore` — fetches search suggestions from the external API
- Others: `useProfilePopup`, `useScreenSize`, `useOverlayScrollLock`, `usePasswordValidation`, `useRegister`, `useTaiwanAddress`, `useVerificationCode`

### API
- External base: `http://143.198.93.171/api` — override via `NUXT_PUBLIC_API_BASE` env var
- Server routes in `server/api/` are Nitro stubs (currently only `search.get.ts` with hardcoded data)
- `useSearchStore` calls `${apiBase}/search/suggestions`

### Design system
- CSS custom properties defined in `assets/css/design-tokens.css` (colors, type scale, spacing, radii)
- Tailwind extended with matching tokens in `tailwind.config.js` — use Tailwind classes (`text-h3`, `bg-primary-1`, `text-brown-5`, etc.)
- Brown palette (`brown-1` through `brown-10` + `brown-30`), primary/secondary/alert/complementary color scales
- Fonts: `font-primary` (Noto Sans TC), `font-secondary` (Gen Jyuu Gothic XP), `font-genyogothic` (GenYoGothic TW)
- `tw-city-selector` is a third-party custom element (Taiwan city/district picker) — declared as custom element in `nuxt.config.ts` to suppress Vue warnings

### Types (`types/`)
Shared TypeScript interfaces. Currently: `search.ts` defines `SearchSuggestionsParams`, `SearchSuggestionsData`, `SearchResult<T>`.
