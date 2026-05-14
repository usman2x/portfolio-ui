# Content Configuration Guide

This document defines how site content should be structured for implementation.

The goal is to keep layout in components and content in configurable source files.

## Principles

- Do not hardcode page copy inside React components.
- Keep reusable content in structured files.
- Keep long-form content in Markdown when the content is article-like.
- Keep page section content in JSON when the content is structured UI data.
- Reuse the same source of truth across pages when the same identity or credential data appears in multiple places.

## Recommended Content Split

### Use JSON for

- landing page section content
- about page section content
- CTA labels
- credentials and contact links
- project preview metadata
- quote wizard step labels and option sets

### Use Markdown for

- blog posts
- long-form case studies if you want editorial flexibility
- long-form standalone pages when prose is the primary content

## Recommended Content Files

### Global identity / contact

- `src/content/misc/identity.json`
- `src/content/misc/contact-data.json`
- `src/content/misc/book-call.json`
- `src/content/misc/work-experience.json`

### Landing page

- `src/content/pages/home.json`

Suggested contents:

- identity block copy:
  eyebrow, headline, supporting text, trust chips, below-hero line, CTA labels
- featured project ids
- featured writing ids or count
- CTA labels

### About page

- `src/content/pages/about.json`

Suggested contents:

- intro
- extended summary
- chronological work experience references
- strengths
- working principles
- experience highlights
- CTA copy

### Projects

- `src/content/misc/projects.json`
- `src/content/pages/project-detail.json`

Current file is a reasonable starting point for project previews.

Current runtime rule:

- published Payload posts tagged `case-study` are the active source for project archive, homepage project previews, and project detail pages
- `src/content/misc/projects.json` remains migration fallback content until all case studies live in CMS

Recommended later split:

- preview metadata and structured case-study sections in JSON
- full case study content in Markdown or separate JSON per project

Suggested case-study section block model:

- `sections[].title`
- `sections[].tone`
- `sections[].blocks`

Suggested supported blocks:

- `text`
- `list`
- `image`

Suggested image-block fields:

- `image`
- `caption`
- `alt`

### Writings

- existing blog Markdown is already the correct pattern:
  - `src/content/blog/*.md`

## Reuse Rules

- Name, title, portrait, and short intro should not be duplicated across Home and About.
- Credentials should come from one shared content file.
- CTA labels should come from page-level content files where possible.

## Component Responsibilities

- Components should render structure and state.
- Content files should provide text, links, lists, and section visibility.
- Components should not decide business copy.

## Good Example

- Home page component reads:
  - intro content from `home.json`
  - identity basics from `identity.json`
  - credentials from `contact-data.json`
  - projects from `projects.json`
  - writings from Markdown query

## What to Avoid

- Hardcoded headings in component files
- Repeating the same contact links in multiple components
- Storing large paragraph content in JSX
- Mixing layout decisions and content authoring in the same file

## Practical Recommendation for This Repo

If you implement incrementally, the cleanest next structure is:

- keep `contact-data.json`
- add `src/content/misc/identity.json`
- add `src/content/pages/home.json`
- add `src/content/pages/about.json`

This keeps the current repo pattern intact while making Home and About configurable.
