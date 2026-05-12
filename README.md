# 📄 Gatsby Site: Local Testing & GitHub Pages Deployment

## Requirements

Use Node.js 20 LTS (or any Node.js version `>=18.0.0`).

If you use `nvm`, run:

```bash
nvm use
```

## 🚀 1. Run Gatsby Locally (for Development)

To start the site in development mode:

```bash
gatsby develop
```

- Opens at `http://localhost:8000`
- Live reload, fast refresh enabled
- Ignores `pathPrefix`, so URL paths are root-based (good for local dev)

---

## 🧪 2. Test Site Locally With `pathPrefix` (Like on GitHub Pages)

If your site will be deployed under a subdirectory like `https://username.github.io/my-site`, you need to test it locally with `pathPrefix`.

### ✅ Steps:

1. Set `GATSBY_PATH_PREFIX` in your environment:

```bash
export GATSBY_PATH_PREFIX=/my-site
```

2. Build the site with prefix:

```bash
gatsby build --prefix-paths
```

3. Serve the site locally:

```bash
gatsby serve --prefix-paths
```

- Opens at `http://localhost:9000/my-site/`
- Good for verifying routing, assets, and links before pushing to GitHub Pages

---

## ⚙️ Environment Variables

Deployment should now be configured through environment variables rather than hardcoded domain or CMS values.

Recommended variables:

```bash
GATSBY_SITE_URL=https://example.com
GATSBY_PATH_PREFIX=/portfolio-ui
PAYLOAD_API_URL=https://cms.example.com
PAYLOAD_POSTS_ENDPOINT=/api/posts
```

Optional aliases supported by the blog source:

```bash
BLOG_CMS_API_URL=https://cms.example.com
BLOG_CMS_POSTS_ENDPOINT=/api/posts
```

If no CMS URL variable is provided, the site falls back to local Markdown posts only.

## 📌 GitHub Pages Root Path

Root-path hosting on GitHub Pages is possible only for a user or organization site repository, for example:

```text
https://usman2x.github.io/
```

That requires the repository name to be:

```text
usman2x.github.io
```

For the current repository name `portfolio-ui`, the GitHub Pages URL is a project site and will live under:

```text
https://usman2x.github.io/portfolio-ui/
```

Unless you use a custom domain.

---

## 🚀 3. Deploy to GitHub Pages

### 1. Make sure you have `gh-pages` installed:

```bash
npm install gh-pages --save-dev
```

### 2. Update your `package.json`:

```json
"scripts": {
  "develop": "gatsby develop",
  "build": "gatsby build",
  "serve": "npm run build && gatsby serve",
  "deploy": "gatsby build --prefix-paths && gh-pages -d public"
}
```

### 3. Deploy:

```bash
npm run deploy
```

- This builds the project with the correct path prefix and pushes the `public/` folder to the `gh-pages` branch.

---

## ✅ Bonus: Test Build Without Deploying

You can also manually test the build before deploying:

```bash
npm run build
gatsby serve --prefix-paths
```

For this repo specifically, `npm run serve` already runs the build step before starting the server. If you run `gatsby serve` directly, make sure a successful `gatsby build` has completed first.
