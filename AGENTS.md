# [AGENTS.md](http://AGENTS.md)

## Project Overview

Personal portfolio/website built with **TanStack Start** (Vite 8, React 19 RSC) and **Payload CMS 4.0** as an embedded CMS, backed by **PostgreSQL**. The site supports **i18n** (English, Indonesian, Japanese) via **Paraglide JS**, uses **StyleX** for component styling on top of plain CSS tokens, **Geist** fonts via Fontsource, and **S3-compatible storage** for media uploads.

**Purpose:** All-in-one personal branding platform combining portfolio showcase, blog/articles, and feeds in a single story-driven website.

Uploads all live in one `media` collection (`folders` + `tags` hierarchies, AVIF quality 80, no resize variants). Schema changes are committed migrations in `src/migrations`; the Postgres adapter runs with `push: false`, so run `npm run migrate:create -- <name>` and `npm run migrate` instead of relying on auto-push.

**Target audience:** Recruiters, potential collaborators, fellow developers.
