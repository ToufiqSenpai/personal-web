<div align="center">

# My Personal Portfolio Web

![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js)
![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.85-000?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47a248?style=flat-square&logo=mongodb&logoColor=white)

[Features](#features) • [Getting Started](#getting-started) • [Development](#development) • [Testing](#testing) • [Deployment](#deployment)

</div>

A portfolio, blog, and personal branding platform built as a single Next.js application with Payload CMS embedded. Content is managed through a built-in admin panel, the frontend is server-rendered with React 19, and multi-language support is baked in for English, Indonesian, and Japanese.

## Features

- **Portfolio & Projects** — Grid gallery with filtering, search, and detailed project pages
- **Feeds** — Timeline-style personal posts with rich text and media embeds
- **About** — Story-driven narrative with skills, tech stack, and career timeline
- **Contact** — Form with social links and availability status, submissions stored in CMS
- **Dark/Light Mode** — Dark-first design with theme toggle
- **i18n** — Multi-language support (en, id, ja) via `next-intl`
- **CMS Admin Panel** — Full content management at `/admin`
- **Responsive** — Mobile-first with subtle scroll animations

## Tech Stack

| Layer     | Technology                                         |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)                 |
| CMS       | Payload CMS 3.85 (embedded, admin at `/admin`)     |
| Database  | MongoDB (Atlas or local)                           |
| Language  | TypeScript 5.7 (strict mode)                       |
| Styling   | Tailwind CSS v4 + `@tailwindcss/typography`        |
| Fonts     | Geist Sans + Geist Mono                            |
| i18n      | `next-intl` v4                                     |
| Theme     | `next-themes` (class-based, dark default)          |
| Media     | S3-compatible storage via `@payloadcms/storage-s3` |
| Rich Text | Lexical editor                                     |
| Testing   | Vitest + Playwright                                |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `^18.20.2` or `>=20.9.0`
- A running MongoDB instance (local, Docker, or [Atlas](https://www.mongodb.com/atlas))
- S3-compatible storage for media uploads

### Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd personal-web
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in all required values — see the table below.

3. **Install dependencies and start**
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS panel.

> [!TIP]
> Run `npm run devsafe` instead of `npm run dev` to clear the `.next` cache before starting — useful when things get stale.

### Environment Variables

All variables are validated at startup via Zod. The app will not start if any required value is missing.

| Variable               | Description                            |
| ---------------------- | -------------------------------------- |
| `DATABASE_URL`         | MongoDB connection string              |
| `PAYLOAD_SECRET`       | Secret key for Payload CMS             |
| `S3_BUCKET`            | S3 bucket name                         |
| `S3_ACCESS_KEY_ID`     | S3 access key                          |
| `S3_SECRET_ACCESS_KEY` | S3 secret key                          |
| `S3_REGION`            | S3 region (defaults to `auto`)         |
| `S3_ENDPOINT`          | S3 endpoint URL                        |
| `NODE_ENV`             | `development`, `production`, or `test` |

### Docker (Optional)

Spin up MongoDB alongside the app with Docker Compose:

```bash
docker-compose up -d
```

> [!NOTE]
> Set `DATABASE_URL=mongodb://mongo/<dbname>` in your `.env` when using Docker Compose.

## Development

| Command                      | Description                                |
| ---------------------------- | ------------------------------------------ |
| `npm run dev`                | Start dev server with Turbopack            |
| `npm run devsafe`            | Clear `.next` cache, then start dev server |
| `npm run lint`               | Run ESLint                                 |
| `npm run generate:types`     | Regenerate Payload CMS types               |
| `npm run generate:importmap` | Regenerate Payload import map              |

> [!IMPORTANT]
> After modifying any Payload collection, always run `npm run generate:types` to keep `src/payload-types.ts` in sync. Never edit this file manually.

### Project Structure

```
src/
├── app/
│   ├── (payload)/        # CMS admin panel routes
│   └── [locale]/         # Public frontend (locale-based routing)
├── collections/          # Payload CMS collection configs
├── components/           # React components by feature
├── configs/              # Environment config (Zod-validated)
├── i18n/                 # Language definitions & translations
├── payload.config.ts     # Main Payload CMS configuration
└── proxy.ts              # next-intl middleware
```

### Design System

The project uses a dark-first design with a **zinc + violet** color palette, defined as CSS `@theme` tokens:

- **Fonts**: Geist Mono for display/hero elements, Geist Sans for body text
- **Animations**: `fade-in-up` on page load, scroll-reveal via `IntersectionObserver`, card hover lifts — all respect `prefers-reduced-motion`
- **Layout**: `max-w-6xl` containers, sticky blurred navbar, `rounded-xl` card pattern with hover accent borders

## Testing

```bash
# Run all tests (integration + e2e)
npm test

# Integration tests only (Vitest)
npm run test:int

# E2E tests only (Playwright)
npm run test:e2e
```

- **Integration tests**: `tests/int/**/*.int.spec.ts` — Vitest with jsdom
- **E2E tests**: `tests/e2e/**/*.e2e.spec.ts` — Playwright (Chromium)

## Deployment

### Build for production

```bash
npm run build
npm start
```

### Docker

The included `Dockerfile` uses a multi-stage build (deps → builder → runner) producing a minimal Node.js 22 Alpine image.

> [!NOTE]
> Docker production builds require `output: 'standalone'` in `next.config.ts`.

### Planned Architecture

The project is evolving toward subdomain-based routing:

```
example.com              → Main site (projects, about, contact, feeds)
articles.example.com     → Articles zone (separate layout, SEO-optimized)
```

The main site will use `noindex, nofollow` while the articles zone will be fully SEO-optimized with meta tags, OG images, and auto-generated sitemaps.
