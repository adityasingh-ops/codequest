### CodeQuest

A Next.js 15 application for competitive coding: create or join battles, collaborate in teams, solve problems, and climb the leaderboard. Backed by Supabase for auth, data, and realtime features.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS v4, Framer Motion, Lucide icons
- **State/UX**: React Context providers, React Hot Toast
- **Backend**: Next.js Route Handlers (`/api`), Supabase (Auth + Postgres)
- **Linting**: ESLint 9, `eslint-config-next`

## Quick Start

Prereqs:

- Node.js 18+
- npm (or pnpm/yarn/bun)

Install and run:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Scripts

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build (Turbopack)
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Environment & Configuration

The app uses Supabase for auth and data. By default, a hosted Supabase URL and anon key are currently hardcoded for development in `lib/supabase/client.ts`. For a production setup, move these to environment variables and never commit secrets.

Recommended environment variables:

```
# Public (safe to expose to the browser)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-side only (if needed for server actions/webhooks)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then update `lib/supabase/client.ts` to read from `process.env` instead of hardcoding values.

Images are configured in `next.config.ts` to load from the project’s Supabase storage domain.

## Project Structure

High-level layout (selected paths):

```
api/                      # Route handlers (serverless APIs)
  battles/                # Battles CRUD and actions
  teams/                  # Teams CRUD and actions
  user/                   # User endpoints (e.g., update name)
app/                      # App Router pages and layout
components/               # UI components by feature
lib/
  hooks/                  # Custom React hooks
  interfaces/             # Context and interface types
  providers/              # React context providers
  services/               # Client-side service modules
  supabase/               # Supabase clients (client/server)
  types/                  # Shared TypeScript types
  utils/                  # Utilities and constants
supabase/
  migrations/             # SQL migrations
```

Key modules:

- `lib/providers/AuthProvider.tsx` and `lib/providers/UserDataProvider.tsx` expose app state via React context.
- `lib/services/*` contains data access and integration with Supabase/third-party services.
- `api/*` contains Next.js Route Handlers for server-side logic (e.g., battles, teams, leaderboard).

## Features Overview

- Battles: create, join, start, submit within `/api/battles` and UI under `components/battles/*`
- Teams: create/join/leave under `/api/teams` and `components/teams/*`
- Leaderboard and user stats: services in `lib/services/*`, UI in `components/leaderboard/*`
- Auth: Supabase Auth with `@supabase/auth-helpers-nextjs`

## Database & Migrations (Supabase)

Migrations live under `supabase/migrations`. To apply them:

Option A: Supabase Dashboard

- Create a Supabase project
- Open SQL editor and run the SQL files in order (e.g., `002_teams_and_battles.sql`, then `20251006181946_add_user_stats.sql`)

Option B: Supabase CLI (local dev)

- Install the CLI (`supabase`), run `supabase init`, and point to your project
- Apply SQL files manually or integrate into a CLI workflow

## Development Notes

- The app uses the Next.js App Router. Pages and layouts live in `app/`.
- API logic uses Route Handlers under `api/` directories.
- Supabase client:
  - Client-side: `lib/supabase/client.ts`
  - Server components/handlers: `lib/supabase/server.ts` using `@supabase/auth-helpers-nextjs`

## Testing & Linting

- Lint: `npm run lint`
- You can introduce your preferred test runner (Vitest/Jest) if needed; none is configured yet.

## Deployment

- Vercel is recommended for Next.js deployment.
- Ensure environment variables are configured in your hosting platform.
- Replace any hardcoded Supabase credentials with environment variables before deploying.

## Troubleshooting

- Auth not persisting: ensure cookies are enabled and `@supabase/auth-helpers-nextjs` is set up in server components/route handlers.
- 401/403 from Supabase: verify the anon key and RLS policies in your tables.
- Images not loading from Supabase Storage: confirm `images.domains` in `next.config.ts` includes your Supabase domain.
- Type errors after upgrades: run `npm install` to refresh types and check `tsconfig.json` path aliases.

## Contributing

1. Fork and create a feature branch
2. Keep changes focused; add tests where appropriate
3. Run `npm run lint` and ensure a clean build
4. Open a PR with a clear description and screenshots (if UI changes)

## Security

Do not commit secrets. Use environment variables for all keys and rotate credentials if any key is exposed.

## License

This project’s license has not been specified. If you plan to open source it, consider adding a license (e.g., MIT) at the repository root.
  