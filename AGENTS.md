# [AGENTS.md](http://AGENTS.md)

## Project Overview

Personal portfolio/website built with **TanStack Start** (Vite 8, React 19 RSC) and **Payload CMS 4.0** as an embedded CMS, backed by **PostgreSQL**. The site supports **i18n** (English, Indonesian, Japanese) via **Paraglide JS**, uses **StyleX** for component styling on top of plain CSS tokens, **Geist** fonts via Fontsource, and **S3-compatible storage** for media uploads.

**Purpose:** All-in-one personal branding platform combining portfolio showcase, blog/articles, and feeds in a single story-driven website.

Uploads all live in one `media` collection (`folders` + `tags` hierarchies, AVIF quality 80, no resize variants). Schema changes are committed migrations in `src/migrations`; the Postgres adapter runs with `push: false`, so run `npm run migrate:create -- <name>` and `npm run migrate` instead of relying on auto-push.

**Target audience:** Recruiters, potential collaborators, fellow developers.

## Agent skills

### Issue tracker

Issues and specs for this repo live in the **Personal Web** Linear project (`P-MUH-2`, team `MUH`) at https://linear.app/muhammad-taufiqurrahman/project/personal-web-6bce0292147b/overview. Use the Linear MCP tools for all operations — never `gh issue`. Create with `save_issue` (`team: "MUH"`, project `P-MUH-2`), read with `get_issue` + `list_comments`, list with `list_issues` scoped to the project, comment with `create_comment`, and update status via `save_issue` using the team's statuses (`Backlog`, `Todo`, `In Progress`, `In Review`, `Done`, `Canceled`, `Duplicate`). Use existing labels `Feature`/`Bug`/`Improvement` plus the triage labels (`Needs Triage`, `Needs Info`, `Ready for Agent`, `Ready for Human`, `Wont Fix`). Use Linear sub-issues for parent/child and `Blocked by` relations for blockers. When a skill says "publish to the issue tracker", create a Linear issue in `P-MUH-2`; when it says "fetch the relevant ticket", read it with `get_issue`.
