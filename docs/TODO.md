# TODO: obsolete code cleanup

Deferred work, not scheduled. Each item is safe to do on its own; verify with the routine in
`.agents/skills/build-portfolio-ui/SKILL.md` and `npm run build` in both repos.

Design inconsistencies across pages (page intros, list patterns, detail pages, testimonials,
page endings) are tracked separately in `docs/style/DESIGN_CONSISTENCY.md`.

## UI (`portfolio-ui`)

- [ ] **Unused CSS in `src/styles/global.css`** (about 5,250 lines). Classes with no JSX usage:
      `.writing-preview-card`, `.preview-meta`, `.landing-section-surface-brand`, `.preview-card`,
      `.preview-card-title`, `.info-card`, and the legacy button aliases `.btn-primary`,
      `.btn-outline-theme`, `.btn-outline-primary`, `.btn-light`, `.btn-outline-light`,
      `.theme-btn-outline-light`, `.theme-btn-lg`, `.btn-lg-theme`, `.btn-sm-theme`. Remove them.
- [ ] **Overridden legacy rules.** Phases F, G and H override earlier rules instead of replacing
      them (`.page-title` is defined three times, plus `.landing-section-title`,
      `.testimonial-card`, `.writings-page-header` centring, `.quote-aside-card` / `.quote-form-section` shadows, the
      40px button rules). Fold each component into one rule set and drop the dead declarations.
- [ ] **Contact compatibility shims in `src/lib/cms.js`** (`fetchQuotePage` rewrites "Get a
      Quote" copy; `fetchSiteSettings` maps `/quote/` navigation). Remove once production content
      no longer contains the old values.
- [ ] **`/quote/` legacy redirect** (`src/pages/quote.js`): remove when no inbound links remain.
- [ ] **Naming:** `WritingLink`, `LatestWritings`, `src/lib/writings.js` and the `writing-*` CSS
      classes predate the "Articles" rename. Rename together with the CMS `writings*` fields.
- [ ] **Hardcoded copy in `src/pages/contact.js`:** intent descriptions ("Tell me about a product,
      platform, or engineering need.") and compatibility defaults live in code; move them to the
      Contact page global. The "Project or services" description should mention the technical
      co-founder option.
- [ ] **Posts cache:** clear the memoized promise in `src/lib/content.js` when the request fails,
      so a dev server recovers after a CMS outage without a restart.

## CMS (`portfolio-cms`)

- [ ] **Fields stored but not rendered:** Site Settings `shortLabel`; Home Page `postHeroLine`,
      `testimonialsEyebrow`, `testimonialsDescription`; About Page `video.eyebrow`; Archive
      Settings `writingCtaLabel` and `readArticleLabel`; Posts `externalCtaLabel` (unused since the
      archive moved to `ArticleRow`). Remove with a reviewed migration (it drops columns, so back up
      first) and update `seed-data.mjs`.
- [ ] **Legacy names:** `quote-page` / `quote-requests` (labelled Contact) and the `writings*`
      fields on Home Page and Archive Settings. Renaming changes the public API, so coordinate with
      `src/lib/cms.js`.
- [ ] **Seed never deletes:** records removed from `seed-data.mjs` (for example the two original
      services) stay in existing databases. Consider an explicit, opt-in prune step.
- [ ] **Unused project inputs:** `scripts/core-content/case-studies/` and `core-content/images/`
      duplicate `../portfolio/projects/`; consider seeding case studies and galleries directly from
      that source with its frontmatter (gallery alt text and captions).

## Content (`../portfolio`)

- [ ] **Unpublished case studies:** `projects/safar-e-khudi` (complete, `order: 12`) and the drafts
      `projects/mandione` and `projects/second-brain` exist in the content repo but are not on the
      site. Held back on 2026-10-06. To publish one, add it to `rawPosts` and `projectEnhancements`
      in `portfolio-cms/scripts/seed-data.mjs`, copy its body to `scripts/core-content/case-studies/`
      and its images to `scripts/core-content/images/`.
- [ ] **Cover images:** Banking-as-a-Service and Error Reprocessing Tool keep the placeholder tile
      (decided 2026-10-06); their only visuals are `.drawio` sources.
