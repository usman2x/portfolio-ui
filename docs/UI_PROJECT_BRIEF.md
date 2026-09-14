# UI Project Brief

This document gives a short current-state overview of the UI repository.

## Purpose

The project is a Next.js-based personal site for Muhammad Usman that combines:

- portfolio and case-study content
- a writings archive with article detail pages
- an intent-led contact flow for feedback, services, consultancy, and general messages

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
  - article detail pages sourced from Payload CMS
- `/contact/`
  - adaptive contact wizard beginning with intent
- `/quote/`
  - legacy redirect to `/contact/`
- `/thank-you/`
  - form completion page
- `/experience/`
  - long-form experience page sourced from Markdown

## Architecture

### Runtime Model

- Next.js static generation with `output: "export"`
- React 18 component tree
- shared page shell through `src/components/Layout.js`
- blog content delivery follows static generation plus rebuild on publish

### Content Sources

- Payload CMS globals provide page copy and reusable site data.
- Payload collections provide writings, projects, work experience, testimonials, media, and quote requests.
- all writing and project content is fetched during build through `src/lib/cms.js`

### Page Generation

- route pages live under `src/pages/`
- project and blog detail pages use Next dynamic routes under `src/pages/projects/[slug].js` and `src/pages/blog/[slug].js`
- blog and project rendering require the CMS API

## Key Features

- responsive homepage, about, projects, writings, and contact flow
- build-time blog ingestion from Payload CMS
- hard-fail CMS fetches to prevent incomplete deployments
- published CMS articles appear in the UI on the next successful Next.js build or deployment
- tag-filtered writings archive with pagination
- case-study project detail pages
- share actions and SEO metadata on article pages
- theme persistence through `src/utils/theme.js`
- direct OCI VM deployment through the repository deployment script

## Deployment

- OCI VM is the only supported production target.
- Caddy serves the static export from `/srv/portfolio/portfolio-ui/out`.
- `npm run deploy:oci` updates and deploys both the CMS and UI repositories.
- CMS publication hooks may invoke the VM's loopback-only UI rebuild listener.
- Full provisioning and troubleshooting instructions live in `docs/OCI_DEPLOYMENT.md`.

## Future Consideration

- runtime blog rendering or on-demand revalidation remains optional if no-rebuild publishing becomes a hard requirement
