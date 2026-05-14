# UI Project Brief

This document gives a short current-state overview of the UI repository.

## Purpose

The project is a Gatsby-based personal site for Muhammad Usman that combines:

- portfolio and case-study content
- a writings archive with article detail pages
- a quote/contact conversion flow

## Route Structure

- `/`
  - identity, latest writings, selected projects
- `/about/`
  - profile summary, strengths, work experience timeline
- `/projects/`
  - project archive
- `/projects/:slug/`
  - project case-study detail pages
- `/blog/`
  - writings archive with pagination and tag filtering
- `/blog/:slug/`
  - article detail pages sourced from Markdown or CMS
- `/quote/`
  - structured project-intake form
- `/thank-you/`
  - form completion page
- `/experience/`
  - long-form experience page sourced from Markdown

## Architecture

### Runtime Model

- Gatsby 5 static site generation
- React 18 component tree
- shared page shell through `src/components/Layout.js`

### Content Sources

- JSON content for page copy and reusable site data:
  - `src/content/pages/*.json`
  - `src/content/misc/*.json`
- Markdown content for:
  - `src/content/blog/*.md`
  - `src/content/experience/all.md`
- CMS content fetched during build in `gatsby-node.js`

### Page Generation

- route pages live under `src/pages/`
- project and blog detail pages are created from `gatsby-node.js`
- blog rendering supports Markdown fallback plus CMS-first content merging

## Key Features

- responsive homepage, about, projects, writings, and quote flow
- build-time blog ingestion from Payload CMS
- Markdown blog fallback when CMS data is unavailable
- tag-filtered writings archive with pagination
- case-study project detail pages
- share actions and SEO metadata on article pages
- theme persistence through `src/utils/theme.js`
- GitHub Pages deployment support
- Vercel root-path deployment support

## Deployment Modes

### GitHub Pages

- prefixed public path: `/portfolio-ui`
- automated via `.github/workflows/deploy.yml`
- manual fallback via `npm run deploy`

### Vercel

- root-path hosting
- configured by `vercel.json`
- local production deploy via `npm run deploy:vercel`
- automatic deployment available when the repo is linked in Vercel and `main` is set as the production branch
