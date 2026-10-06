# Documentation

Current reference for the portfolio UI. Every doc here describes the implementation as it is; when
code changes behaviour or layout, update the matching doc in the same change.

## The site in brief

A statically exported Next.js 16 site (React 18, Pages Router) for Muhammad Usman, with all content
from the separate Payload CMS (`../portfolio-cms`). It presents identity, proof and services on the
homepage, a profile and work history on About, case studies, articles, testimonials, and an
intent-led contact wizard. Production runs on one OCI VM: Caddy serves `out/`, and the CMS runs as
a systemd service behind it.

## Reading order for UI work

1. `style/STYLEGUIDE.md`: tokens, type scale, spacing, surfaces, components, motion, accessibility
2. `structure/STRUCTURE.md`: routes, shared layout, closing band and footer, calls to action
3. The page doc in `pages/`
4. `seo/SEO_URLS.md`: routes, metadata, sitemap
5. `content/CONTENT_CONFIGURATION.md`: which CMS field drives what

## Map

| Doc | Covers |
| --- | --- |
| `LOCAL_DEVELOPMENT.md` | PostgreSQL, CMS and UI setup, daily startup, verification, troubleshooting |
| `CMS_INTEGRATION.md` | Build-time fetching, normalization, environment, contract changes |
| `OCI_DEPLOYMENT.md` | Production layout, release flow, deploy script, Caddy, rebuild listener, rollback |
| `style/STYLEGUIDE.md` | Visual system |
| `structure/STRUCTURE.md` | Site structure |
| `seo/SEO_URLS.md` | URL and metadata rules |
| `content/CONTENT_CONFIGURATION.md` | CMS fields and editorial workflow |
| `pages/HOME_PAGE.md` | `/` |
| `pages/ABOUT_PAGE.md` | `/about/` and `/experience/` |
| `pages/PROJECTS_PAGE.md` | `/projects/` and case studies |
| `pages/ARTICLES_PAGE.md` | `/blog/` and articles |
| `pages/TESTIMONIALS_PAGE.md` | `/testimonials/` |
| `pages/CONTACT_PAGE.md` | `/contact/` wizard |
| `design/*.reference.html` | Static visual references for the homepage and About page (open in a browser) |
| `TODO.md` | Deferred cleanup of obsolete code and fields in both repositories |

The CMS repository documents its own schema (`docs/CONTENT_MODEL.md`), local setup and deployment.

## Working standards

- Keep implementation and docs aligned in the same change.
- Keep copy in Payload, not in components (`content/CONTENT_CONFIGURATION.md`).
- Keep raw Payload handling in `src/lib/cms.js`.
- Preserve the static-export model; OCI is the only production target.
- Remove dead code and styles once nothing uses them.
- Verify UI changes at 1440px and 390px, in both themes, with the keyboard and reduced motion, then
  run `npm run build` against a running, seeded CMS.
