# Gatsby Site: Local Testing and GitHub Pages Deployment

## Requirements

Use Node.js `20`.

```bash
nvm use
```

## Production URL

This repository is `usman2x/portfolio-ui`, so the GitHub Pages project-site URL is:

```text
https://usman2x.github.io/portfolio-ui/
```

`https://usman2x.github.io/` is the root URL for a user-site repository named `usman2x.github.io`. This repo will not deploy there unless you rename the repository or use that separate repo as the publishing target.

If `GITHUB_PAGES_CNAME` is configured in GitHub Actions variables, the site publishes to that custom domain instead.

## Local Development

Run the dev server:

```bash
npm run develop
```

This opens `http://localhost:8000`.

## Production-Like Local Test

Use the same path prefix GitHub Pages expects:

```bash
export GATSBY_PATH_PREFIX=/portfolio-ui
npm run build -- --prefix-paths
gatsby serve --prefix-paths
```

This opens `http://localhost:9000/portfolio-ui/`.

## Deployment

The primary deployment path is automatic:

1. Push to `main`.
2. GitHub Actions runs `.github/workflows/deploy.yml`.
3. The workflow builds Gatsby with `--prefix-paths`.
4. The built site is pushed to the `gh-pages` branch.

For this to work, GitHub must be configured correctly:

- GitHub Actions must be enabled for the repository.
- GitHub Pages must publish from the `gh-pages` branch at `/ (root)`.
- `GATSBY_PATH_PREFIX` should be `/portfolio-ui` unless a custom domain is used.
- `GATSBY_SITE_URL` should match the public site URL.

Manual fallback:

```bash
npm run deploy
```

That builds with `--prefix-paths` and pushes `public/` to `gh-pages`.

## Environment Variables

Recommended GitHub Actions variables:

```bash
GATSBY_SITE_URL=https://usman2x.github.io/portfolio-ui
GATSBY_PATH_PREFIX=/portfolio-ui
PAYLOAD_API_URL=https://cms.example.com
PAYLOAD_POSTS_ENDPOINT=/api/posts
```

Optional aliases:

```bash
BLOG_CMS_API_URL=https://cms.example.com
BLOG_CMS_POSTS_ENDPOINT=/api/posts
```

If no CMS URL variable is provided, the build falls back to local Markdown posts.

## Troubleshooting

If `main` is pushed and nothing deploys:

1. Check the Actions tab for a `Deploy Portfolio UI` run.
2. If no run exists, Actions are not being triggered at the repo level.
3. Check that GitHub Pages is serving `gh-pages`, not `main`.
4. Check that you are opening `https://usman2x.github.io/portfolio-ui/`, not `https://usman2x.github.io/`.
