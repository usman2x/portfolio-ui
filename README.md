# Gatsby Site Deployment Guide

## Requirements

Use Node.js `20`.

```bash
nvm use
```

## Hosting Options

This project can be deployed in two different ways:

- GitHub Pages as a project site at `https://usman2x.github.io/portfolio-ui/`
- Vercel at the root path of a Vercel domain or custom domain

Use GitHub Pages only if you want to stay on GitHub-hosted static deployment. Use Vercel if you want root-path hosting without the `/portfolio-ui` prefix.

## GitHub Pages URL

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

## GitHub Pages Local Test

Use the same path prefix GitHub Pages expects:

```bash
export GATSBY_PATH_PREFIX=/portfolio-ui
npm run build -- --prefix-paths
gatsby serve --prefix-paths
```

This opens `http://localhost:9000/portfolio-ui/`.

## GitHub Pages Deployment

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

## Vercel Deployment

Vercel should be configured for root-path hosting. For Vercel deployments:

- set `GATSBY_PATH_PREFIX=/` or leave it unset
- set `GATSBY_SITE_URL` to the final Vercel or custom domain
- do not reuse the GitHub Pages value `/portfolio-ui`

The repository includes [vercel.json](/Users/user/projects/portfolio-ui/vercel.json:1) so Vercel uses:

- `npm ci` for install
- `npm run build` for build
- `public/` as the output directory

### Local Vercel Deploy

1. Install and authenticate the CLI:

```bash
npm i -g vercel
vercel login
```

2. Link the local directory to a Vercel project:

```bash
vercel link
```

3. Create a preview deployment:

```bash
vercel
```

4. Create a production deployment:

```bash
npm run deploy:vercel
```

You can also run `vercel --prod` directly.

### Automatic Vercel Deploy From `main`

1. Import the GitHub repository into Vercel.
2. Set the Production Branch to `main`.
3. Add the required environment variables in the Vercel project settings.
4. Push to `main`.

After that:

- pushes to `main` create production deployments
- pushes to other branches create preview deployments

If your Vercel project accidentally points to `revamp` as the production branch, change it to `main`.

## Environment Variables

Recommended GitHub Pages variables:

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

Recommended Vercel variables:

```bash
GATSBY_SITE_URL=https://your-vercel-domain-or-custom-domain
GATSBY_PATH_PREFIX=/
PAYLOAD_API_URL=https://cms.example.com
PAYLOAD_POSTS_ENDPOINT=/api/posts
```

Optional aliases are the same:

```bash
BLOG_CMS_API_URL=https://cms.example.com
BLOG_CMS_POSTS_ENDPOINT=/api/posts
```

## Troubleshooting

If `main` is pushed and nothing deploys:

1. Check the Actions tab for a `Deploy Portfolio UI` run.
2. If no run exists, Actions are not being triggered at the repo level.
3. Check that GitHub Pages is serving `gh-pages`, not `main`.
4. Check that you are opening `https://usman2x.github.io/portfolio-ui/`, not `https://usman2x.github.io/`.

If Vercel deploys but the site still shows prefixed URLs:

1. Check that `GATSBY_PATH_PREFIX` is `/` or unset in Vercel.
2. Check that `GATSBY_SITE_URL` matches the real production domain.
3. Redeploy after changing environment variables, because env changes do not update old deployments.
