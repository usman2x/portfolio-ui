# Payload CMS Blog Integration

Status: In progress (CMS integrated, fallback explicit during migration)  
Reviewed against the current repo on 2026-05-12.

This document is the cross-repo source of truth for integrating a separate Payload CMS repository with this Next.js site.

## Architecture Correction

The CMS will not live in a monorepo with this site.

The target setup is:

- one separate repository for Payload CMS
- this existing repository for the Next.js public site

## Runtime Clarification

- the Payload CMS repo is `Next.js`-based because Payload runs on Next.js
- this repository is `Next.js` + `React` on `Node.js`
- this repository is not `NestJS`-based

## Repo Responsibilities

### Payload CMS repo

Owns:

- admin authentication
- users
- posts
- tags
- media
- migrations
- REST API for published content

Design document:

- `docs/PAYLOAD_CMS_REPO.md`

### Next.js site repo

Owns:

- public blog archive
- public blog detail pages
- tag filtering
- pagination
- SEO rendering
- build-time fetch from Payload over REST through `src/lib/cms.js`

Design document:

- `docs/NEXT_BLOG_PAYLOAD_INTEGRATION.md`

## Shared Contract Between Repos

### Content Ownership

- Payload CMS is the source of truth for blog content.
- This Next.js repo consumes published content only.
- Markdown blog files in this repo are temporary until content migration is complete.

Current transition behavior:

- Next.js consumes published Payload posts first.
- Existing Markdown posts continue to render only when CMS sourcing is intentionally disabled or explicit fallback is enabled.
- Slug collisions resolve in favor of Payload content.
- The public site delivery model is static generation plus rebuild on publish.

### Public URL Contract

The Next.js site must preserve:

- `/blog/`
- `/blog/<slug>/`

### Public Data Contract

The Next.js site needs access to:

- published posts
- tags
- media URLs and metadata

The chosen integration method is:

- Payload `REST API`

### Shared Publishing Rules

- drafts must not be publicly visible
- published posts must have required SEO fields
- slugs must remain stable after publish unless explicitly changed
- publishing alone does not update the static UI until a frontend rebuild or redeploy runs

### Shared Media Rules

- media metadata is managed by Payload
- image binaries are stored in PostgreSQL in the CMS repo
- public site consumes resolved media URLs from Payload

## Delivery Order

Recommended order:

1. build the separate Payload CMS repo
2. implement schema, access control, and migrations there
3. migrate Markdown blog content into Payload
4. update this Next.js repo to fetch published content from Payload
5. wire publish-triggered rebuilds for the Next.js frontend
6. remove Markdown as the source of truth

## Related Docs

- `docs/PAYLOAD_CMS_REPO.md`
- `docs/NEXT_BLOG_PAYLOAD_INTEGRATION.md`
