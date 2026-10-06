# Style Guide

The target visual system for every page, and the single source of truth for design decisions.
Tokens live in `src/styles/global.css`: palette and theme tokens at the top, the shared scale in
the "Phase F" block, About-specific rules in "Phase G", and site-wide page rules in "Phase H".

Home and About already follow this guide. Where another page still differs, the rule is marked
**Migrating** with the item in `docs/style/DESIGN_CONSISTENCY.md` that brings it in line. Remove
the marker in the same commit that ships the item. New work follows the target, never the
legacy pattern.

## Direction

- Calm, content-led and minimal: typography, spacing and hierarchy carry the design.
- One moment of emphasis per section; colour creates focus, not decoration.
- Quiet is not flat: the homepage opens with large display type and concrete proof.

## Principles

Backlog items and reviews refer to these by number.

- **P1 Rhythm.** Sections are `--section-gap` (80–128px) apart, always more than the space inside
  a section. Inside items: 8 / 12 / 16px.
- **P2 One intro pattern.** Title, then one intro sentence. A small label above the title only
  when it adds meaning. No label + title + description stacks.
- **P3 Fewer containers.** Spacing and hairlines separate things; boxes only for media frames and
  real controls (form fields, options).
- **P4 One emphasis per view.** One orange primary button per view; the orange-underlined text
  link (`.text-link-cta`) is for forward calls to action, at most one per section.
- **P5 One list pattern per content type.** Projects and articles look the same wherever they are
  listed.
- **P6 Monospace is for data.** Dates, reading time, roles and periods. Not for section labels,
  helper text or headings.
- **P7 Each page ends with one next step that belongs to it.** The footer holds navigation and
  contact details only.
- **P8 Sentence case** for headings, buttons and links (proper nouns excepted).

## Themes

- `sunset` (light, default) and `dark`, set as `data-theme` on `<html>`.
- The first visit follows the operating-system preference; the header toggle overrides it and is
  remembered in `localStorage` (`site-theme`).
- Components use semantic tokens only, never raw hex values.

## Palette

The palette is fixed. Contrast is met through how colours are used, never by changing values.

| Token | sunset | dark |
| --- | --- | --- |
| `--color-primary` / `--brand-primary` | `#E97A3C` | `#F19A64` |
| `--color-secondary` | `#F2B38A` | `#BF8F72` |
| `--color-accent` | `#6F8798` | `#8EA8BB` |
| `--bg-page` | `#F7F3EE` | `#171514` |
| `--bg-card` | `#FFFFFF` | `#221F1D` |
| `--text-main` | `#2F2F2F` | `#F7F3EF` |
| `--text-muted` | `#6B6B6B` | `#D1C8C1` |
| `--border-default` | `#C9C3BD` | `#3D3733` |

Derived tokens:

- `--brand-text`: main text in sunset, primary in dark. Use it for text or rings that should carry
  brand emphasis.
- `--on-brand`: label colour on filled primary buttons.
- `--bg-brand-soft` (8% primary) and `--bg-brand-soft-strong` (14%): tinted band and portrait
  offset block.
- `--hairline`: `color-mix(--border-default 70%, transparent)` in sunset, `--border-default` in dark.
- Closing band: `--surface-closing` (`#493A31` / `#3F3027`), the inverse surface mixed with 14%
  primary. On it `--on-inverse` is 9.8:1 / 11.4:1, `--on-inverse-muted` 6.6:1 / 7.7:1 and the
  orange button 3.8:1 / 5.7:1; against the footer it is 1.23:1 / 1.3:1 plus a warmer hue.
- Inverse footer surface: `--surface-inverse` (`#2F2F2F` / `#221F1D`), `--on-inverse`,
  `--on-inverse-muted` (`#D1C8C1`), `--inverse-line`.

### Contrast (required)

- Every text pair meets WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text (24px, or 19px bold),
  UI boundaries and focus indicators. Check new pairs in both themes before merging.
- Sunset primary is 2.6:1 on the page, so in light mode it is only for fills, underlines, borders,
  indicators and tints, never text or focus rings.
- Muted text fails on the 8% tint in sunset (4.48:1); text on tinted bands uses main text.
- Focus rings: 3px `--brand-text` on the page, cards and tinted band; `--color-primary` on the
  inverse surface.

## Typography

Three faces, self-hosted by `next/font` in `src/pages/_app.js`, each with one job:

| Role | Face | Use |
| --- | --- | --- |
| Display / section / quote | Newsreader (optical sizes) | page titles, section titles, proof values, quotes (italic) |
| Body / item | Inter | running text, summaries, card titles (600), navigation, buttons |
| Meta | IBM Plex Mono | dates, reading time, periods, roles (uppercase, 0.06em) |

`next/font` defines the face variables (`--font-serif`, `--font-sans`, `--font-mono-face`) on the
`.font-root` wrapper. The role tokens (`--font-heading`, `--font-body`, `--font-mono`) are declared
on both `:root` and `.font-root`; declared only on `:root` they silently fall back to Georgia and
system fonts.

### Scale

| Token | Size | Line height | Use |
| --- | --- | --- | --- |
| `--fs-meta` | 13px | 1.3 | dates, reading time, periods, roles |
| `--fs-ui` | 15px | 1.45 | navigation, buttons, captions, CTA links, footer |
| `--fs-body` | 17px | 1.6 | summaries, card and section copy |
| lead | 20px | 1.6 | page-intro and hero paragraphs |
| `--fs-item` | 22px | 1.3 | card, service, role and article titles (Inter 600) |
| prose headings | 24–28px | 1.25 | `h2` inside article and case-study bodies |
| `--fs-quote` | 22–28px | 1.45 | testimonials (Newsreader italic) |
| `--fs-section` | 30–40px | 1.12 | section titles (Newsreader 500) |
| `--fs-stat` | 36–44px | 1 | proof values |
| `--fs-page-title` | 36–48px | 1.08 | archive and utility page titles |
| `--fs-display` | 40–60px | 1.04 | Home, About, case-study and article titles (Newsreader 600) |

- Home and About are the most prominent pages; archive and utility pages (Projects, Articles,
  Testimonials, Contact, 404, Thank-you) use `--fs-page-title`.
- Headings use `text-wrap: balance`; display titles are capped at 21–22ch, paragraphs at 52–62ch.
- Monospace is for data only (P6): never labels, eyebrows, helper text, sentences or headings.
  **Migrating:** mono labels remain on Contact (items 7, 9). Detail pages, Testimonials and the
  Articles filter use sans labels.
- `--fs-h1` is the older `.page-title` size; `--fs-page-title` supersedes it. **Migrating:** retire
  `--fs-h1` with item 2.

## Spacing

- 8px grid (4 and 12 allowed for tight pairs).
- `--section-gap` (80–128px) between sections, always larger than the space inside a section.
- Page top: `clamp(3rem, 7vw, 6rem)` above the first heading on every page.
- Section heading to content: 40–48px. Inside an item: 8px meta→title, 12px title→summary,
  16px summary→outcome.
- Every page ends a full `--section-gap` above its closing band, which sits directly on the
  footer. The band's top margin is the only space below the last section. Pages without the band
  end a full `--section-gap` above the footer.
- Container: `.container`, 1120px max including 20px side padding (15px on phones). Every section
  shares this edge.

## Surfaces

- No box shadows anywhere.
- Cards and media: one 1px `--hairline`, 16px corners. Hover warms the border toward
  `--brand-primary`; media may lift 3px on fine pointers only.
- Boxes only for media frames and real controls (P3). Lists, quotes, author details and
  navigation sit on the page, separated by spacing and hairlines.
- Three surfaces besides the page:
  - **Tinted band** (`--bg-brand-soft`, full-bleed, hairlines top and bottom): homepage services
    and the About testimonial. Cards on it are `--bg-card`.
  - **Closing band** (`--surface-closing`, full-bleed, padding-block `clamp(64px, 7vw, 96px)`,
    the last block of `<main>`, directly on the footer): the page's one closing call to action,
    in `--on-inverse` / `--on-inverse-muted`, focus rings `--color-primary`. Not on Contact,
    Thank-you or 404.
  - **Inverse footer** (`--surface-inverse`): navigation and contact details only, never a call
    to action.
- No gradients or large saturated blocks.

## Components

### Page intro

Title at `--fs-page-title`, then one 20px muted lead sentence (max 56ch), left-aligned
(`.page-intro`, P2). A label above the title only when it adds meaning. Used by Projects, Articles,
Testimonials, Experience, Contact, 404 and Thank-you. Home, About, case studies and articles have
their own intros with the same rhythm at `--fs-display`.

**Migrating:** Testimonials and Contact still show an eyebrow label, and Experience has no page
intro (item 2).

### Buttons

- `.theme-btn-primary` (filled) and `.theme-btn-outline`: 44px tall, 15px, 8px corners.
- Large, 52px / 16px / 10px corners: hero, About intro and closing CTAs only.
- One orange primary per view (P4). Secondary actions (header "Book a call", load more, back to
  home) are outlined.
- Sharing is a quiet list of text links (`ShareActions`), never buttons.
- Press feedback `scale(0.97)`, removed under reduced motion.

### Links

- `.text-link-cta`: main text with a persistent 2px `--brand-primary` underline, identifiable
  without colour. Forward calls to action only ("All articles", "Download full CV"), at most one
  per section (P4).
- Navigation links reveal a primary underline on hover and focus; the active page keeps it.
- Back links are quiet (`BackLink`): `--fs-ui`, `--text-muted`, "← All projects", underlined on
  hover only.

### Tags

Pill chips: card background, muted text, hairline border, plain words, never prefixed with `#`.
Tags appear only where they do a job: the Articles topic filter. Cards and rows show no tags.

Case-study headers show role and outcome instead of tags.

### Cards in use

One pattern per content type, everywhere it is listed (P5):

- **Project card** (`ProjectCard`, `.home-work-*`, inside `.home-work-grid`): no outer box; 16:10
  media frame, role, title, summary, outcome (`projectOutcome`, hidden when empty). The whole card
  is the link; no tags, no per-card CTA. Used on Home and `/projects/`.
- **Article row** (`ArticleRow`, `.home-article-*`, inside `.home-articles-list`): meta, title +
  summary, arrow, hairline separators. The whole row is the link. Used on Home and `/blog/`.
- **Service card**: `--bg-card` box on the tinted band; the whole card is a link.
- **Quote**: unboxed Newsreader italic at `--fs-quote`, caption with an initial avatar.
- **Previous / next and "Keep reading"**: the project card or article row with a plain-text
  direction label.

The Testimonials page lists quotes in this unboxed form (`TestimonialList`).

## Motion

- Animate only `transform` and `opacity`, at most 300ms, with the easing tokens in `global.css`.
- Hover movement only under `@media (hover: hover) and (pointer: fine)`.
- Under `prefers-reduced-motion: reduce` movement is removed; short colour changes remain.
- Scroll-linked indicators (the article reading progress bar, the About experience rail) update
  `transform` directly once per `requestAnimationFrame`, without transitions, and are static under
  reduced motion.

## Accessibility

- Semantic landmarks, one `h1` per page, a visible focus ring on every interactive element.
- Touch targets at least 44px; form inputs at least 16px.
- No horizontal scroll at 390px.
- Verify changes at 1440px and 390px in both themes, with the keyboard and with reduced motion.
