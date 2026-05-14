# Gatsby Repo Payload Integration Design

Status: Implemented (CMS-first with explicit fallback only)  
Reviewed on 2026-05-12.

This document is the source of truth for integrating the separate Payload CMS repository into this Gatsby site.

## Runtime Clarification

- this repo is `Gatsby` + `React` on `Node.js`
- this repo is not `NestJS`-based
- this repo is not `Next.js`-based
- the separate Payload CMS repo is the `Next.js`-based application

## 1. Objective

Update this repository so the public blog consumes published content from Payload CMS instead of local Markdown files, while preserving the current UX and SEO behavior.

## 2. Current State

Current blog implementation:

- archive page: `src/pages/blog.js`
- detail page template: `src/templates/blog-template.js`
- page creation: `gatsby-node.js`
- content source: `src/content/blog/*.md`

Current reader-facing capabilities already in place:

- `/blog/`
- `/blog/<slug>/`
- tag filtering
- pagination
- related posts
- previous and next post navigation
- SEO component usage

## 3. Integration Goal

Keep the frontend behavior and URL structure, but change the source of content from Markdown to Payload.

## 4. URL Contract

These routes must remain unchanged:

- `/blog/`
- `/blog/<slug>/`

This is required for:

- SEO continuity
- internal links
- canonical stability

## 5. Content Source Change

### Current Source

- Markdown frontmatter
- Markdown body content

### New Source

- Payload REST API
- published posts only
- tag and media metadata included

### Runtime Source Strategy (Implemented)

- The Gatsby build now sources published posts from Payload into Gatsby nodes.
- The blog UI merges:
  - Payload posts
  - local Markdown posts in `src/content/blog/*.md`
- Deduplication is slug-based.
- If the same slug exists in both sources, Payload wins.
- The chosen delivery model is static generation plus rebuild on publish, not runtime CMS fetching.

This supports incremental migration while preserving existing URLs and content continuity.

## 6. Required Gatsby-Side Data Shape

The site needs these post fields at build time:

| Field | Purpose |
| --- | --- |
| `title` | archive and detail heading |
| `slug` | page creation and links |
| `excerpt` | archive summaries and fallback SEO |
| `content` | detail body |
| `publishedAt` | article date |
| `tags` | filters and related content |
| `coverImage` | archive and detail images |
| `ogImage` | SEO |
| `seoTitle` | page title |
| `seoDescription` | meta description |
| `canonicalUrl` | canonical tag |
| `noindex` | SEO control |
| `readingTimeMinutes` | optional display |

## 7. Integration Approach

Preferred build strategy:

1. fetch published content from Payload during Gatsby build
2. create Gatsby nodes from Payload response
3. update page creation to use Payload-backed nodes
4. update archive and detail queries to stop using `MarkdownRemark`
5. trigger a frontend rebuild after publish in production

This keeps the site static and does not require client-side fetching for the public blog.

Chosen integration method:

- `REST`

## 8. Pages and Files to Change

### `gatsby-node.js`

Tasks:

- replace Markdown-driven blog page creation
- fetch Payload posts during build
- create pages using Payload slugs
- preserve `/blog/<slug>/`

### `src/pages/blog.js`

Tasks:

- replace `allMarkdownRemark` query
- query Payload-backed Gatsby nodes
- preserve existing tag filter behavior
- preserve existing pagination behavior
- use Payload-provided excerpts and metadata

### `src/templates/blog-template.js`

Tasks:

- replace `markdownRemark` query
- replace HTML body assumptions with Payload content rendering
- preserve related posts logic
- preserve previous and next post logic
- keep SEO and structured data generation

### `src/content/blog/*.md`

Tasks:

- treat as temporary migration source
- remove from active sourcing after Payload migration is complete

## 9. Rendering Requirements

### Archive Page

Must continue to support:

- post list
- tag filtering
- pagination
- post title
- publish date
- excerpt
- cover image
- tag chips

### Detail Page

Must continue to support:

- title
- date
- reading time if available
- cover image
- article body
- tags
- share actions
- related posts
- previous and next links

## 10. SEO Requirements

The site must continue to provide:

- stable blog URLs
- canonical URLs
- article meta title
- article meta description
- Open Graph image
- structured data for blog detail pages

Rules:

- `seoTitle` should be preferred over `title`
- `seoDescription` should be preferred over `excerpt`
- `canonicalUrl` should be respected when present
- posts with `noindex = true` must render a noindex directive

## 11. Tag Filtering

Current behavior should remain:

- user can see all tags
- user can filter by a single tag
- `All` state remains available

Integration requirement:

- tags should come from Payload data, not inferred from Markdown files

## 12. Pagination

Current behavior should remain:

- archive paginates the filtered result set
- page state remains easy to scan

Implementation note:

- current query-param-driven pagination can remain in V1

## 13. Related Posts Logic

Recommended logic remains:

1. prioritize shared tags
2. sort by strongest tag overlap
3. use recency as tiebreaker
4. fallback to recent published posts if no shared tags exist

## 14. Content Rendering Decision

The Gatsby repo must render Payload-managed article content.

Requirement:

- choose one rendering-safe format from Payload and standardize on it for V1

Recommended direction:

- use Payload rich text and convert it to safe React-renderable output during build or render

Reason:

- structured editor support
- better long-term flexibility than raw Markdown

## 15. Migration Requirements

Before removing Markdown sourcing:

- migrate existing Markdown posts into Payload
- verify slug parity
- verify title and excerpt parity
- verify tag parity
- verify image parity

After verification:

- switch Gatsby sourcing to Payload
- retire Markdown as the source of truth

## 16. Environment Requirements

Local environment:

- `PAYLOAD_API_URL`
- optional alias: `BLOG_CMS_API_URL`
- optional posts endpoint override: `PAYLOAD_POSTS_ENDPOINT`
- optional posts endpoint alias: `BLOG_CMS_POSTS_ENDPOINT`

Staging environment:

- staging `PAYLOAD_API_URL`

Default behavior:

- if no env var is set, the build uses the deployed endpoint:
  - `https://portfolio-cms-production-8546.up.railway.app`
- if no posts endpoint override is set, the build uses:
  - `/api/posts`

If the Payload API is unreachable and a CMS URL is configured, Gatsby fails the build by default so stale Markdown content is not served silently.

Intentional fallback remains available with:

- `PAYLOAD_ALLOW_FALLBACK=true`
- optional alias: `BLOG_CMS_ALLOW_FALLBACK=true`

## 17. Repo Tasks

### Data Integration

- add Payload build-time fetch utility
- normalize Payload responses for Gatsby consumption
- create Gatsby nodes from Payload data

### Blog Archive

- refactor archive query away from `allMarkdownRemark`
- preserve tag filter UX
- preserve pagination UX

### Blog Detail

- refactor detail query away from `markdownRemark`
- implement Payload content rendering
- preserve related, previous, and next navigation

### SEO

- map Payload SEO fields into existing SEO component
- support canonical and noindex values
- keep structured data output

### Migration

- verify migrated content against current Markdown posts
- remove Markdown dependency from blog sourcing

## 18. Acceptance Criteria

- blog archive still works at `/blog/`
- blog detail pages still work at `/blog/<slug>/`
- tag filtering still works
- pagination still works
- only published Payload posts are shown
- SEO metadata is sourced from Payload
- existing Markdown files are no longer the active source of truth
- production publishing relies on rebuild-on-publish rather than runtime blog rendering

## 19. Deferred Option

- SSR or hybrid runtime rendering for the blog is deferred for now
- reconsider it only if rebuild-on-publish becomes operationally unacceptable
- optimize rebuild-on-publish toward affected-page or incremental rebuilds only instead of full-site Gatsby builds when the deployment platform supports it reliably
- consider a future Gatsby-to-Next.js migration if on-demand revalidation becomes the desired publishing model
