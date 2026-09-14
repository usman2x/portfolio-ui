# Engineering Excellence

This document records the working standards for the UI repository and a short backlog of engineering-quality improvements.

## Standards

- Keep implementation and documentation aligned in the same change.
- Treat `docs/style/STYLEGUIDE.md`, `docs/structure/STRUCTURE.md`, page blueprints, SEO rules, and content configuration as the current source of truth.
- Keep reusable copy and links in content files rather than hardcoding them into components.
- Remove dead code once it is no longer on the active route tree.
- Keep OCI VM deployment as the single production path.

## Current Quality Baseline

- Next.js static export with shared layout and Payload-managed content
- Blog sourced from Markdown plus CMS build-time ingestion
- Blog publishing model is static generation plus rebuild on publish
- OCI deployment script updates the CMS and UI in the required order
- Caddy serves the generated static UI directly from the VM

## TODO

- Complete and validate the loopback-only publish-triggered UI rebuild service on OCI.
- Reduce publish-triggered UI deployments from full-site static rebuilds to affected-page or incremental rebuilds only when the hosting/runtime stack supports it cleanly.
- Keep SSR or hybrid runtime rendering for the blog as a future architecture option only if no-rebuild publishing becomes a hard requirement.
