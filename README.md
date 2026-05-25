# Portfolio UI

Next.js portfolio site for Muhammad Usman. The site is statically generated from local JSON/Markdown content with optional Payload CMS posts fetched during build.

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
PAYLOAD_API_URL=https://cms.example.com
PAYLOAD_POSTS_ENDPOINT=/api/posts
```

Optional aliases kept for CMS compatibility:

```bash
BLOG_CMS_API_URL=https://cms.example.com
BLOG_CMS_POSTS_ENDPOINT=/api/posts
```

If no CMS URL is provided, the build uses local Markdown posts. If a CMS URL is provided and the fetch fails, the build fails by default. To continue intentionally with local Markdown content:

```bash
PAYLOAD_ALLOW_FALLBACK=true
```

Use `NEXT_PUBLIC_GA_TRACKING_ID` for Google Analytics and `NEXT_PUBLIC_FORM_LINK` for the quote form endpoint.

For a GitHub Pages project site such as `https://usman2x.github.io/portfolio-ui/`, use:

```bash
NEXT_PUBLIC_SITE_URL=https://usman2x.github.io/portfolio-ui
NEXT_PUBLIC_PATH_PREFIX=/portfolio-ui
```

## Content Model

- Page content: `src/content/pages/*.json`
- Shared content: `src/content/misc/*.json`
- Local writing: `src/content/blog/*.md`
- Project fallback content: `src/content/misc/projects.json`
- Public assets: `public/`

CMS posts tagged `case-study` become project case studies. Other published CMS posts become writings.
