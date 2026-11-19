# SEO and URL Strategy

This document defines URL structure, slug rules, and page-level SEO conventions for the site.

The goal is to keep routing clean, human-readable, and stable as the site grows.

## Core Route Structure

- `/` home
- `/about/`
- `/projects/`
- `/projects/<slug>/`
- `/blog/`
- `/blog/<slug>/`
- `/testimonials/`
- `/contact/`
- `/thank-you/` (form completion)
- `/quote/` as a legacy redirect only

## General Slug Rules

- lowercase only
- hyphen-separated words
- no spaces
- no dates unless the page is time-sensitive by design
- no temporary naming like `final`, `new`, `v2`
- no automatically inferred slugs from titles at render time

Rule:

- Slugs live in Payload (posts and tags) and are stable identifiers; Payload blocks slug changes
  after a post is published.

## Page-Level SEO Rules

### Home

- URL: `/`
- Title should describe identity and site purpose
- Description should mention engineering, writing, and project work

### About

- URL: `/about/`
- Title pattern:
  - `About | Muhammad Usman`
- Description should summarize role, experience, and technical scope

### Projects Archive

- URL: `/projects/`
- Title pattern:
  - `Projects | Muhammad Usman`
- Description should summarize domains of work

### Project Detail

- URL: `/projects/<slug>/`
- Title pattern:
  - `<Project Name> | Project Case Study`

### Articles Archive

- URL: `/blog/`
- Title pattern:
  - `Articles | Muhammad Usman`
- Description should summarize article topics

### Article Detail

- URL: `/blog/<slug>/`
- Title: the post's `seoTitle`, else its title
- Description: the post's `seoDescription`, else its excerpt
- Only native CMS articles generate `/blog/<slug>/` pages. External articles link to their source URL and are excluded from local routes and the sitemap.

### Contact Page

- URL: `/contact/`
- Title pattern:
  - `Contact Me | Muhammad Usman`
- Description should mention feedback, services, consultancy, and general messages

### Testimonials

- URL: `/testimonials/`
- Title pattern:
  - `Testimonials | Muhammad Usman`
- Description should identify the recommendations as direct professional feedback

### Experience (retired)

- `/experience/` repeated About's work history and nothing linked to it. It was removed on
  2026-10-06; Caddy redirects it permanently (301) to `/about/#experience`, and it is no longer in the
  sitemap.

### System pages

- 404 renders `noindex` and is excluded from the sitemap.
- `/thank-you/` uses `thankYouTitle` (System Pages) as its title, renders `noindex` and is
  excluded from the sitemap.

## Titles and metadata

`src/components/seo.js` renders `<title>` as `<page title> | <Site Settings defaultSeoTitle>`,
plus the description, Open Graph and Twitter tags, the canonical link and optional `noindex`.
Detail pages honour a post's `canonicalUrl` and `noindex`; articles add `BlogPosting` JSON-LD.

## Structured data

`src/lib/structuredData.js` builds schema.org JSON-LD from Site Settings, and
`src/components/StructuredData.js` renders it. Nodes share stable `@id`s under the site URL:

- Home: one `@graph` with `WebSite` (`/#website`), `Person` (`/#person`) and `ProfessionalService`
  (`/#service`). The person carries `name`, `professionalTitle`, portrait, `defaultSeoDescription`,
  email and `socialLinks` as `sameAs`; the service lists the home page services as an
  `OfferCatalog`, with the person as founder and provider.
- About: `ProfilePage` whose `mainEntity` is the same `Person`.
- Articles: `BlogPosting` whose `author` references the `Person` by `@id`.

Validate changes with Google's Rich Results Test or the Schema.org validator.

## Sitemap, robots and llms.txt

`scripts/generate-sitemap.mjs` runs after `npm run build` (`postbuild`). It reads every exported
HTML page and lists it under `NEXT_PUBLIC_SITE_URL`, except 404, `/quote/`, `/thank-you/` and any
page rendered `noindex`. It writes `sitemap.xml`, a `robots.txt` that allows all crawlers and points
to the sitemap, and `llms.txt` ([llmstxt.org](https://llmstxt.org)) for AI assistants.

`llms.txt` uses the same page list. Its heading and summary come from the home page `Person`
JSON-LD; it then lists the main pages, the services from the `ProfessionalService` offer catalog,
case studies (`/projects/<slug>/`) and articles (`/blog/<slug>/`) with each page's title and meta
description, and finally the contact page, email and social links. External articles have no local
page, so neither file lists them.

Google Search Console is not verified yet. Verify the `themuhammadusman.com` domain property with
a DNS TXT record (it needs no code change), submit `https://www.themuhammadusman.com/sitemap.xml`,
and resubmit after URL changes.

## Canonical Rules

- Every index page should have a self-referencing canonical
- Every detail page should have a self-referencing canonical
- Do not create multiple URLs for the same page intentionally

## Internal Linking Rules

- Home should link to About, Projects, Articles, and CTA pages
- Project previews should link to project detail pages
- Article previews should link to blog detail pages
- Detail pages should link laterally to related content

## Content Configuration Rule

- SEO-critical fields live in Payload: page globals carry `seoTitle` and `seoDescription`; posts
  carry `title`, `slug`, `seoTitle`, `seoDescription`, `canonicalUrl`, `noindex`, `ogImage` and
  `coverImage`.

## URL Naming Preference

Prefer:

- short
- descriptive
- durable

Examples:

- `/about/`
- `/projects/unified-data-platform/`
- `/blog/digital-paradigm-ai/`
- `/contact/`

Avoid:

- `/about-me-now/`
- `/projects/udp-final-v2/`
- `/blog/post-3/`
- `/contact-me-today/`
