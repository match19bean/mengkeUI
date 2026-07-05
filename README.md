# mengkeUI

A Nuxt 4 front end for a Japanese-language learning platform, with separate student and teacher experiences (course lobby, flipped-learning, learning tasks, consultation, and profile management). Built with Vue 3, TypeScript, and Tailwind CSS.

> The backend API is external and currently stubbed in places — several composables return fake/hardcoded data (e.g. login), so the app runs standalone for UI development.

## Tech stack

- **[Nuxt 4](https://nuxt.com/)** (Vue 3, Nitro) with file-based routing
- **TypeScript**
- **Tailwind CSS** (`@nuxtjs/tailwindcss`) driven by design tokens in `assets/css/design-tokens.css`
- **[TipTap](https://tiptap.dev/)** rich-text editor (`@tiptap/*`)
- **[tw-city-selector](https://github.com/hs--/tw-city-selector)** — Taiwan city/district picker
- **pnpm** package manager

## Prerequisites

- Node.js (see `@types/node` — Node 20+ recommended)
- [pnpm](https://pnpm.io/) 9

## Setup

Install dependencies:

```bash
pnpm install
```

## Development

Start the dev server at `http://localhost:3000`:

```bash
pnpm dev
```

## Production

```bash
pnpm build      # build for production
pnpm preview    # preview the production build locally
pnpm generate   # static site generation
```

There is currently no test runner or linter configured.

## Configuration

The external API base URL is read from runtime config and can be overridden with an environment variable:

```bash
NUXT_PUBLIC_API_BASE=https://your-api.example.com/api
```

Default: `http://143.198.93.171/api` (see `nuxt.config.ts`).

## Project structure

```
app.vue            Global shell: role-based sidebar + <NuxtPage> + profile popup
pages/             File-based routes; pages/teacher/* mirror the student pages
components/        Base* primitives + feature components
composables/       useState-based stores (useAuth, useApi, useSearchStore, …)
middleware/        auth.ts — per-page route guard (opt in via definePageMeta)
data/              Static reference data (Taiwan address list)
types/             Shared TypeScript interfaces (auth, search)
server/api/        Nitro API stubs
assets/css/        Design tokens
```

Authentication is stubbed: `useAuth` persists a fake token/user to localStorage and infers a `Teacher` vs `Student` role from the account name, which drives the sidebar menu and available routes.

See [`CLAUDE.md`](./CLAUDE.md) for a deeper architecture overview.
