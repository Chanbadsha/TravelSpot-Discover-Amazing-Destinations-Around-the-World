# TravelSpot

An open community platform to discover, rate, and share famous tourist spots and their facilities around the world.

Built with **Next.js 16** (App Router), **React 19**, **TypeScript 5**, and **Tailwind CSS v4**.

## Features

- **Browse Destinations** — Explore tourist spots with ratings, reviews, and facility info
- **User Authentication** — Register/login via email/password (powered by better-auth + MongoDB)
- **Admin Dashboard** — Manage users, moderators, and destinations
- **User Dashboard** — Manage your posts, profile, and saved destinations
- **Blog** — Read and share travel experiences
- **Suggest a Spot** — Submit new tourist spots to the community
- **Dark Mode** — Light/dark theme toggle via next-themes
- **Responsive UI** — HeroUI components with Tailwind v4 styling

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router) |
| UI Library | React 19, HeroUI v3 |
| Styling | Tailwind CSS v4 |
| Auth | better-auth (MongoDB adapter, admin plugin) |
| Forms | react-hook-form + zod |
| Animations | framer-motion |
| Icons | react-icons (Fi/Md) |
| Notifications | react-hot-toast |
| Backend API | Express (separate repo, consumed via REST) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- MongoDB instance (local or Atlas)

### Environment Variables

Create `.env.local` in the project root:

```env
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=<your-mongodb-connection-string>
MONGODB_DB=<database-name>
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  app/                  # App Router pages
    (mainLayout)/       # Home, destinations, blog, contact, suggest-spot
    (auth)/             # Login, register
    (dashboardLayout)/  # Admin & user dashboards
    api/auth/           # better-auth API route
    my-posts/           # User posts management
    profile/            # User profile
  Components/           # UI components organized by domain
  Provider/             # Theme provider
  lib/                  # Auth config, context, utilities
  core/                 # HTTP helpers (serverFetch, serverMutation, etc.)
  services/             # Read-only API service calls
  controllers/          # (stub)
  utils/                # (stub)
```

## Authentication

TravelSpot uses [better-auth](https://better-auth.com) with a MongoDB adapter. Authentication is handled via:

- **Server-side** — `src/lib/auth.ts` — `betterAuth` instance with email/password, admin plugin, custom user fields
- **Client-side** — `src/lib/auth-client.ts` — `authClient` with `adminClient()` plugin
- Exports: `signIn`, `signUp`, `useSession`, `signOut`, `updateUser`

## API

The frontend communicates with a backend REST API at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api`).

- **Read operations** — `src/services/*.ts` files use `serverFetch`
- **Write operations** — `src/services/*CommandService.ts` files use `serverMutation`/`serverPatch`/`serverDelete`

A client-side `DestinationContext` provides fallback seed data (8 destinations) and localStorage-based saved destinations for prototyping.

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com). Set the required environment variables in your Vercel project dashboard.
