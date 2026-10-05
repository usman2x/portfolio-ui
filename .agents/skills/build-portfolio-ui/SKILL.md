---
name: build-portfolio-ui
description: Design, implement, review, or refine the portfolio frontend with strong UI/UX, responsive behavior, accessibility, content hierarchy, and Next.js 16 correctness. Use for page, component, layout, navigation, styling, interaction, SEO, CMS rendering, or frontend performance work in portfolio-ui.
---

# Build Portfolio UI

Create deliberate, accessible interfaces that follow the repository's design and content contracts. Preserve the static-export architecture and verify changes visually as well as technically.

## Establish context

1. Read `AGENTS.md`, `docs/README.md` (documentation map), and the relevant source files.
2. For page, layout, navigation, or visual work, read these documents in order:
   - `docs/style/STYLEGUIDE.md`
   - `docs/structure/STRUCTURE.md`
   - the page doc: `docs/pages/HOME_PAGE.md`, `ABOUT_PAGE.md`, `PROJECTS_PAGE.md`, `ARTICLES_PAGE.md`, `TESTIMONIALS_PAGE.md` or `CONTACT_PAGE.md`
   - `docs/seo/SEO_URLS.md`
   - `docs/content/CONTENT_CONFIGURATION.md`
   - `docs/CMS_INTEGRATION.md` when page data changes
3. Read the relevant Next.js 16 documentation under `node_modules/next/dist/docs/` before relying on framework conventions or APIs.
4. Inspect the CMS adapter in `src/lib/cms.js` before changing CMS-backed page data.
5. Preserve unrelated working-tree changes.

## Resolve conflicts with other design skills

This skill and the documents under `docs/` are the project contract. The installed craft skills (`emil-design-eng`, `apple-design`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-vocabulary`, `mobile-native`, `pick-ui-library`, `prototype`) are advisors for motion craft and mobile behavior only. When they disagree with this project, the project wins:

- **Palette:** never change palette values in `global.css`. Meet contrast through usage tokens (`--brand-text`, `--on-brand`) as described in `docs/style/STYLEGUIDE.md`.
- **Typography:** keep the self-hosted Newsreader, Inter, and IBM Plex Mono roles. Ignore advice to default to the system font.
- **Surfaces:** no translucent or `backdrop-filter` chrome, no deeper or heavier shadows, and no scroll-edge blur masks in place of the header and footer divider lines. The site stays calm and content-led.
- **Dependencies:** do not add Motion, Sonner, cva, or other libraries recommended by `pick-ui-library` or `apple-design` without explicit user approval. Prefer CSS transitions and the Web Animations API.
- **Gestures:** springs, momentum, drag, and sheet guidance applies only if such interactions are deliberately introduced; the site currently has none.
- **Prototypes:** any `prototype` surface must be removed before a commit, because the static export would publish it.

Apply these craft rules, which fit the project:

- Animate only `transform` and `opacity` for motion; keep durations at or below `300ms`; use the easing tokens in `global.css`; never use `ease-in` for UI.
- Give pressable elements `:active` feedback (`scale(0.97)`).
- Gate hover-only movement behind `@media (hover: hover) and (pointer: fine)`.
- Under `prefers-reduced-motion: reduce`, remove movement but keep short color and opacity transitions.
- Use `dvh` instead of `vh` for viewport heights, suppress the tap highlight flash, and keep form inputs at `16px` or larger.

## Apply the design system

The full rules are in `docs/style/STYLEGUIDE.md`; these are the ones most often broken:

- **Tokens:** use the shared scale (`--fs-meta`, `--fs-ui`, `--fs-body`, `--fs-item`, `--fs-section`, `--fs-page-title`, `--fs-display`, `--section-gap`, `--hairline`, the inverse-surface tokens). Do not introduce one-off font sizes, radii or colours.
- **CSS placement:** `src/styles/global.css` is layered: base and legacy rules, then "Phase F" (shared scale, homepage, closing section), "Phase G" (About), "Phase H" (site-wide page rules). Put new page rules in the relevant block or a new labelled block at the end, and delete rules made obsolete by the change rather than overriding them.
- **Titles:** `--fs-display` for Home, About, case studies and articles; `--fs-page-title` for archive and utility pages, using the shared `.page-intro` (eyebrow, title, 20px lead, left-aligned).
- **Surfaces:** no shadows; cards and media are one 1px `--hairline` with 16px corners. Only two tinted or inverse surfaces exist (the `--bg-brand-soft` band and the closing section); text on the band uses main text, never muted.
- **Buttons:** 44px / 15px / 8px corners; 52px only for hero, About intro and closing CTAs. Exactly one orange primary per view; secondary actions are outlined.
- **Focus:** `--brand-text` rings on the page and band (sunset primary is only 2.6:1), `--color-primary` on the inverse surface.
- **Fonts:** role tokens are declared on both `:root` and `.font-root`; if headings render in Georgia, that declaration has been broken.
- **Layout:** every page starts `clamp(3rem, 7vw, 6rem)` below the header and ends a full `--section-gap` above the closing section; nothing may scroll horizontally at 390px (check pseudo-elements and long unbreakable values too).

## Make UI/UX decisions

- Start from the user's goal, the page's primary action, and the intended reading order.
- Reuse established typography, spacing, color, surface, and interaction patterns. Introduce a new pattern only when existing ones cannot express the requirement.
- Keep the visual hierarchy clear at mobile, tablet, and desktop widths.
- Design all meaningful states: loading where applicable, empty, error, long content, missing optional media, keyboard focus, hover, and active.
- Prefer semantic HTML and native interaction behavior. Ensure labels, headings, landmarks, alternative text, focus visibility, keyboard access, and sufficient contrast.
- Avoid ornamental UI that competes with portfolio content. Motion must communicate state, respect reduced-motion preferences, and never block interaction.
- Keep copy and repeated content configurable according to `docs/content/CONTENT_CONFIGURATION.md`.
- Update the corresponding design document when implementation changes the intended experience.

## Implement safely in Next.js

- Treat `output: "export"` in `next.config.js` as a hard constraint. Do not introduce runtime-only server behavior without an explicit architecture change.
- Keep browser-visible CMS URLs separate from build-time API URLs. Never expose secrets through `NEXT_PUBLIC_*` variables.
- Preserve path-prefix handling, trailing slashes, canonical URLs, and unoptimized-image behavior unless the task explicitly changes deployment architecture.
- Keep CMS data normalization inside `src/lib/cms.js`; keep presentation components independent of raw Payload response shapes.
- Handle optional CMS fields defensively while allowing required-content failures to remain visible.
- Use existing components and styles before adding dependencies. Do not add a package merely to avoid a small local implementation.
- Follow the Pages Router patterns already present in this repository unless the requested work includes a deliberate migration.

## Verify the experience

1. Run the narrowest relevant checks, then `npm run build` for changes that affect rendering, routing, data loading, or configuration.
2. Keep the CMS running on port `3001` with seeded content when verifying CMS-backed routes.
3. Inspect affected pages at 1440px and 390px, in the `sunset` and `dark` themes (`data-theme` on `<html>`, persisted as `site-theme` in `localStorage`). Compare against `docs/design/*.reference.html` where one exists.
4. Measure rather than eyeball when consistency matters: computed font family, size and weight, distances from the header, horizontal overflow (`scrollWidth` at 390px), and box shadows. Headless Chrome over the DevTools protocol works when no browser tooling is available.
5. Walk every page with Tab and confirm a visible ring with at least 3:1 contrast against the background behind each control, including on the tinted band and the inverse closing surface.
6. Emulate `prefers-reduced-motion: reduce` and force hover/active states to confirm that movement is removed.
7. Check empty, long-copy, and missing-optional-media cases when the changed component supports them; sections fed by optional CMS fields must disappear cleanly when empty.
8. Confirm the browser console has no new errors (Next.js dev-overlay HMR messages are dev-only) and internal links honor the configured path prefix.
9. Report what was verified and any validation that could not be run.

Dev-server pitfalls:

- If CSS edits do not appear while JavaScript updates, Turbopack's dev cache is stale: stop the server, `rm -rf .next/dev`, restart `npm run develop`. Running `npm run build` alongside the dev server makes this more likely.
- `src/lib/content.js` memoizes the posts request for the life of the process; after a CMS outage, restart, or migration, restart the UI dev server before trusting a 500.

## Coordinate CMS contract changes

When the UI needs a new or changed Payload field:

1. Define the user-facing behavior and fallback.
2. Update the CMS schema, access policy, migration, types, and seed data in `portfolio-cms` using its `develop-portfolio-cms` skill.
3. Update the UI data normalization and rendering.
4. Update `docs/CMS_INTEGRATION.md`, `docs/content/CONTENT_CONFIGURATION.md`, the page doc, and `../portfolio-cms/docs/CONTENT_MODEL.md`.
5. Verify the change against an actually migrated and seeded local CMS.
