# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-07-08

### Added
- **Cloudflare Turnstile CAPTCHA**: Integrated Turnstile protection on client and server sides to secure the contact form against automated spam and DDoS abuse.
- **Client IP Rate Limiting**: Implemented a server-side in-memory rate limiter on contact form submissions, limiting submissions to a maximum of 5 requests per IP per 15-minute window.
- **Theme & Locale CAPTCHA Integration**: Built a reusable client-side `<Turnstile>` component that automatically adapts its theme and language depending on the website's active settings.

## [0.2.1] - 2026-07-07

### Added
- **HTML Sanitization to Feeds**: Integrated `isomorphic-dompurify` to prevent Stored XSS injection vectors while preserving legitimate `iframe` embedding layout properties.
- **Dynamic Browser Language Detection**: Leveraged `headers()` in `src/i18n/request.ts` to parse `Accept-Language` headers and dynamically set the default locale on the first visit.

### Changed
- **Secure GitHub Repositories Endpoint**: Enforced user authentication checks (`if (!req.user)`) inside `/api/projects/repositories` and changed the path from `/github-repos` to `/repositories`.
- **Sanitized UI Error Boundary**: Configured `src/app/[locale]/error.tsx` to conditionally display detailed stack traces only in development, showing a generic error code and safe message in production.
- **Standardized Package Manager**: Cleaned up `package.json` pnpm engine properties and refactored dev, testing, and compose build pipelines to use `npm`.
- **Feed Infinite Scroll Guard**: Implemented synchronous ref locks and IntersectionObserver disconnect flags in `FeedList.tsx` to eliminate race conditions and overfetching.
- **Smooth Language Switching**: Swapped full page reloads (`window.location.reload()`) with Next.js router refresh and React's `useTransition` for a seamless language switching experience.
- **Increased Language Cookie Expiration**: Updated language persistence cookie `max-age` to 10 years (`315360000` seconds) to make it effectively permanent.

## [0.2.0] - 2026-07-07

### Added

- **i18n Translation Support**:
  - Added localized strings for the `"present"` status tag under a new `About` namespace in all translation files.
  - Localized all section headers and empty-state placeholders in `FeaturedProjects` and `FeaturedArticles`.
  - Added translation support to `Timeline` and `BentoHobbies` section headers.
- **Accessibility & Touch / Focus States**:
  - Added explicit focus-within styles (`tabIndex={0}` and outline/ring borders) to `ProjectCard` overlay, `BentoHobbies` grid items, and the `HomeAbout` avatar component to support mobile touch screens and keyboard focus.

### Changed

- **Timeline Schema Refactor**:
  - Replaced the generic `year` text field in the `Profile.timelines` collection with `yearStart` (number, required), `yearEnd` (number, optional), and `present` (checkbox).
  - Added a conditional validation function to the schema ensuring that `yearEnd` is required unless `present` is checked.
  - Removed the unused `type` select field from the `timelines` collection.
- **Collection Grouping in Admin Panel**:
  - Grouped all Payload collections under semantic administrative tabs in the sidebar panel (`Profile`, `Admin`, `Contact`, `Feeds`, `Projects`) to improve CMS navigation.
- **UI Optimizations**:
  - Removed the developer telemetry terminal screen mockup from the homepage CTA section and centered the main text box.
  - Replaced the static footer tagline with the dynamic `profile.intro` field loaded from the CMS database.
  - Responsive feeds timeline: Hid the vertical timeline boundary border and floating nodes on mobile screen widths inside `FeedList` and `FeedCard` to maximize usable screen real estate.
- **Mock Data Cleanup**:
  - Removed unused timeline schemas, types, and mock arrays from `mock.ts`.

## [0.1.0] - 2026-07-06

This is the initial release of the personal portfolio website, bridging Payload CMS 3.85 with Next.js 16 (App Router).

### Added

- **Hero & Navbar Sections**:
  - Implemented a smooth typing terminal simulation showing the initial command `claude profile --verbose`.
  - Linked introductory and name details directly to the Payload CMS `Profile` global database configuration.
  - Updated Navbar's share action to dynamically reference the loaded profile name.
- **About Me & Biography**:
  - Bound biography paragraph on the home page and About Me hero segment to render the `bio` field dynamically from the database.
- **Projects Showcase**:
  - Configured the homepage `FeaturedProjects` block to query and render dynamic database projects (`ProjectCard`) instead of static mock files.
  - Linked projects grid to display real uploaded media thumbnails, descriptions, and tags directly from Payload CMS.
- **Mailing List & Contact Form**:
  - Created a database collection `contact-messages` with a public creation endpoint (`/api/contact-messages`).
  - Added an `afterChange` database hook that compiles a custom React Email template (`ContactEmail`) via `@react-email/render` and sends instant notification emails.
  - Linked frontend `ContactForm.tsx` to handle backend field-level validation errors returned by Payload API and reset form fields properly post-submit.
- **S3 Media Storage & Custom CDN**:
  - Configured `@payloadcms/storage-s3` plugin to host media uploads on Cloudflare R2 / AWS S3.
  - Added support for a custom CDN domain (`S3_CDN_URL`) using a custom `generateFileURL` helper.
  - Set `disablePayloadAccessControl: true` to bypass Next.js server proxying and serve assets directly from the CDN (`cdn.mhmtaufiq.foo`).
  - Configured dynamic and static `remotePatterns` (allowing `"cdn.mhmtaufiq.foo"` and hostnames parsed from S3 endpoints and CDN URLs) to prevent Next.js image authorization crashes.
- **Feeds Page Internationalization**:
  - Implemented `next-intl` translation keys (`Feeds` namespace) across English, Indonesian, and Japanese locales.
  - Added dynamic date/time formatting inside `FeedCard` based on the active visitor's locale using `useLocale`.
  - Localized the empty state logs on the timeline feeds list.
