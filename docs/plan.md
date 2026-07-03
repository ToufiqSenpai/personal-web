# Personal Web — Design Document

## Overview

All-in-one personal branding website untuk Software Developer & AI enthusiast. Website ini menggabungkan personal branding, portfolio showcase, dan blog/artikel dalam satu platform yang clean dan story-driven.

**Tujuan:** Membangun online presence profesional yang menampilkan perjalanan, karya, dan pemikiran dalam satu tempat.

**Target audience:** Recruiters, potential collaborators, fellow developers, dan anyone yang tertarik dengan profil profesional.

---

## Arsitektur

**Pendekatan:** Payload CMS 3.x Embedded dalam Next.js

- Single codebase, single deployment ke Vercel
- Payload Local API untuk data fetching tanpa HTTP overhead
- Static generation (ISR) untuk konten yang sering berubah
- Static untuk halaman statis (about, contact, homepage)

**Database:** MongoDB Atlas (free tier) atau PostgreSQL (Neon free tier)

---

## Page Structure

```
/                  → Homepage
/about             → About Me + Skills
/projects          → Projects gallery
/projects/[slug]   → Project detail
/articles          → Articles list
/articles/[slug]   → Article detail
/contact           → Contact form + social links
/admin             → Payload CMS admin panel (protected)
```

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

### Articles (`/articles`)

- List layout dengan excerpt, category tag, tanggal publish
- Filter by category & tags
- Search by keyword
- Detail page (`/articles/[slug]`): rich text, code blocks, images

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

### Global Features

- **Responsive** — Mobile-first design
- **Dark/light mode** — Toggle tema
- **SEO** — Meta tags, OG images, sitemap, robots.txt
- **Performance** — Static generation, image optimization, minimal JS
- **Admin panel** — Payload CMS di `/admin` untuk manage semua konten

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS 3.x (embedded) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Database | MongoDB Atlas / PostgreSQL (Neon) |
| Deployment | Vercel |
| Image | next/image |
| Sitemap | next-sitemap |
| GitHub | GitHub API (client-side) |
| Email | Resend / Nodemailer (optional) |

---

## Visual Design & Tone

### Style
- Minimalis clean dengan white space yang cukup
- Typography-focused — konten yang berbicara
- Animasi subtle (fade-in, smooth scroll)
- Warna: neutral base (putih/abu-abu) dengan satu accent color

### Tone
- Profesional tapi approachable
- Story-driven — show the journey, bukan hanya resume
- Developer-friendly — code snippets, tech details

---

## Data Model (Payload CMS Collections)

### `projects`
- `title`, `slug`, `description`, `content` (rich text)
- `techStack` (array)
- `thumbnail`, `gallery` (images)
- `demoUrl`, `repoUrl`
- `category`, `featured`, `publishedAt`, `status`

### `articles`
- `title`, `slug`, `excerpt`, `content` (rich text + code blocks)
- `category` (relation), `tags` (array)
- `coverImage`
- `featured`, `publishedAt`, `status`

### `categories`
- `name`, `slug`, `description`

### `profile` (singleton)
- `name`, `title`, `bio`, `avatar`
- `skills`, `techStack`
- `socialLinks`, `email`, `availabilityStatus`

### `contactMessages`
- `name`, `email`, `subject`, `message`, `readAt`

---

## Non-Functional Requirements

- **Performance:** Lighthouse score > 90 untuk semua metrics
- **SEO:** Proper meta tags, OG images, sitemap auto-generated
- **Accessibility:** WCAG 2.1 AA compliance
- **Security:** Admin panel protected dengan authentication, CSRF protection
- **Maintainability:** Clean code structure, TypeScript strict mode
