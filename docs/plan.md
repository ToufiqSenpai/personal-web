# Personal Web — Design Document

## Overview

All-in-one personal branding website untuk Software Developer & AI enthusiast. Website ini menggabungkan personal branding, portfolio showcase, dan blog/artikel dalam satu platform yang clean dan story-driven.

**Tujuan:** Membangun online presence profesional yang menampilkan perjalanan, karya, dan pemikiran dalam satu tempat.

**Target audience:** Recruiters, potential collaborators, fellow developers, dan anyone yang tertarik dengan profil profesional.

---

## Arsitektur

**Pendekatan:** Payload CMS 3.x Embedded dalam Next.js Single App

- Satu Next.js app, satu deployment ke Vercel
- Payload Local API untuk data fetching tanpa HTTP overhead
- Subdomain routing via Next.js middleware
- Static generation (ISR) untuk konten yang sering berubah
- Static untuk halaman statis (about, contact, homepage)

**Subdomain Structure:**
```
example.com            → Main site (projects, about, contact)
articles.example.com   → Articles subdomain (same app, different layout)
```

**Database:** MongoDB Atlas (free tier)

---

## Page Structure

### Main Site (`example.com`)
```
/[locale]              → Homepage
/[locale]/about        → About Me + Skills
/[locale]/projects     → Projects gallery
/[locale]/projects/[slug] → Project detail
/[locale]/feeds        → Feeds timeline
/[locale]/contact      → Contact form + social links
/admin                 → Payload CMS admin panel (protected)
```

**i18n:** Menggunakan `next-intl` dengan locale prefix di URL (e.g. `/en`, `/id`). Default locale: `en`.

### Articles Zone (`articles.example.com`)
```
/                  → Articles list
/[slug]            → Article detail
```

**Routing:** Middleware mendeteksi subdomain dan me-render layout yang sesuai. CMS admin tetap di `example.com/admin`.

---

## Features

### Homepage (`/`)

1. **Hero section** — Nama, tagline, pengenalan singkat
2. **Featured projects** — 3-4 projek terbaru/highlighted dalam grid layout
3. **Featured articles** — 2-3 artikel terbaru dengan excerpt
4. **Tech stack** — Quick badges atau stats section
5. **CTA section** — Ajakan untuk explore projects, baca articles, atau hubungi

### Projects (`/projects`)

- Grid layout dengan thumbnail, title, tech stack badges
- Filter by category (Web App, AI/ML, Tool, dll)
- Search by keyword
- Detail page (`/projects/[slug]`): full content, gallery, link demo/repo

### Articles (`articles.example.com`)

- List layout dengan excerpt, category tag, tanggal publish
- Filter by category & tags
- Search by keyword
- Detail page: rich text, code blocks, images
- Subdomain terpisah, tapi single app yang sama dengan main site

### About (`/about`)

- Story-driven narrative (perjalanan, motivasi, goals)
- Skills dengan visual proficiency indicator
- Tech stack showcase
- Download CV button (optional)

### Contact (`/contact`)

- Contact form (name, email, subject, message)
- Social media links (GitHub, LinkedIn, Twitter/X)
- Availability status (open to work / freelance / not available)
- Form submissions tersimpan di Payload CMS

### Feeds (`/feeds`)

- Timeline-style list dari postingan pribadi
- Setiap post: title, rich body (support HTML embed untuk video, musik, dll), timestamp
- Infinite scroll atau load more

### Global Features

- **Responsive** — Mobile-first design
- **Dark/light mode** — Toggle tema
- **i18n** — Multi-language support (en, id) via `next-intl`
- **SEO** — Meta tags, OG images, sitemap, robots.txt
  - **Main site (`example.com`):** `noindex, nofollow` — tidak diindeks oleh search engine dan AI search engine
  - **Articles zone (`articles.example.com`):** Normal indexing, SEO optimized
- **Performance** — Static generation, image optimization, minimal JS
- **Admin panel** — Payload CMS di `/admin` untuk manage semua konten

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| CMS | Payload CMS 3.x (embedded) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config, `@theme` tokens) |
| Fonts | Geist Sans + Geist Mono (`geist` package) |
| Dark Mode | `next-themes` (`class` strategy, default dark) |
| UI Components | Custom components (no component library) |
| i18n | next-intl (planned) |
| Database | MongoDB Atlas |
| Deployment | Vercel |
| Image | next/image |
| Sitemap | next-sitemap (planned) |
| GitHub | GitHub API (client-side, planned) |
| Email | Resend / Nodemailer (optional, planned) |

---

## Visual Design & Tone

### Style
- Minimalis clean dengan white space yang cukup
- Typography-focused — konten yang berbicara
- Animasi subtle (fade-in, smooth scroll, scroll-reveal)
- Warna: neutral base (zinc) dengan violet accent

### Color System

Dark-first design dengan token CSS yang switch berdasarkan class `.dark` di `<html>`.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `canvas` | `#FAFAFA` | `#09090B` | Page background |
| `surface` | `#FFFFFF` | `#18181B` | Cards, form inputs, navbar |
| `ink` | `#18181B` | `#FAFAFA` | Primary text |
| `muted` | `#71717A` | `#A1A1AA` | Secondary text, labels |
| `accent` | `#7C3AED` | `#8B5CF6` | Links, buttons, highlights, focus ring |
| `accent-soft` | `#EDE9FE` | `#1E1B30` | CTA background, category badges |
| `border` | `#E4E4E7` | `#27272A` | Card borders, dividers, input borders |

Tokens didefinisikan di `src/app/(frontend)/styles.css` sebagai `@theme` variables dan auto-generate utility classes Tailwind (e.g., `bg-canvas`, `text-ink`, `border-border`).

### Typography

| Role | Font | Usage |
|------|------|-------|
| Display / Mono | **Geist Mono** | Hero headline, section eyebrows (`$ whoami`, `# cat about.md`), tech badges, field labels, nav logo |
| Body | **Geist Sans** | All body text, headings (non-hero), buttons, navigation links |

Type scale: hero `text-6xl` → section titles `text-3xl` → body `text-base` → labels/captions `text-xs`.

Fonts loaded via `geist` package dengan `variable` strategy di `layout.tsx` (`GeistSans.variable` + `GeistMono.variable`).

### Layout

- **Container:** `max-w-6xl mx-auto px-6` untuk section utama, `max-w-2xl` untuk long-form prose (About story)
- **Navbar:** Sticky `top-0`, `backdrop-blur-md`, `bg-canvas/80`, border-bottom. Active link berwarna accent.
- **Card pattern:** `rounded-xl border border-border bg-surface p-6`, hover `border-accent` + `-translate-y-1` lift
- **Section rhythm:** `py-20` antar section, `mb-12` antara heading dan content
- **Eyebrow pattern:** `font-mono text-xs uppercase tracking-wider text-accent` sebelum setiap section heading

### Animations

| Animation | Trigger | Implementation |
|-----------|---------|----------------|
| `fade-in-up` | Page load (Hero) | CSS keyframes, `0.6s ease-out both` |
| Scroll reveal | Scroll into view | `IntersectionObserver` via `Reveal` component, `opacity` + `translateY` transition |
| Card hover | Mouse hover | `transition-all` + `hover:-translate-y-1` + `hover:border-accent` |
| Cursor blink | Continuous | `animate-pulse` pada hero cursor element |

Semua animasi respect `prefers-reduced-motion: reduce` — duration di-set ke `0.01ms`, reveal langsung visible.

### Dark Mode

- **Library:** `next-themes` dengan `attribute="class"` strategy
- **Default:** Dark mode (`defaultTheme="dark"`, `enableSystem={false}`)
- **Toggle:** Sun/moon icon button di navbar, client component dengan mounted guard untuk avoid hydration mismatch
- **No flash:** `suppressHydrationWarning` di `<html>`, theme applied before paint

### Tone
- Profesional tapi approachable
- Story-driven — show the journey, bukan hanya resume
- Developer-friendly — code snippets, tech details, terminal aesthetic

---

## Data Model (Payload CMS Collections)

### `projects`
- `title`, `slug`, `description`, `content` (rich text)
- `techStack` (array)
- `thumbnail`, `gallery` (images)
- `demoUrl`, `repoUrl`
- `category`, `featured`, `publishedAt`, `status`

### `categories`
- `name`, `slug`, `description`

### `profile` (singleton)
- `name`, `title`, `bio`, `avatar`
- `skills`, `techStack`
- `socialLinks`, `email`, `availabilityStatus`

### `contactMessages`
- `name`, `email`, `subject`, `message`, `readAt`

### `feeds`
- `title` (text)
- `body` (rich text dengan HTML embed support — video, musik, iframe, dll)
- `createdAt` (timestamp, auto-generated)

---

## Non-Functional Requirements

- **Performance:** Lighthouse score > 90 untuk semua metrics
- **SEO:** 
  - Main site: `noindex, nofollow` — tidak diindeks search engine dan AI search engine
  - Articles zone: SEO optimized, proper meta tags, OG images, sitemap auto-generated
- **Accessibility:** WCAG 2.1 AA compliance
- **Security:** Admin panel protected dengan authentication, CSRF protection
- **Maintainability:** Clean code structure, TypeScript strict mode
