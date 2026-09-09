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
- `/quote/` or `/start-a-project/`

Optional:
- `/contact/` only if a dedicated contact page is needed

## General Slug Rules
- lowercase only
- hyphen-separated words
- no spaces
- no dates unless the page is time-sensitive by design
- no temporary naming like `final`, `new`, `v2`
- no automatically inferred slugs from titles at render time

Rule:
- Slugs should live in content files and be treated as stable identifiers.

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

### Blog Archive
- URL: `/blog/`
- Title pattern:
  - `Writings | Muhammad Usman`
- Description should summarize article topics

### Blog Detail
- URL: `/blog/<slug>/`
- Title should begin with article title
- Description should come from post frontmatter

### Quote Page
- URL: `/quote/` or `/start-a-project/`
- Title pattern:
  - `Get a Quote | Muhammad Usman`
- Description should clarify the project intake purpose

### Testimonials
- URL: `/testimonials/`
- Title pattern:
  - `Testimonials | Muhammad Usman`
- Description should identify the recommendations as direct professional feedback

## Canonical Rules
- Every index page should have a self-referencing canonical
- Every detail page should have a self-referencing canonical
- Do not create multiple URLs for the same page intentionally

## Internal Linking Rules
- Home should link to About, Projects, Writings, and CTA pages
- Project previews should link to project detail pages
- Writings previews should link to blog detail pages
- Detail pages should link laterally to related content

## Content Configuration Rule
- SEO-critical fields should be stored in content:
  - `title`
  - `slug`
  - `description`

For project detail pages, also prefer:
- `category`
- `tags`
- `cover`

## URL Naming Preference
Prefer:
- short
- descriptive
- durable

Examples:
- `/about/`
- `/projects/unified-data-platform/`
- `/blog/digital-paradigm-ai/`
- `/quote/`

Avoid:
- `/about-me-now/`
- `/projects/udp-final-v2/`
- `/blog/post-3/`
- `/contact-me-today/`
