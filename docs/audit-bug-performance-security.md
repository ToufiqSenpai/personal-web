# Project Audit: Bug, Performance, and Security Findings

Date: 2026-07-07
Scope: Read-only inspection of the Next.js + Payload CMS codebase

## Summary

This document captures concrete findings found during a code inspection of the project. The focus is on:
- potential bugs
- performance issues
- security risks

This is not a full runtime audit. No build, lint, test, or live exploit validation was performed for this report.

## Priority Summary

### High
1. Stored XSS risk in feed rendering
2. Public GitHub repository endpoint exposes private repository metadata
3. Contact form is open to abuse and email spam

### Medium
4. Homepage likely breaks because `@/data/mock` is missing
5. Articles are linked in the UI but not fully wired in the app/CMS
6. Error boundary exposes raw runtime messages to users
7. Cache invalidation does not handle deletes
8. `npm test` is inconsistent with the documented package manager
9. Project listing query will degrade as content grows
10. Feed infinite scroll can overfetch under repeated intersections

### Low
11. Locale switching is brittle because it relies on client cookie mutation and full reload

---

## Findings

### 1. Stored XSS risk in feed rendering
- Severity: High
- Category: Security
- Evidence:
  - `src/components/feeds/FeedCard.tsx:50`
  - `src/components/feeds/FeedCard.tsx:60`
  - `src/collections/Feeds.ts:49`
- Details:
  - Feed content is rendered with `dangerouslySetInnerHTML`.
  - Custom embed HTML comes from the Payload `embed` block field `html`.
  - There is no sanitization visible in the rendering path.
- Risk:
  - Any unsafe HTML stored in feed content can execute in the browser of site visitors.
  - This is a classic stored XSS path.
- Suggested remediation:
  - Sanitize HTML before render.
  - Prefer a strict allowlist of supported embeds instead of raw HTML.
  - Avoid falling back to raw `dangerouslySetInnerHTML` for `feed.body` unless the source is guaranteed safe.

### 2. Public GitHub repository endpoint exposes private repository metadata
- Severity: High
- Category: Security
- Evidence:
  - `src/collections/Projects.ts:61`
  - `src/components/admin/GithubRepoSelect.tsx:13`
- Details:
  - `/api/projects/github-repos` fetches repositories using `GITHUB_PAT`.
  - The endpoint returns `full_name`, `description`, `html_url`, and `private`.
  - No access control is visible in the endpoint handler.
- Risk:
  - A public caller can enumerate repository metadata, including private repositories accessible by the token.
- Suggested remediation:
  - Restrict endpoint access to authenticated admin users only.
  - Consider moving the fetch logic fully into the admin context rather than exposing it as a public API path.
  - Reduce returned fields to the minimum required.

### 3. Contact form is open to abuse and email spam
- Severity: High
- Category: Security / Reliability
- Evidence:
  - `src/collections/ContactMessages.ts:14`
  - `src/collections/ContactMessages.ts:21`
  - `src/components/contact/ContactForm.tsx:30`
- Details:
  - `contact-messages` allows anonymous `create` access.
  - Every successful create triggers an outbound email notification.
  - No visible rate limiting, honeypot, CAPTCHA, or throttling.
- Risk:
  - Spam submissions can flood the database.
  - Email notifications can be abused.
  - This can waste quota and operational resources.
- Suggested remediation:
  - Add rate limiting.
  - Add a honeypot field and/or CAPTCHA.
  - Consider origin validation and submission throttling.
  - Add monitoring for spikes in contact submissions.

### 4. Homepage likely breaks because `@/data/mock` is missing
- Severity: Medium
- Category: Bug
- Evidence:
  - `src/components/home/FeaturedArticles.tsx:3`
  - `src/app/[locale]/page.tsx:28`
- Details:
  - `FeaturedArticles` imports `mockFeaturedArticles` from `@/data/mock`.
  - The inspected `src/data` directory only showed `queries.ts`.
- Risk:
  - The homepage may fail to compile or render if the import target is actually missing.
- Suggested remediation:
  - Confirm whether `src/data/mock.ts` exists.
  - If it does not, either create it intentionally or replace the component with a real data source.

### 5. Articles are linked in the UI but not fully wired in the app/CMS (Still in development)
- Severity: Medium
- Category: Bug / Product consistency
- Evidence:
  - `src/components/layout/Navbar.tsx:25`
  - `src/components/home/FeaturedArticles.tsx:28`
  - `src/payload.config.ts:40`
- Details:
  - The UI links to `/articles` and article detail pages.
  - The active Payload config shown in inspection does not register article collections.
  - Article route implementation was not visible in the inspected app structure.
- Risk:
  - Broken navigation or incomplete features exposed to users.
- Suggested remediation:
  - Either complete the article feature end to end or remove/hide article links until it is ready.

### 6. Error boundary exposes raw runtime messages to users
- Severity: Medium
- Category: Security / UX
- Evidence:
  - `src/app/[locale]/error.tsx:47`
  - `src/app/[locale]/error.tsx:49`
- Details:
  - The error page prints `error.message` directly to the UI.
  - The full error object is also logged to the browser console.
- Risk:
  - Internal implementation details may leak in production.
  - User-facing errors become noisier and less controlled.
- Suggested remediation:
  - Show a generic user-safe message in production.
  - Keep detailed diagnostics in server logs or development-only views.

### 7. Cache invalidation does not handle deletes
- Severity: Medium
- Category: Bug / Performance correctness
- Evidence:
  - `src/hooks/revalidateCache.ts:4`
  - `src/collections/Projects.ts:58`
  - `src/collections/Feeds.ts:73`
  - `src/data/queries.ts:14`
- Details:
  - Cache revalidation is attached to `afterChange` hooks.
  - No `afterDelete` hook was found for the cached collections/global.
- Risk:
  - Deleted content can remain visible until cache TTL expires.
- Suggested remediation:
  - Add delete-time invalidation hooks for all tagged cached entities.

### 8. `npm test` is inconsistent with the documented package manager
- Severity: Medium
- Category: Bug / DX
- Evidence:
  - `package.json:16`
- Details:
  - The repo documents npm usage, but `npm test` delegates to `pnpm run test:int && pnpm run test:e2e`.
- Risk:
  - Tests may fail on environments that follow the docs but do not have pnpm installed.
- Suggested remediation:
  - Make scripts consistent with the chosen package manager.
  - If pnpm is the real requirement, update the documentation accordingly.

### 9. Project listing query will degrade as content grows
- Severity: Medium
- Category: Performance
- Evidence:
  - `src/data/queries.ts:42`
  - `src/data/queries.ts:48`
- Details:
  - `getAllProjects()` fetches all project docs with `depth: 1`.
  - There is no pagination or field projection.
- Risk:
  - Query cost grows with collection size.
  - The projects page may fetch more data than needed for card rendering.
- Suggested remediation:
  - Limit selected fields.
  - Introduce pagination or smaller data slices if the collection grows.

### 10. Feed infinite scroll can overfetch under repeated intersections
- Severity: Medium
- Category: Performance / Reliability
- Evidence:
  - `src/components/feeds/FeedList.tsx:22`
  - `src/components/feeds/FeedList.tsx:42`
- Details:
  - IntersectionObserver triggers `loadMore()` whenever the sentinel intersects.
  - State guards exist, but there is no stronger dedupe or request token.
- Risk:
  - Duplicate or extra requests can occur under rapid scroll/intersection changes.
- Suggested remediation:
  - Add a stronger in-flight request guard or dedupe strategy.
  - Consider disconnecting the observer while a request is active.

### 11. Locale switching is brittle because it relies on client cookie mutation and full reload
- Severity: Low
- Category: Bug / UX reliability
- Evidence:
  - `src/components/layout/Navbar.tsx:30`
- Details:
  - Locale changes mutate `NEXT_LOCALE` directly in `document.cookie` and force `window.location.reload()`.
- Risk:
  - Client state is lost.
  - This approach is more fragile than route-aware locale switching.
- Suggested remediation:
  - Prefer framework-aware locale navigation where possible.
  - Reduce reliance on full page reloads for language switching.

---

## Recommended Remediation Order

### Phase 1: Security-critical
1. Lock down `/api/projects/github-repos`
2. Remove or sanitize raw HTML feed rendering
3. Add anti-abuse protections to contact submissions

### Phase 2: User-facing bugs
4. Verify or fix `@/data/mock`
5. Align articles UI with actual routes and CMS config
6. Stop exposing raw runtime messages in the error page

### Phase 3: Reliability and performance
7. Add cache invalidation for deletes
8. Fix package manager/test script inconsistency
9. Optimize project listing data fetching
10. Harden feed infinite scroll request handling
11. Improve locale switch implementation

---

## Notes

- This report is based on code inspection only.
- Some findings should be confirmed with build/test/runtime verification before implementation.
- The most urgent items are the feed HTML rendering path, the GitHub repository endpoint, and the contact form abuse surface.
