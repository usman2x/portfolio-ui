# Portfolio UI

Next.js portfolio site for Muhammad Usman. Page copy is configured locally, while all writings and project case studies are fetched from Payload CMS during the build.

## Requirements

Use Node.js `20.9.0` or newer. Node 20 LTS is recommended.

If Node Version Manager is installed, run `nvm use`; otherwise use any installed runtime that satisfies the requirement.

## Local Development

Start and seed `portfolio-cms` first, then configure this repository:

```bash
npm ci
cp .env.example .env.local
npm run develop
```

This starts the Next.js dev server at `http://localhost:3000`.

See [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md) for the complete PostgreSQL, CMS,
seed, UI, verification, and troubleshooting workflow.

## Build

```bash
npm run build
```

The project uses `output: "export"` in [next.config.js](next.config.js), so production files are emitted to `out/`. The CMS must be running and reachable during the build.

## Deployment

Production is deployed directly to the OCI VM. There are no provider-hosted deployment pipelines
in this repository.

After the initial checkout on the VM, deploy both CMS and UI in the required order with:

```bash
cd /srv/portfolio/portfolio-ui
npm run deploy:oci
```

See `docs/OCI_DEPLOYMENT.md` for initial provisioning, environment configuration, service setup,
deployment behavior, and troubleshooting.

## Environment Variables

Recommended:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PATH_PREFIX=
PAYLOAD_API_URL=http://localhost:3001
NEXT_PUBLIC_CMS_URL=http://localhost:3001
PAYLOAD_POSTS_ENDPOINT=/api/posts
```

Copy `.env.example` to `.env.local` for local development. Do not commit `.env.local`.

`PAYLOAD_API_URL` is required. Builds fail when the CMS is unavailable so stale or incomplete content cannot be deployed silently.

Use `NEXT_PUBLIC_GA_TRACKING_ID` for Google Analytics. `NEXT_PUBLIC_CMS_URL` is the browser-visible CMS base URL used by quote submissions.

## Content Model

- Page and shared content: Payload CMS globals and collections
- Local development fixtures: `portfolio-cms/scripts/seed-data.mjs`
- Writings: published Payload posts without the `case-study` tag
- Projects: published Payload posts tagged `case-study`
- Testimonials: published and featured Payload testimonials
- Public assets: `public/`

The Payload API is the only source of writing and project content.
