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
- GitHub Pages deployment workflow already present
- Vercel project configuration present for root-path hosting

## TODO

- Add a CI/CD pipeline for development and production deployments, including preview environments, production promotion rules, and environment-variable validation.
