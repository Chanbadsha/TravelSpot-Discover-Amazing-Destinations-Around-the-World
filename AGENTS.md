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
- **npm** (lockfile present, no yarn/pnpm/bun)

## Commands

```sh
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm run start    # start prod server
npm run lint     # ESLint v9 (flat config, core-web-vitals + typescript configs)
```

No test framework is configured.

## Project structure

```
src/
  app/
    (mainLayout)/page.tsx   # home page entry
    (mainLayout)/layout.tsx # route-group layout wrapper
    layout.tsx              # root layout (fonts, ThemeProvider, globals.css)
    globals.css             # Tailwind v4 + custom CSS variables (light/dark)
  Components/
    HomePage/HomeHero.tsx   # hero with search form
  Provider/
    ThemeProvider.tsx       # "use client" next-themes wrapper
```

## Path alias

`@/*` maps to project root. Imports use `@/src/Components/...` (e.g., `import HomePageHero from "@/src/Components/HomePage/HomeHero"`).

## Tailwind v4 quirks

- Uses `@import "tailwindcss"` (not `@tailwind` directives)
- The `@theme inline` block in CSS defines custom theme tokens
- PostCSS plugin: `@tailwindcss/postcss` (v4-specific)

## Theming

- CSS custom properties in `:root` (light) and `.dark` (dark)
- `next-themes` wraps via `<ThemeProvider attribute="class" defaultTheme="light">`
- Client components must wrap dark-mode toggles with `"use client"`

## No CI / no test framework

No GitHub Actions, no test runner, no pre-commit hooks configured.
