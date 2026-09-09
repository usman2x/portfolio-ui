# Payload CMS Blog Integration

Status: Active (Payload is the only writing and case-study source)
Reviewed against the current repo on 2026-09-08.

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
- Local Markdown and project fallback data are not supported.
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
3. seed or author content in Payload
4. fetch published content from Payload during the Next.js build
5. trigger frontend rebuilds when published content changes

## Related Docs

- `docs/PAYLOAD_CMS_REPO.md`
- `docs/NEXT_BLOG_PAYLOAD_INTEGRATION.md`
