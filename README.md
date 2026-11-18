<div align="center">

# My Personal Portfolio Web

![TanStack Start](https://img.shields.io/badge/TanStack_Start-000?style=flat-square&logo=react)
![Payload CMS](https://img.shields.io/badge/Payload_CMS-4.0-000?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6?style=flat-square&logo=typescript&logoColor=white)
![StyleX](https://img.shields.io/badge/StyleX-000?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169e1?style=flat-square&logo=postgresql&logoColor=white)

[Features](#features) • [Getting Started](#getting-started) • [Development](#development) • [Deployment](#deployment)

</div>

A portfolio, blog, and personal branding platform built as a single TanStack Start application with Payload CMS embedded. Content is managed through a built-in admin panel, the frontend is server-rendered with React 19, and multi-language support is baked in for English, Indonesian, and Japanese.

## Features

- **Portfolio & Projects** — Grid gallery of projects with tech stack tags and demo/repo links
- **Feeds** — Timeline-style personal posts with rich text and media embeds
- **About** — Story-driven narrative with skills, tech stack, and career timeline
- **Contact** — Form with Cloudflare Turnstile, submissions stored in the CMS
- **Dark/Light Mode** — Dark-first design with theme toggle
- **i18n** — Multi-language support (en, id, ja) via Paraglide, prefixed URLs (`/en`, `/id`, `/ja`)
- **CMS Admin Panel** — Full content management at `/admin`
- **Media Library** — Single `media` collection with folder tree and tags, auto-converted to AVIF
- **Responsive** — Mobile-first with subtle scroll animations

## Tech Stack

| Layer       | Technology                                         |
| ----------- | -------------------------------------------------- |
| Framework   | TanStack Start (Vite 8, RSC)                       |
| CMS         | Payload CMS 4.0 (embedded, admin at `/admin`)      |
| Database    | PostgreSQL via `@payloadcms/db-postgres`           |
| Language    | TypeScript 7.0 (strict mode)                       |
| Styling     | StyleX + hand-written CSS tokens                   |
| Fonts       | Geist Sans + Geist Mono (Fontsource)               |
| i18n        | Paraglide JS 3                                     |
| Theme       | `class` based dark mode, no-flash inline script    |
| Media       | S3-compatible storage via `@payloadcms/storage-s3` |
| Rich Text   | Lexical editor                                     |
| Lint/Format | oxlint (type-aware) + oxfmt                        |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `^24.22.3` or `>=26.13.1`
- A running PostgreSQL instance (local or [Neon](https://neon.tech))
- S3-compatible storage for media uploads

### Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd personal-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in `DATABASE_URL` (PostgreSQL), `PAYLOAD_SECRET`, the `S3_*` values, `GITHUB_PAT`, the Resend values, and the Turnstile keys. All variables are validated at startup by Zod in `src/configs/env.ts`.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The site runs at `http://localhost:3000`, the CMS admin at `http://localhost:3000/admin`.

## Development

| Command                      | Description                               |
| ---------------------------- | ----------------------------------------- |
| `npm run dev`                | Start the dev server                      |
| `npm run devsafe`            | Clear `dist` and start the dev server     |
| `npm run build`              | Production build                          |
| `npm start`                  | Run the production build                  |
| `npm run lint`               | Run oxlint                                |
| `npm run typecheck`          | Run `tsc --noEmit`                        |
| `npm run format`             | Format with oxfmt                         |
| `npm run paraglide`          | Regenerate Paraglide messages             |
| `npm run generate:types`     | Regenerate Payload types                  |
| `npm run generate:importmap` | Regenerate the Payload admin import map   |
| `npm run migrate`            | Apply database migrations                 |
| `npm run migrate:create`     | Generate a migration from the schema diff |
| `npm run migrate:status`     | Show applied and pending migrations       |

### Project layout

```
src/
├── app/                 # TanStack Router routes
│   ├── __root.tsx       # Document shell, theme script
│   ├── _frontend.tsx    # Public layout (navbar, footer, profile context)
│   ├── _frontend/       # index, about, projects, feeds, contact, catch-all
│   └── _payload/        # Payload admin + REST API routes
├── collections/         # Payload collections
├── components/          # UI, grouped by page area
├── configs/             # Zod-validated env
├── data/queries.ts      # Server functions wrapping the Payload local API
├── lib/                 # SEO helpers, Turnstile verification
├── migrations/          # Reviewed database migrations (applied by `npm run migrate`)
├── paraglide/           # Generated i18n runtime (do not edit)
├── payload.config.ts    # Payload configuration
└── start.ts             # TanStack Start instance
```

### Routing

- `/en`, `/id`, `/ja` prefix every public route. With the default locale the prefix is still required (`/en/about`).
- `/admin` and `/api` are not localized and are served by Payload.
- Locale URLs are handled by Paraglide URL patterns declared in `paraglide.config.mjs`; TanStack Router rewrites them to the internal route tree.

### Media

All uploads go through one `media` collection: `alt` (localized) and `caption` fields, a folder tree (`folders` collection, `folders: true`) and tags (`tags` collection, `tags: true`). Uploaded raster images are converted to AVIF at quality 80 with their original dimensions — no resizing variants — and SVGs are stored untouched. Files live in S3-compatible storage; `generateFileURL` builds the CDN URL.

### Database

Schema changes ship as committed migrations in `src/migrations`. The Postgres adapter runs with `push: false`, so neither development nor production alters the schema implicitly:

```bash
npm run migrate:create -- <name>   # generate a migration from the current diff
npm run migrate                    # apply pending migrations
```

Document ids are UUIDv7 (`idType: 'uuidv7'`): sortable by creation time and generated in the app, so raw SQL inserts must supply `id` themselves.

### Known issues

- **Windows: `npm run build` may fail with `EPERM ... rename dist/server/rsc → node_modules/.vite-rsc-temp/rsc`.** `@vitejs/plugin-rsc` moves the RSC output between build steps, and antivirus real-time scanning keeps a transient handle on the freshly written directory. Re-running the build succeeds; adding the project folder to Windows Defender exclusions prevents it.

## Deployment

1. Set `output` env vars and `DATABASE_URL` for the target environment.
2. Run `npm run migrate` against the production database before starting the app (or in CI).
3. Run `npm run build`, then `npm start` (served by `srvx`).
