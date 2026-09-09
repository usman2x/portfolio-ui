# Repo Guidance

## Planning Docs
- Keep planning, architecture, and page blueprint docs under `docs/`, not the repo root.
- Before implementing page, layout, or navigation changes, read the relevant docs in this order:
  1. `docs/style/STYLEGUIDE.md`
  2. `docs/structure/STRUCTURE.md`
  3. page-specific doc in `docs/pages/`
  4. `docs/seo/SEO_URLS.md`
  5. `docs/content/CONTENT_CONFIGURATION.md`

## Implementation Rules
- Treat the docs in `docs/` as the active source of truth for structure, style, SEO, and content modeling.
- If implementation changes the intended behavior or layout, update the corresponding doc in the same change.
- Keep copy, labels, and repeated page content configurable where practical; do not hardcode content in components when a shared content file is more appropriate.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
