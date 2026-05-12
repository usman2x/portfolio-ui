# Design Document v1: Portfolio + Blog on GitHub Pages

## 1. Objective
Design a maintainable architecture for a personal portfolio + blog where:
- only one author manages content (you),
- visitors can share posts,
- images stay in the repo,
- Git-based CMS is used,
- SEO remains equivalent to current implementation,
- UI is consistent and themed,
- site is hosted on GitHub Pages.

## 2. Scope
In scope:
- content authoring architecture,
- build/deploy flow,
- engagement features (shares and related reader actions),
- UI/theming consistency model,
- Gatsby image/performance improvements while keeping repo images.

Out of scope:
- redesigning copy/content itself,
- migrating away from Gatsby,
- adding server-managed personalization.

## 3. Constraints and Assumptions
- Hosting target: GitHub Pages (`gh-pages` branch).
- Runtime: static site only (no custom Node server on host).
- Single content editor/author.
- Existing SEO stack should be preserved (canonical/meta/sitemap/robots).
- Minimal recurring cost (prefer free tools).

## 4. Proposed Architecture

### 4.1 High-level
1. `Gatsby` remains SSG rendering layer.
2. `Markdown + JSON in repo` remain source of truth.
3. `Git-based CMS`: Decap CMS as admin UI for editing content in-repo.
4. `Engagement`: lightweight post-share and CTA actions.
5. `Sharing`: native Web Share + fallback social share links.
6. `Analytics`: keep current GA setup for engagement events.

### 4.2 Why this fits the constraints
- Full content ownership: all content remains in Git repo.
- Free hosting path: GitHub Pages.
- Single-author workflow is simple and robust.
- No DB required for reader interaction.

## 5. Content and Authoring Model

### 5.1 Content structure
- Blog posts: `src/content/blog/*.md`
- Blog post images: `src/content/blog/images/<slug>/...`
- Site section content: `src/content/misc/*.json`

### 5.2 Frontmatter standard for blog posts
Each post must include:
- `title`
- `date`
- `slug`
- `description`
- `tags`
- `cover` (relative image path in repo)

Example:
```md
---
title: "Post title"
date: "2026-03-05"
slug: "post-title"
description: "One-line summary for SEO and cards."
tags: ["tag1", "tag2"]
cover: "./images/post-title/cover.jpg"
---
```

### 5.3 Git-based CMS choice
Recommended: `Decap CMS` (admin UI served from `/admin`).

Important note for GitHub Pages:
- Decap with GitHub backend needs OAuth handling.
- Use a lightweight OAuth proxy (for example Cloudflare Worker) or keep authoring local via Git commits.

Single-author fallback (simplest):
- Use local markdown editing + PRs to `main`.
- Keep Decap as optional phase 2.

## 6. Engagement Features

### 6.1 Share
Add share actions on post page:
- Native `navigator.share()` if available.
- Fallback links for X, LinkedIn, and copy-link.

Track events:
- `share_click`
- `cta_click`

## 7. SEO Strategy (Keep same baseline)

Keep current SEO approach intact:
- existing `SEO` component (`react-helmet`),
- canonical URL per page/post,
- sitemap and robots plugins.

Enhancements that do not change baseline:
- require `description` per post,
- add Open Graph image from `cover`,
- add `BlogPosting` JSON-LD in post template.

## 8. UI and Theming Consistency

### 8.1 Design system decision
Choose one styling paradigm and stick to it.

Recommended for this codebase:
- Keep Bootstrap layout utilities.
- Add a tokenized custom theme layer in `global.css`.
- Remove mixed/unused Tailwind-style classes over time.

### 8.2 Theme tokens
Define CSS variables in `:root`:
- color palette (`--bg`, `--surface`, `--text`, `--primary`, `--muted`)
- spacing scale (`--space-1..--space-6`)
- radius/shadow scale
- typography sizes (`--font-xs..--font-2xl`)

Apply tokens to:
- Header, buttons, cards, links, section headings, footer.

### 8.3 Component consistency targets
- Single button style family (`primary`, `secondary`, `ghost`)
- Uniform card structure for projects/blog items
- Consistent section spacing and max widths
- Accessible contrast and visible focus states

## 9. Gatsby Image Improvements (Keep images in repo)

### 9.1 Current issue
Large and static assets are currently loaded via plain `<img>` and CSS backgrounds, bypassing Gatsby optimization.

### 9.2 Required changes
1. Move major visual assets from `static/images` to `src/images` or `src/content/...` where queryable.
2. Use `gatsby-plugin-image`:
   - `StaticImage` for fixed static assets.
   - `GatsbyImage` for queried images (project cards/blog covers/profile image).
3. Replace CSS hero background image with optimized Gatsby image component.
4. For markdown images, configure remark image processing in Gatsby pipeline.

### 9.3 Expected outcome
- Better LCP and smaller payload.
- Responsive images per device width.
- AVIF/WebP generation handled at build.

## 10. Build and Deployment Flow

### 10.1 Flow
1. Author content (CMS or local markdown).
2. Commit to `main`.
3. GitHub Action builds Gatsby.
4. Deploy to `gh-pages`.

### 10.2 Environments
- Local: `npm run develop`
- Production build test: `npm run build && npm run serve`
- Hosted: GitHub Pages + custom domain.

## 11. Operational Best Practices
- Keep media naming deterministic: `<slug>-cover.<ext>`.
- Compress source images before commit (target ~200KB to 500KB for covers).
- Use branch + PR review even for solo workflow for rollback safety.
- Run `gatsby clean` when image/content schema changes.
- Keep plugin list minimal and remove unused dependencies.

## 12. Implementation Plan

### Phase 1 (foundation)
1. Add theme tokens and unify core UI styles.
2. Migrate hero/profile/project images to Gatsby image components.
3. Standardize blog frontmatter fields (`description`, `cover`).

### Phase 2 (engagement)
1. Add share component with event tracking.
2. Add post-level CTA blocks.

### Phase 3 (authoring UX)
1. Add Decap admin and config.
2. Add GitHub OAuth proxy for Decap (if browser editing is required).
3. Document publish workflow in README.

## 13. Risks and Mitigations
- Risk: Decap GitHub auth setup complexity on GitHub Pages.
  - Mitigation: start with local markdown workflow; add OAuth proxy later.
- Risk: Slow build as image volume grows.
  - Mitigation: image size policy + incremental maintenance.

## 14. Acceptance Criteria
- Blog updates are manageable by one author with Git workflow.
- Share actions are available on each post.
- SEO metadata behavior remains equivalent to current baseline.
- UI is visually consistent across pages.
- GitHub Pages deployment remains the production path.
