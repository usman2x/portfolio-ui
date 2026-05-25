# Next.js Payload Blog Integration

This document describes how the UI repo consumes published Payload CMS posts.

## Runtime Model

- The public site is Next.js with static generation.
- Content is fetched during `npm run build`.
- The generated output is exported to `out/`.
- Publishing in Payload still requires a frontend rebuild or redeploy before public pages change.

## Content Sources

- CMS posts are fetched in `src/lib/cms.js`.
- Local Markdown posts are parsed in `src/lib/markdown.js`.
- `src/lib/content.js` merges CMS and local content for pages.
- CMS posts tagged `case-study` become project case studies.
- Other CMS posts become writings.
- Local Markdown remains fallback content when CMS is disabled or explicit fallback is enabled.

## CMS Fetch Rules

The UI reads:

- `PAYLOAD_API_URL` or `BLOG_CMS_API_URL`
- `PAYLOAD_POSTS_ENDPOINT` or `BLOG_CMS_POSTS_ENDPOINT`

If no CMS API URL is configured, local Markdown is used.

If a CMS API URL is configured and fetching fails, the build fails by default. To continue intentionally with local Markdown fallback:

```bash
PAYLOAD_ALLOW_FALLBACK=true
```

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
