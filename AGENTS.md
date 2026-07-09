# AGENTS.md

> **⚠️ DO NOT BUILD THE PROJECT unless the user explicitly asks for it.** Do not run `npm run build` or any production build commands on your own.

## Project Overview

Personal portfolio/website built with **Next.js 16** (App Router) and **Payload CMS 3.85** as a headless CMS, backed by **MongoDB**. The site supports **i18n** (English, Indonesian, Japanese) via `next-intl`, uses **Tailwind CSS v4** for styling, **Geist** font family (sans + mono), and **S3-compatible storage** for media uploads. The frontend is server-rendered with React 19 Server Components.

**Purpose:** All-in-one personal branding platform combining portfolio showcase, blog/articles, and feeds in a single story-driven website.

**Target audience:** Recruiters, potential collaborators, fellow developers.

### Key Technologies

| Layer            | Technology                                         |
| ---------------- | -------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack)                 |
| CMS              | Payload CMS 3.85 (admin at `/admin`)               |
| Database         | MongoDB via `@payloadcms/db-mongodb` (Mongoose)    |
| Language         | TypeScript 5.7 (strict mode)                       |
| Styling          | Tailwind CSS v4 + `@tailwindcss/typography`        |
| Fonts            | Geist Sans / Geist Mono (`geist` package)          |
| i18n             | `next-intl` v4 — locales: `en`, `id`, `ja`         |
| Theme            | `next-themes` (dark mode default, class-based)     |
| Media Storage    | S3-compatible via `@payloadcms/storage-s3`         |
| Rich Text        | Lexical editor (`@payloadcms/richtext-lexical`)    |
| Image Processing | `sharp`                                            |
| Testing          | Vitest (integration) + Playwright (e2e)            |
| Linting          | ESLint 9 (flat config, `next/core-web-vitals`)     |
| Formatting       | Prettier (single quotes, no semicolons, 120 width) |
| Package Mgr      | npm                                                |
| Containerization | Docker + Docker Compose                            |

## Architecture

```
src/
├── app/
│   ├── (payload)/          # Payload CMS admin panel routes (layout, admin, api)
│   └── [locale]/           # Public frontend (locale-based routing)
│       ├── layout.tsx      # Root layout — ThemeProvider, Navbar, Footer, NextIntlClientProvider
│       ├── page.tsx        # Home page (Hero, HomeAbout, FeaturedProjects, FeaturedArticles, CTA)
│       ├── about/          # About page route
│       ├── contact/        # Contact page route
│       ├── feeds/          # Feeds/blog page route
│       ├── [...rest]/      # Catch-all for unmatched routes
│       └── styles.css      # Global styles
├── collections/            # Payload CMS collection configs
│   ├── Users.ts            # Auth-enabled users collection
│   ├── Profile.ts          # Profile global + avatar/icons/hobbies media collections
│   └── Feeds.ts            # Feeds collection + feeds media
├── components/
│   ├── about/              # AboutHero, BentoHobbies, CurrentFocus, Story, Timeline
│   ├── contact/            # ContactForm, ContactHeader, ContactInfo
│   ├── feeds/              # FeedCard, FeedList
│   ├── home/               # Hero, HomeAbout, FeaturedProjects, FeaturedArticles, CTA
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # Reveal, ThemeProvider, ThemeToggle
├── configs/
│   └── env.ts              # Zod-validated environment variables
├── constants/
│   └── mimetype.ts         # MIME type constants
├── data/
│   └── mock.ts             # Mock data for testing/dev
├── i18n/
│   ├── language.ts         # Language definitions (en, id, ja)
│   ├── routing.ts          # next-intl routing config (localePrefix: 'never')
│   ├── request.ts          # Server-side locale request handler
│   └── languages/          # Translation JSON files (en.json, id.json, ja.json)
├── payload.config.ts       # Main Payload CMS configuration
├── payload-types.ts        # Auto-generated Payload types (DO NOT EDIT)
└── proxy.ts                # next-intl middleware config
```

### Payload CMS Collections & Globals

- **Collections**: `Users`, `ProfileAvatar`, `ProfileIcons`, `HobbiesMedia`, `Feeds`, `FeedsMedia`
- **Globals**: `Profile` (single global for personal profile data)
- **Media collections** use S3 storage plugin for `profile-avatar`, `profile-icons`, `feeds-media`, `hobbies-media`
- Localization is enabled in Payload for `en`, `id`, `ja` with `en` as fallback

### Routing

- **Payload admin**: `/admin` and `/api` (excluded from i18n middleware)
- **Frontend**: `[locale]/` routes — locale prefix is set to `'never'` (URL never shows locale prefix)
- **Middleware** (`src/proxy.ts`): Applies `next-intl` middleware to all routes except `/admin`, `/api`, `/_next`, `/_vercel`, and static files

**Planned subdomain structure:**

```
example.com              → Main site (projects, about, contact, feeds)
articles.example.com     → Articles zone (same app, different layout)
```

### Planned Page Structure

```
/[locale]                  → Homepage (Hero, Featured Projects, Featured Articles, CTA)
/[locale]/about            → About Me (story-driven narrative, skills, timeline)
/[locale]/projects         → Projects gallery (grid, filter by category, search)
/[locale]/projects/[slug]  → Project detail (content, gallery, demo/repo links)
/[locale]/feeds            → Feeds timeline (personal posts, rich text, media embeds)
/[locale]/contact          → Contact form + social links + availability status
/admin                     → Payload CMS admin panel (protected)
```

Articles zone (`articles.example.com`):

```
/                          → Articles list (filter by category & tags, search)
/[slug]                    → Article detail (rich text, code blocks, images)
```

## Visual Design & Tone

### Style

- Minimalist clean with generous white space
- Typography-focused — content speaks for itself
- Subtle animations (fade-in, smooth scroll, scroll-reveal)
- Dark-first design with neutral base (zinc) + violet accent

### Color System

Dark-first design with CSS `@theme` tokens that switch via `.dark` class on `<html>`.

| Token         | Light     | Dark      | Usage                                  |
| ------------- | --------- | --------- | -------------------------------------- |
| `canvas`      | `#FAFAFA` | `#09090B` | Page background                        |
| `surface`     | `#FFFFFF` | `#18181B` | Cards, form inputs, navbar             |
| `ink`         | `#18181B` | `#FAFAFA` | Primary text                           |
| `muted`       | `#71717A` | `#A1A1AA` | Secondary text, labels                 |
| `accent`      | `#7C3AED` | `#8B5CF6` | Links, buttons, highlights, focus ring |
| `accent-soft` | `#EDE9FE` | `#1E1B30` | CTA background, category badges        |
| `border`      | `#E4E4E7` | `#27272A` | Card borders, dividers, input borders  |

Tokens are defined in `src/app/[locale]/styles.css` as `@theme` variables generating Tailwind utilities (e.g., `bg-canvas`, `text-ink`, `border-border`).

### Typography

| Role           | Font           | Usage                                                                                               |
| -------------- | -------------- | --------------------------------------------------------------------------------------------------- |
| Display / Mono | **Geist Mono** | Hero headline, section eyebrows (`$ whoami`, `# cat about.md`), tech badges, field labels, nav logo |
| Body           | **Geist Sans** | All body text, headings (non-hero), buttons, navigation links                                       |

Type scale: hero `text-6xl` → section titles `text-3xl` → body `text-base` → labels/captions `text-xs`.

Fonts loaded via `geist` package with `variable` strategy in `layout.tsx`.

### Layout Patterns

- **Container**: `max-w-6xl mx-auto px-6` for main sections, `max-w-2xl` for long-form prose
- **Navbar**: Sticky `top-0`, `backdrop-blur-md`, `bg-canvas/80`, border-bottom
- **Card pattern**: `rounded-xl border border-border bg-surface p-6`, hover `border-accent` + `-translate-y-1` lift
- **Section rhythm**: `py-20` between sections, `mb-12` between heading and content
- **Eyebrow pattern**: `font-mono text-xs uppercase tracking-wider text-accent` before section headings

### Animations

| Animation     | Trigger          | Implementation                                                    |
| ------------- | ---------------- | ----------------------------------------------------------------- |
| `fade-in-up`  | Page load (Hero) | CSS keyframes, `0.6s ease-out both`                               |
| Scroll reveal | Scroll into view | `IntersectionObserver` via `Reveal` component                     |
| Card hover    | Mouse hover      | `transition-all` + `hover:-translate-y-1` + `hover:border-accent` |
| Cursor blink  | Continuous       | `animate-pulse` on hero cursor element                            |

All animations respect `prefers-reduced-motion: reduce`.

### Tone

- Professional but approachable
- Story-driven — show the journey, not just a resume
- Developer-friendly — code snippets, tech details, terminal aesthetic

## Data Model (Payload CMS)

### Current Collections & Globals

- **Collections**: `Users`, `ProfileAvatar`, `ProfileIcons`, `HobbiesMedia`, `Feeds`, `FeedsMedia`
- **Globals**: `Profile` (singleton for personal profile data)

### Planned Collections

#### `projects`

- `title`, `slug`, `description`, `content` (rich text)
- `techStack` (array), `thumbnail`, `gallery` (images)
- `demoUrl`, `repoUrl`, `category`, `featured`, `publishedAt`, `status`

#### `categories`

- `name`, `slug`, `description`

#### `contactMessages`

- `name`, `email`, `subject`, `message`, `readAt`

#### `feeds` (existing, evolving)

- `title` (text), `body` (rich text with HTML embed support), `createdAt` (auto-generated)

### Profile Global (existing)

- `name`, `title`, `bio`, `avatar`, `skills`, `techStack`, `socialLinks`, `email`, `availabilityStatus`

## Setup Commands

### Prerequisites

- Node.js `^18.20.2` or `>=20.9.0`
- npm (ships with Node.js)
- MongoDB instance (local or remote)
- S3-compatible storage (for media uploads)

### Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

**Required variables** (validated by Zod at runtime in `src/configs/env.ts`):

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

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Clean start (removes .next cache first)
npm run devsafe
```

### Docker (Optional)

```bash
# Start MongoDB + app in Docker
docker-compose up

# Run in background
docker-compose up -d
```

Set `DATABASE_URL=mongodb://mongo/<dbname>` in `.env` when using Docker Compose.

## Development Workflow

- **Dev server**: `npm run dev` — starts Next.js with `--no-deprecation` flag via `cross-env`
- **Clean dev**: `npm run devsafe` — removes `.next` cache then starts dev
- **Hot reload**: Turbopack is configured in `next.config.ts`; changes in `src/` reflect instantly
- **Payload Admin Panel**: Visit `http://localhost:3000/admin` to manage content
- **Generate types**: `npm run generate:types` — regenerates `src/payload-types.ts` from Payload collections
- **Generate import map**: `npm run generate:importmap` — regenerates Payload import maps

### Important Notes

- `src/payload-types.ts` is **auto-generated** — never edit this file manually. Run `npm run generate:types` after modifying collections.
- The `cross-env` package is used for all scripts to ensure cross-platform compatibility.
- The project uses ESM (`"type": "module"` in `package.json`).

## Testing Instructions

### Integration Tests (Vitest)

```bash
# Run all integration tests
npm run test:int
```

- **Config**: `vitest.config.mts`
- **Setup**: `vitest.setup.ts` (loads `dotenv/config`)
- **Environment**: `jsdom`
- **Test files**: `tests/int/**/*.int.spec.ts`
- **Plugins**: `@vitejs/plugin-react`, `vite-tsconfig-paths` (path aliases work in tests)

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e
```

- **Config**: `playwright.config.ts`
- **Test files**: `tests/e2e/` directory
- **Browser**: Chromium only
- **Dev server**: Automatically starts via `npm run dev` on `http://localhost:3000` (reuses if running)
- **Traces**: Collected on first retry
- **Reporter**: HTML report

### Run All Tests

```bash
npm test
```

This runs integration tests first, then e2e tests sequentially.

### Test Directory Structure

```
tests/
├── e2e/
│   ├── admin.e2e.spec.ts       # Payload admin panel tests
│   └── frontend.e2e.spec.ts    # Frontend page tests
├── helpers/
│   ├── login.ts                # Login helper utility
│   └── seedUser.ts             # User seeding utility
└── int/
    └── api.int.spec.ts         # API integration tests
```

### Test File Naming Conventions

- Integration tests: `*.int.spec.ts`
- E2E tests: `*.e2e.spec.ts`
- Test helpers go in `tests/helpers/`
- Mock data lives in `src/data/mock.ts`

## Code Style

### Formatting (Prettier)

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "semi": false
}
```

- Single quotes everywhere
- **No semicolons**
- Trailing commas in all contexts
- 120 character line width

### Linting (ESLint 9 — Flat Config)

```bash
npm run lint
```

- Extends: `next/core-web-vitals`, `next/typescript`
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: warn (ignores `_` prefixed vars/args)
- `@typescript-eslint/ban-ts-comment`: warn
- Ignored paths: `.next/`, `src/payload-types.ts`, `src/payload-generated-schema.ts`

### TypeScript

- **Strict mode** enabled
- Path aliases: `@/*` → `./src/*`, `@payload-config` → `./src/payload.config.ts`
- Target: ES2022
- Module resolution: `bundler`
- JSX: `react-jsx`

### File & Code Conventions

- **Components**: PascalCase filenames, one component per file (e.g., `Hero.tsx`)
- **Collections**: PascalCase filenames in `src/collections/` (e.g., `Profile.ts`)
- **Config files**: camelCase (e.g., `env.ts`, `routing.ts`)
- **Translation files**: Locale code as filename (e.g., `en.json`, `id.json`, `ja.json`)
- **Imports**: Use `@/` path alias for `src/` imports; use `@payload-config` for Payload config
- **React**: Prefer React Server Components; use `'use client'` directive only when needed
- **Async components**: Page and layout components can be `async` (server-side data fetching with Payload)

## Internationalization (i18n)

### Adding a New Locale

1. Add the locale to the `LANGUAGES` array in `src/i18n/language.ts`
2. Create a new translation file in `src/i18n/languages/<code>.json`
3. The Payload localization config in `src/payload.config.ts` automatically picks up changes from `LANGUAGES`

### Translation Workflow

- UI strings are in `src/i18n/languages/*.json`
- Content translations are managed through Payload CMS locale support
- The locale prefix is set to `'never'` — URLs do not include locale prefixes
- Default locale: `en`

## Build and Deployment

### Build for Production

```bash
npm run build
```

- Uses `cross-env NODE_OPTIONS="--no-deprecation --max-old-space-size=8000"` for builds
- Output: `.next/` directory

### Start Production Server

```bash
npm start
```

### Docker Production Build

The `Dockerfile` uses a multi-stage build:

1. **deps** — installs dependencies (auto-detects pnpm/npm/yarn)
2. **builder** — builds the Next.js app
3. **runner** — minimal production image with standalone output

> **Note**: Requires `output: 'standalone'` in `next.config.ts` for Docker production builds.

### Production Environment

- Node.js 22 (Alpine) in Docker
- Runs as non-root user `nextjs`
- Exposes port 3000
- Planned deployment target: **Vercel**

### SEO Strategy

- Public-facing pages should expose clean, accurate metadata and Open Graph tags for search snippets and link sharing.
- Apply indexation rules intentionally in app configuration rather than assuming the main site is always `noindex, nofollow`.
- Articles or other editorial surfaces can adopt deeper SEO features such as richer meta tags, OG images, and sitemaps when needed.

## Non-Functional Requirements

- **Performance**: Lighthouse score > 90 for all metrics; static generation (ISR) for frequently changing content
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Admin panel protected with authentication, CSRF protection, env vars validated at startup
- **Maintainability**: TypeScript strict mode, clean code structure, conventional commits

## Pull Request Guidelines

### Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Before Submitting

1. Run `npm run lint` and fix all errors
2. Run `npm test` (both integration and e2e)
3. Run `npm run generate:types` if you modified any Payload collections
4. Ensure no type errors: TypeScript strict mode must pass

## Security Considerations

- **Environment variables** are validated at startup via Zod (`src/configs/env.ts`); the app will fail to start if required values are missing
- **`.env` is gitignored** — never commit secrets
- **S3 credentials** are only used server-side in the Payload config
- **Payload admin** is behind auth (`Users` collection with authentication enabled)
- **Middleware** excludes `/admin` and `/api` routes from i18n processing to avoid interfering with Payload's own routing

## Debugging & Troubleshooting

### Common Issues

| Problem                     | Solution                                                  |
| --------------------------- | --------------------------------------------------------- |
| `payload-types.ts` is stale | Run `npm run generate:types`                              |
| `.next` cache issues        | Run `npm run devsafe` to clear cache and restart          |
| MongoDB connection failed   | Check `DATABASE_URL` in `.env`; ensure MongoDB is running |
| S3 upload errors            | Verify all `S3_*` env vars; check bucket permissions      |
| Import map errors           | Run `npm run generate:importmap`                          |
| Deprecation warnings        | Already suppressed via `--no-deprecation` flag            |

### Key Generated Files (Do Not Edit)

- `src/payload-types.ts` — generated by `npm run generate:types`
- `src/payload-generated-schema.ts` — generated by Payload
- `.next/` — build output
