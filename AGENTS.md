<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TravelSpot — Frontend

## Stack

- **Next.js 16.2** (App Router), **React 19**, **TypeScript 5**, **Tailwind CSS v4**
- **HeroUI v3** (`@heroui/react`) for components
- **react-icons** (Fi/Md families used)
- **next-themes** with `attribute="class"` and `defaultTheme="light"`
- **better-auth** + **mongodb** (via `@better-auth/mongo-adapter`)
- **react-hook-form** + **zod** for form validation
- **framer-motion** for animations, **react-hot-toast** for notifications
- **npm** (lockfile present, no yarn/pnpm/bun)

## Commands

```sh
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm run start    # start prod server
npm run lint     # ESLint v9 (flat config, core-web-vitals + typescript configs)
```

No test framework is configured. No CI.

## Project structure

```
src/
  app/
    layout.tsx              # root layout (fonts, ThemeProvider, Toaster, DestinationProvider, globals.css)
    globals.css             # Tailwind v4 + CSS custom properties (light/dark)
    (mainLayout)/           # home, destinations, explore-destinations, suggest-spot, blog, contact
    (auth)/                 # login, register
    (dashboardLayout)/      # admin (users, moderators, destinations) + user dashboard
    api/auth/[...all]/route.ts  # better-auth catch-all handler
    my-posts/               # standalone layout with edit
    profile/                # standalone layout
  Components/
    Account/, Admin/, Auth/, Blog/, Contact/, DestinationDetails/,
    ExploreDestinations/, HomePage/, Navbar/, Profile/, SuggestSpot/,
    UI/, UserDashboard/
  Provider/
    ThemeProvider.tsx       # "use client" next-themes wrapper
  lib/
    auth.ts                 # server-side better-auth instance (MongoDB adapter, email+password, admin plugin)
    auth-client.ts          # client-side better-auth client (admin plugin, exports signIn, signUp, useSession, etc.)
    DestinationContext.tsx   # client-side context with seed data + localStorage for saved destinations
    utils.ts                # isValidUrl, formatDate
  core/
    server.ts               # HTTP helpers: serverMutation, serverFetch, serverPatch, serverDelete (targets NEXT_PUBLIC_API_URL)
  services/
    *Service.ts             # read-only API calls (use serverFetch)
    *CommandService.ts      # write API calls (use serverMutation/serverPatch/serverDelete)
  controllers/              # empty (stub)
  utils/                    # empty (stub)
```

## Path alias

`@/*` maps to project root. Imports use `@/src/...` (e.g., `import { auth } from "@/src/lib/auth"`).

## Tailwind v4

- `@import "tailwindcss"` (not `@tailwind` directives)
- `@theme inline` block in CSS defines custom tokens
- PostCSS plugin: `@tailwindcss/postcss`

## Theming

- CSS custom properties in `:root` (light) and `.dark` (dark)
- `next-themes` wraps via `<ThemeProvider attribute="class" defaultTheme="light">`
- Client components must use `"use client"` for theme hooks

## Authentication (better-auth)

- **Server-side**: `src/lib/auth.ts` creates `betterAuth` with MongoDB adapter, email+password enabled, admin plugin, custom user fields (`tag`, `bio`, `yearsExperience`)
- **Client-side**: `src/lib/auth-client.ts` creates auth client with `adminClient()` plugin, exports `{ signIn, signUp, useSession, signOut, updateUser }`
- **API route**: `src/app/api/auth/[...all]/route.ts` delegates to `better-auth/next-js` handler
- **Env vars required**: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `MONGODB_DB`

## API / data layer

- **Backend API** at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api`)
- Read services (`destinationsService.ts`, `postsService.ts`, etc.) call `serverFetch` from `src/core/server.ts`
- Write services (`destinationsCommandService.ts`, etc.) call `serverMutation`/`serverPatch`/`serverDelete`
- `DestinationContext` provides client-side fallback state with seed data (8 destinations) and localStorage-based saved destinations — useful for prototyping but the services layer hits the real backend.

## Image config

`next.config.ts` allows all remote image hostnames (`remotePatterns` with wildcard `**`).

## Notes

- `.env` and `.env.local` exist and are gitignored; runtime may require them
- `controllers/` and `utils/` directories exist but are empty
