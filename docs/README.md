# Planning Docs

This folder contains the active planning and implementation reference docs for site structure, style, SEO, and content modeling.

## Reading Order
Before implementing a page or layout change, use this order:
1. `docs/style/STYLEGUIDE.md`
2. `docs/structure/STRUCTURE.md`
3. page-specific doc in `docs/pages/`
4. `docs/seo/SEO_URLS.md`
5. `docs/content/CONTENT_CONFIGURATION.md`

## Folder Map
- `docs/style/`
  - visual language and minimal design rules
- `docs/structure/`
  - overall site architecture and section hierarchy
- `docs/pages/`
  - page-level blueprints for Home, About, Projects, Writings, and Quote
- `docs/seo/`
  - route, slug, canonical, and page SEO conventions
- `docs/content/`
  - content modeling and configuration rules
- root docs
  - implementation audits, integration notes, architecture briefs, and engineering standards

## Active Docs
- `docs/style/STYLEGUIDE.md`
- `docs/structure/STRUCTURE.md`
- `docs/pages/LANDING_PAGE.md`
- `docs/pages/ABOUT_PAGE.md`
- `docs/pages/PROJECTS_PAGE.md`
- `docs/pages/WRITINGS_PAGE.md`
- `docs/pages/QUOTE_PAGE.md`
- `docs/seo/SEO_URLS.md`
- `docs/content/CONTENT_CONFIGURATION.md`
- `docs/UI_PROJECT_BRIEF.md`
- `docs/ENGINEERING_EXCELLENCE.md`
- `docs/BLOG_UI_UX_AUDIT.md`
- `docs/PAYLOAD_CMS_BLOG_INTEGRATION.md`
- `docs/PAYLOAD_CMS_REPO.md`
- `docs/GATSBY_BLOG_PAYLOAD_INTEGRATION.md`

## Usage Rule
- Treat these docs as implementation constraints, not optional notes.
- If code changes conflict with these docs, update the relevant doc in the same change.
- Keep content configurable when `docs/content/CONTENT_CONFIGURATION.md` says it should live in content files.
