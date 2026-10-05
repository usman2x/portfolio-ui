# Home Page

Route: `/` · Page: `src/pages/index.js` · Visual reference: `docs/design/homepage-redesign.reference.html`
(static mock-up; the moon button switches themes).

The homepage has two jobs: win client enquiries and build the personal brand. Its order follows a
prospective client's questions: what do you do, can you deliver, how do we work together, what is
the next step. Testimonials and articles then support trust and branding.

## Section order

| # | Section | Component | Surface |
| --- | --- | --- | --- |
| 1 | Header | `Header.js` | page, bottom hairline |
| 2 | Hero | `HomeIdentity.js` | page |
| 3 | Proof strip | `HomeProof.js` | page, top hairline |
| 4 | Selected work (`#projects`) | `SelectedProjects.js` | page |
| 5 | Ways to work together (`#services`) | `HomeServices.js` | full-bleed `--bg-brand-soft` band with hairlines |
| 6 | Testimonial | `Testimonials.js` (`variant="home"`) | page |
| 7 | Articles (`#articles`) | `LatestWritings.js` | page |
| 8 | Closing CTA + footer | `BookCallSection.js` + `Footer.js` (from `Layout`) | inverse surface, site-wide |

Sections are `--section-gap` (80–128px) apart. Styles live in the "Phase F" block of
`src/styles/global.css`; type, spacing and surface rules are in `docs/style/STYLEGUIDE.md`.

## 1. Header

- Logo image and name only; no tagline under the name.
- Navigation from **Site Settings → Navigation**. The item marked `isPrimary` ("Book a Call")
  renders as an outlined button so the hero holds the only orange primary in view.
- Theme toggle before the navigation; the mobile menu toggle is unchanged.

## 2. Hero

- Eyebrow (mono meta), headline (`--fs-display`, max 21ch) and supporting text (20px lead) from
  **Home Page**.
- Buttons: `primaryCtaLabel` (primary, 52px, opens **Site Settings → Meeting Link**) and
  `secondaryCtaLabel` (outline, links to `/#projects`).
- `primaryCtaNote` renders as one 15px muted line under the buttons; hidden when empty.
- Portrait unit (portrait, name, professional title) links to `/about/`: 4:5 crop, 28px corners,
  offset `--bg-brand-soft-strong` block, in a 260px column. On phones it collapses into a compact
  row above the headline.
- There is no trust-chip list; the proof strip carries that evidence.

## 3. Proof strip

- **Home Page → Proof**: up to four `proofStats` (value + label) and `proofCompanies` with a
  `proofTitle` label. Hidden when both lists are empty.
- Grid `repeat(auto-fit, minmax(140px, 1fr))`: two columns on phones, four on desktop. Values use
  `--fs-stat` and may wrap (e.g. `10% → 80%`) instead of overflowing.

## 4. Selected work

- Title `projectsTitle` with one `projectsArchiveLabel` link to `/projects/`.
- Up to three **Home Page → Featured projects** (posts tagged `case-study`).
- Each card is one link: 16:10 image → role (mono) → title (`--fs-item`) → summary (muted) →
  hairline → **Outcome:** from the post's `projectOutcome` (row hidden when empty). No tags.
- Media lifts 3px on fine pointers only; none under reduced motion.

## 5. Ways to work together

- Heading `servicesTitle` and one sentence `servicesDescription` on the left; an empty title or no
  services hides the whole section.
- Cards come from the **Services** collection: published, `showOnHome`, ordered by `sortOrder`,
  limited by `servicesLimit`. Each card shows a `01`/`02` index, title, summary, optional
  highlights and its `ctaLabel`.
- The whole card links to `/contact/?intent=<contactIntent>`; the contact wizard preselects that
  intent. `contactIntent` must match a Contact page help-type value.
- White (`--bg-card`) cards on the tinted band; copy on the band uses main text, never muted.
- Two services sit beside the heading; with three or more, the heading spans the row and the
  cards form one row below it (stacking on phones).

## 6. Testimonial

- Title (`testimonialsTitle`) and one `testimonialsArchiveLabel` link on the left; the quote on
  the right (`--fs-quote` italic). Stacks on phones.
- Shows the first featured, published testimonial by `sortOrder` (`testimonialLimit`, default 1).
- The quote is cut at the last word boundary before 260 characters; the homepage has no expand
  button.
- When the testimonial has a LinkedIn `sourceUrl`, the source link reads "Read on LinkedIn";
  otherwise the plain `sourceLabel` is shown.

## 7. Articles

- Title `writingsTitle`, one line `writingsDescription`, one `writingsArchiveLabel` link to
  `/blog/`.
- The latest `writingsLimit` (default 2) published articles, newest first.
- Each article is one row link with hairline separators: `date · N min` (mono, 200px column),
  title and summary, arrow on the right (`↗` for external articles). Row hover uses
  `--bg-brand-soft` and nudges the arrow 4px (not under reduced motion). No tags.

## 8. Closing section and footer

Site-wide; see "Closing section" in `docs/structure/STRUCTURE.md`.

## Content

All copy comes from the **Home Page** and **Site Settings** globals, the **Services**,
**Testimonials** and **Posts** collections. Field reference: `docs/content/CONTENT_CONFIGURATION.md`.
