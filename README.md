# Portfolio UI

Next.js portfolio site for Muhammad Usman. Page copy is configured locally, while all writings and project case studies are fetched from Payload CMS during the build.

## Requirements

Use Node.js `20` or newer.

```bash
nvm use
```

## Local Development

```bash
npm run develop
```

This starts the Next.js dev server at `http://localhost:3000`.

## Build

```bash
npm run build
```

The project uses `output: "export"` in [next.config.js](/Users/user/projects/portfolio-ui/next.config.js:1), so production files are emitted to `out/`.

## Deployment

### Vercel

The repository includes [vercel.json](/Users/user/projects/portfolio-ui/vercel.json:1):

- install: `npm ci`
- build: `npm run build`
- output: `out/`

### GitHub Pages

Manual static deployment remains available:

```bash
npm run deploy
```

That builds the static export and publishes `out/` to `gh-pages`.

## Environment Variables

Recommended:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_PATH_PREFIX=
PAYLOAD_API_URL=http://localhost:3001
NEXT_PUBLIC_CMS_URL=http://localhost:3001
PAYLOAD_POSTS_ENDPOINT=/api/posts
```

`PAYLOAD_API_URL` is required. Builds fail when the CMS is unavailable so stale or incomplete content cannot be deployed silently.

Use `NEXT_PUBLIC_GA_TRACKING_ID` for Google Analytics. `NEXT_PUBLIC_CMS_URL` is the browser-visible CMS base URL used by quote submissions.

For a GitHub Pages project site such as `https://usman2x.github.io/portfolio-ui/`, use:

```bash
NEXT_PUBLIC_SITE_URL=https://usman2x.github.io/portfolio-ui
NEXT_PUBLIC_PATH_PREFIX=/portfolio-ui
```

## Content Model

- Page and shared content: Payload CMS globals and collections
- Local development fixtures: `portfolio-cms/scripts/seed-data.mjs`
- Writings: published Payload posts without the `case-study` tag
- Projects: published Payload posts tagged `case-study`
- Testimonials: published and featured Payload testimonials
- Public assets: `public/`

The Payload API is the only source of writing and project content.
