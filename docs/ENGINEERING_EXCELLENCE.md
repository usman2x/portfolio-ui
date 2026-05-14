# Engineering Excellence

This document records the working standards for the UI repository and a short backlog of engineering-quality improvements.

## Standards

- Keep implementation and documentation aligned in the same change.
- Treat `docs/style/STYLEGUIDE.md`, `docs/structure/STRUCTURE.md`, page blueprints, SEO rules, and content configuration as the current source of truth.
- Keep reusable copy and links in content files rather than hardcoding them into components.
- Remove dead code once it is no longer on the active route tree.
- Prefer one clear deployment path per host:
  - GitHub Pages uses prefixed static output
  - Vercel uses root-path static output

## Current Quality Baseline

- Gatsby static build with shared layout and page-level JSON content
- Blog sourced from Markdown plus CMS build-time ingestion
- Blog publishing model is static generation plus rebuild on publish
- GitHub Pages deployment workflow already present
- Vercel project configuration present for root-path hosting

## TODO

- Add a CI/CD pipeline for development and production deployments, including preview environments, production promotion rules, and environment-variable validation.
- Add publish-triggered UI rebuild automation from the CMS or deployment platform so published articles roll into production without manual redeploy steps.
- Reduce publish-triggered UI deployments from full-site Gatsby rebuilds to affected-page or incremental rebuilds only when the hosting/runtime stack supports it cleanly.
- Keep SSR or hybrid runtime rendering for the blog as a future architecture option only if no-rebuild publishing becomes a hard requirement.
- Evaluate a future Gatsby-to-Next.js migration if on-demand revalidation becomes the preferred content publishing model.
