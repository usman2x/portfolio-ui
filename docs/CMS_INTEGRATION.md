# CMS Integration

How this UI consumes the separate `portfolio-cms` repository (Payload 3 on Next.js, PostgreSQL).
The CMS schema and access rules are in `../portfolio-cms/docs/CONTENT_MODEL.md`.

## Delivery model

- Static generation with `output: "export"`: every page fetches CMS content in `getStaticProps`
  during `npm run build`, and the result is written to `out/`.
- Payload is the only content source. A missing or failing CMS fails the build, so an empty or
  stale site cannot be deployed silently.
- Published changes reach the public site through a rebuild: Payload triggers the UI rebuild
  webhook (see `docs/OCI_DEPLOYMENT.md`, "Automatic rebuild after CMS changes").

## Environment

| Variable | Purpose |
| --- | --- |
| `PAYLOAD_API_URL` | Build-time CMS base URL (required). `http://localhost:3001` locally, `http://127.0.0.1:3001` on the VM. |
| `NEXT_PUBLIC_CMS_URL` | Browser-visible CMS URL: media URLs and contact submissions. Defaults to `PAYLOAD_API_URL`. |
| `PAYLOAD_POSTS_ENDPOINT` | Optional posts path (default `/api/posts`). |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata, sitemap and robots. |
| `NEXT_PUBLIC_PATH_PREFIX` | Optional base path. |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Optional Google Analytics. |

## Code ownership

- `src/lib/cms.js` holds every Payload request and all response normalization. Pages and
  components consume normalized objects, never raw Payload shapes.
- `src/lib/content.js` splits posts into articles and projects and memoizes the posts request for
  the lifetime of the process.
- Pages fetch in `getStaticProps`; detail pages use `getStaticPaths` with `fallback: false`.

## Requests

All requests go through `fetchCms`: 10-second timeout, up to three attempts with backoff for
network errors and 5xx responses.

| Function | Endpoint | Notes |
| --- | --- | --- |
| `fetchPayloadGlobal(slug)` | `GET /api/globals/<slug>?depth=2` | Base for all globals |
| `fetchSiteSettings` | `site-settings` | Resolves logo and portrait URLs |
| `fetchHomePage` | `home-page` | Flattens text rows, proof stats, featured project ids |
| `fetchAboutPage` | `about-page` | Summary rows; `featuredTestimonial` only when populated (unpublished rows come back as an id and are ignored) |
| `fetchTestimonialsPage`, `fetchArchiveSettings`, `fetchProjectTemplate`, `fetchSystemPages` | matching globals | |
| `fetchQuotePage` | `quote-page` | Contact page copy, with compatibility defaults for older content |
| `fetchPayloadPosts` | `GET /api/posts?depth=2&limit=200&sort=-publishedAt&where[_status][equals]=published` | Paginated until all pages are read |
| `fetchPayloadTestimonials` | `GET /api/testimonials?sort=sortOrder&where[status][equals]=published` | Adds `relationshipLabel` ("managed Muhammad") |
| `fetchPayloadServices` | `GET /api/services?sort=sortOrder&where[status][equals]=published&where[showOnHome][equals]=true` | A 404 (CMS without the collection) returns `[]` |
| `fetchWorkExperience` | `GET /api/work-experience?sort=sortOrder&where[status][equals]=published` | Highlight rows; period dash normalized; `isCurrent` when the period contains "Present" |

## Post normalization

Each published post becomes one object with: `slug`, `title`, `excerpt`, `description`, `date`,
`tags`, `contentHtml` (Lexical rich text converted to HTML with absolute media URLs),
`readingTimeMinutes`, SEO fields, `coverImageUrl`, `coverThumbnailUrl`, `coverImageWidth` and
`coverImageHeight` (from the `card` size, for reserved image space), `ogImageUrl`,
`projectRole`, `projectOutcome`, `projectGallery`, and the publication fields
(`publicationType`, `externalPlatform`, `externalUrl`, `externalCtaLabel`).

Posts tagged `case-study` are projects; all others are articles. External articles get no local
route.

## Writes from the browser

The contact wizard posts JSON to `NEXT_PUBLIC_CMS_URL/api/quote-requests/submit`. The CMS
validates the payload, limits origins to `UI_PUBLIC_URL` and `QUOTE_ALLOWED_ORIGINS`, and applies a
rate limit (5 per 15 minutes per client). The honeypot field `hp_trap_7f3k` sits outside the form so
browser autofill cannot fill it; a submission that fills it is stored with status `spam`, never
discarded. Submissions are admin-only. See `docs/pages/CONTACT_PAGE.md`.

## Contract changes

When the UI needs a new or changed field:

1. Change the Payload schema, generate types and create a migration in `portfolio-cms`.
2. Update the seed data if the field is part of the baseline.
3. Normalize the field in `src/lib/cms.js` with a safe fallback for empty values, so the UI keeps
   building against a CMS that has not been migrated or filled yet.
4. Update `docs/content/CONTENT_CONFIGURATION.md` and the relevant page doc.
