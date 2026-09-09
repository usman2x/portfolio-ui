# Next.js Payload Blog Integration

This document describes how the UI repo consumes published Payload CMS posts.

## Runtime Model

- The public site is Next.js with static generation.
- Content is fetched during `npm run build`.
- The generated output is exported to `out/`.
- Publishing in Payload still requires a frontend rebuild or redeploy before public pages change.

## Content Sources

- CMS posts are fetched in `src/lib/cms.js`.
- `src/lib/content.js` exposes CMS writings and case studies to pages.
- CMS posts tagged `case-study` become project case studies.
- Other CMS posts become writings.
- Payload CMS is the only source of writings and project case studies.

## CMS Fetch Rules

The UI reads `PAYLOAD_API_URL` and the optional `PAYLOAD_POSTS_ENDPOINT`.
`PAYLOAD_API_URL` is required. A missing or unavailable CMS fails the build so an empty or stale portfolio cannot be deployed silently.

## URL Contract

The public route contract remains:

- `/blog/`
- `/blog/<slug>/`
- `/projects/`
- `/projects/<slug>/`

Slugs must remain stable and come from content, not from render-time title inference.

## Payload Post Shape

The UI expects published posts to provide:

- `id`
- `title`
- `slug`
- `publishedAt` or `createdAt`
- `excerpt` or rich-text `content`
- `seoTitle`
- `seoDescription`
- `tags`
- optional `coverImage`
- optional `ogImage`
- optional `canonicalUrl`
- optional `noindex`

Rich text is converted to HTML by the build helper before it reaches page components.

## Page Ownership

- Archive route: `src/pages/blog/index.js`
- Article route: `src/pages/blog/[slug].js`
- Projects archive route: `src/pages/projects/index.js`
- Project detail route: `src/pages/projects/[slug].js`

The page components should render structure only. Content fetching and normalization belongs in `src/lib/`.
