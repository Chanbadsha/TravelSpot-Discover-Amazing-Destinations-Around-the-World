<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TravelSpot — Frontend

## Stack

- **Next.js 16.2** (App Router), **React 19**, **TypeScript 5**, **Tailwind CSS v4**
- **HeroUI v3** (`@heroui/react`) for components
- **react-icons** (Fi/Md families used)
- **next-themes** with `attribute="class"` `defaultTheme="light"`
- **better-auth** + **mongodb** v7 adapter
- **react-hook-form** + **zod** v4 for form validation
- **framer-motion**, **react-hot-toast**
- **npm** only (lockfile present, no yarn/pnpm/bun)

## Commands

```sh
npm run dev      # http://localhost:3000
npm run build    # production build (includes TS check)
npm run start
npm run lint     # ESLint v9 flat config (core-web-vitals + TS)
```

No test framework. No CI.

## Path alias

`@/*` maps to project root. Imports use `@/src/...` (e.g. `@/src/lib/auth`).

## Next.js 16.x quirks

- `params` and `searchParams` in page/layout props are **Promises** — must be awaited: `const { id } = await params`
- Metadata exported via `export const metadata: Metadata = { ... }` or `export async function generateMetadata()` — server components only, never from `"use client"`
- Root layout uses `title: { template: "%s | TravelSpot", default: "TravelSpot - Discover Famous Tourist Spots" }` — child pages just set a plain title string
- `fetch` inside `generateMetadata` is auto-memoized across the render pass
- File from `node_modules/next/dist/docs/` is authoritative for API reference

## Tailwind v4

- `@import "tailwindcss"` (not `@tailwind` directives)
- `@theme inline` in CSS defines custom design tokens
- PostCSS plugin: `@tailwindcss/postcss`
- All spacing/styling uses CSS custom properties from `globals.css` (`var(--background)`, `var(--foreground)`, `var(--primary)`, etc.) — prefer them over hardcoded colors

## Theming

- `next-themes` with `<ThemeProvider attribute="class" defaultTheme="light">`
- Light vars in `:root`, dark overrides in `.dark` — both in `globals.css`
- Client components need `"use client"` for `useTheme` hook

## Authentication (better-auth)

- **Server-side**: `src/lib/auth.ts` — `betterAuth` instance, MongoDB adapter, email+password, admin plugin, custom fields (`tag`, `bio`, `yearsExperience`)
- **Client-side**: `src/lib/auth-client.ts` — `createAuthClient` with `adminClient()` plugin; exports `{ signIn, signUp, useSession, signOut, updateUser }`
- **API route**: `src/app/api/auth/[...all]/route.ts` delegates to `toNextJsHandler(auth)`
- **Env vars**: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `MONGODB_DB`

## API / data layer

- **Backend** at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api`)
- **Read services** (`src/services/*Service.ts`) call `serverFetch` from `src/core/server.ts`
- **Write services** (`src/services/*CommandService.ts`) call `serverMutation`/`serverPatch`/`serverDelete`
- `serverFetch` returns `{ data: [], error: "..." }` on failure (never throws) — callers must check for `data` array
- `serverMutation`/`serverPatch`/`serverDelete` return `{ success: false, message: "..." }` on failure
- `DestinationContext` provides client-side fallback with 8 seed destinations + localStorage saves — useful for prototyping without backend

## Page metadata

Every route has its own static `metadata` export or `generateMetadata` (for `destinations/[id]`). See `src/app/**/page.tsx` for the full list.

## Component conventions

- Components are in `src/Components/<Domain>/` directories (e.g. `Admin/`, `Auth/`, `DestinationDetails/`)
- Dashboard layout (`(dashboardLayout)`) is a client component — do not export metadata from it
- Standalone layouts (`my-posts`, `profile`) are also client components

## Image config

`next.config.ts` allows all remote hostnames (`remotePatterns: [{ protocol: 'https', hostname: '**' }]`).

## Notes

- `.env` and `.env.local` exist and are gitignored — runtime may require them
- `controllers/` and `utils/` directories exist but are empty stubs
