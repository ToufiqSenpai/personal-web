# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
