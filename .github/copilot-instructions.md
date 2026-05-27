# Copilot instructions for this repository

## Build, test, and lint commands

Use `pnpm`; the repo pins `pnpm@9` in `package.json`.

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm generate
```

- Full build: `pnpm build`
- Dev server: `pnpm dev`
- Preview production build: `pnpm preview`
- Generate static output: `pnpm generate`
- Single test: **not available**
- Full test suite: **not available**
- Lint: **not available**

There is currently no `test`, `lint`, or typecheck script in `package.json`, and there are no `*.spec.*` or `*.test.*` files in the repository. Do not invent Vitest, Jest, ESLint, or single-test commands unless the task explicitly adds that tooling.

## High-level architecture

- `app.vue` is the global application shell. It renders the persistent `BaseSidebar`, hosts `NuxtPage`, and controls the `ProfilePopup`. The sidebar is hidden only on `/login` and `/signup`.
- Authentication is front-end state only right now. `composables/useAuth.ts` stores the token and user in Nuxt `useState`, restores them from `localStorage` in `initAuth()`, and currently returns **fake login data** instead of calling a real backend.
- Most pages are composition-heavy screens built from reusable `Base*` components plus feature components:
  - `pages/index.vue`: home dashboard
  - `pages/club.vue`: club/course catalog and popup-driven course detail flow
  - `pages/flipped-learning.vue`: learning analytics dashboard
  - `pages/login.vue` and `pages/signup.vue`: standalone auth screens
- The deep-link routes `pages/course/[id].vue` and `pages/learning-task/[id].vue` are redirect shims, not real detail pages. They set SEO metadata, then redirect into query-based flows such as `/club?course=...` and `/learning-task?taskId=...`.
- Search is split across two layers:
  - `components/TopSearchBar.vue` uses `useSearchStore()`
  - `composables/useSearchStore.ts` calls `${runtimeConfig.public.apiBase}/search/suggestions`
  - `server/api/search.get.ts` exists as a local Nitro mock endpoint, but the current UI does **not** call it
- Runtime API configuration is centralized in `nuxt.config.ts` under `runtimeConfig.public.apiBase`, defaulting to `http://143.198.93.171/api`.

## Mock vs real data boundaries

- `useAuth.ts` is still a mock auth layer. It persists auth state locally, but `login()` returns fake member/token data.
- `useRegister.ts` is also still mock-first. It returns success-shaped placeholder data and does not call a live registration endpoint.
- `useSearchStore.ts` is wired to the external API base from `runtimeConfig.public.apiBase`.
- `server/api/search.get.ts` is only a local Nitro mock endpoint for search-like behavior; it is not the current source used by `TopSearchBar`.
- Many page-level datasets in `pages/index.vue`, `pages/club.vue`, `pages/flipped-learning.vue`, and popup components are hardcoded UI/demo data. Preserve those placeholders unless the task is specifically about replacing them with real API calls.

## Where to make changes

- If the change affects the global frame, sidebar visibility, or profile popup mounting, start in `app.vue`.
- If the change should be reusable across screens, check `components/Base*.vue` first and extend the existing primitive instead of duplicating markup at page level.
- If the change is page-specific styling or content composition, keep it in the page component and use class overrides rather than pushing page-only behavior into a base component.
- If the change is shared state or cross-route UI behavior, prefer the existing composable + `useState` pattern (`useAuth`, `useProfilePopup`, `useSearchStore`) instead of introducing Pinia or a new store layer.
- Treat `pages/course/[id].vue` and `pages/learning-task/[id].vue` as redirect entry points. They are not the main implementation surface for course/task UI.

## Key conventions

- Reusable UI primitives live in `components/Base*.vue`. Before adding one-off markup, check whether a base component already exists and extend its props/variants if the change is meant to be reused.
- Nuxt auto-imports are part of the workflow here. Do not add unnecessary manual imports for Nuxt composables when the framework already provides them.
- Styling is a mix of Tailwind utilities and project design tokens:
  - global CSS tokens are defined in `assets/css/design-tokens.css`
  - Tailwind colors, typography, spacing, and safelisted token class patterns are defined in `tailwind.config.js`
  - pages frequently pass extra utility classes into base components, so preserve that override pattern instead of hardcoding page-specific variants into the base component
- Shared cross-route state is handled with Nuxt composables plus `useState` (`useAuth`, `useProfilePopup`, `useSearchStore`), not Pinia or a custom store layer.
- Types are defined inline with `interface` in SFCs/composables and in `types/` for shared API contracts such as `types/search.ts`. Follow the existing `<script setup lang="ts">` pattern.
- Public assets are referenced with absolute `/images/...` paths from `public\images`.
