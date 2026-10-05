# Homepage Redesign Spec

Implementation spec for the homepage redesign. The target look is
`docs/design/homepage-redesign.reference.html`: open it in a browser (the moon button switches
themes). It is a reference, not production code; build with the existing components, Tailwind
setup and `global.css` tokens.

When this ships, fold the decisions below into `docs/pages/LANDING_PAGE.md` and
`docs/style/STYLEGUIDE.md` (AGENTS.md: docs change with the code).

## Goals

The homepage has two jobs: win client enquiries and build the personal brand. A prospective
client scans for four answers, in this order:

1. What do you do, and for whom? → hero
2. Can you deliver? → proof strip, selected work with outcomes
3. How do we work together? → services (new)
4. What's the next step? → one clear "Book a call", repeated only at the hero and the close

Testimonials and articles support trust and branding after that.

## Section order

| # | Section | Component | Surface |
| --- | --- | --- | --- |
| 1 | Header | `Header.js` | `bg-page`, bottom hairline |
| 2 | Hero | `HomeIdentity.js` | `bg-page` |
| 3 | Proof strip | `HomeProof.js` | `bg-page`, top hairline |
| 4 | Selected work | `SelectedProjects.js` | `bg-page` |
| 5 | Ways to work together | new `HomeServices.js` | full-bleed `bg-brand-soft`, hairlines top and bottom |
| 6 | Testimonial | `Testimonials.js` | `bg-page` |
| 7 | Articles | `LatestWritings.js` | `bg-page` |
| 8 | Closing CTA + footer | `BookCallSection.js` + `Footer.js` | one inverse surface (below) |

Selected work moves above articles: the hero's claims need evidence before the reading list.

## Type scale

The current `global.css` has 56 font sizes and 24 line heights. Replace the homepage's sizes
with this scale and map the existing `--fs-*` tokens onto it (sizes are desktop maxima; fluid
values for headings are given):

| Token | Size | Line height | Face | Use |
| --- | --- | --- | --- | --- |
| `--fs-meta` | 13px (0.8125rem) | 1.3 | Plex Mono 500, uppercase, 0.06em | eyebrow, dates, role lines, labels |
| `--fs-ui` | 15px (0.9375rem) | 1.45 | Inter | nav, buttons, captions, stat labels, CTA links, footer |
| `--fs-body` | 17px (1.0625rem) | 1.6 | Inter 400 | summaries, card and section copy |
| `--fs-lead` | 20px (1.25rem) | 1.6 | Inter 400 | hero supporting paragraph |
| `--fs-item` | 22px (1.375rem) | 1.3 | Inter 600, -0.011em | project, service and article titles |
| `--fs-quote` | clamp(1.375rem, 1vw + 1rem, 1.75rem) | 1.45 | Newsreader italic 400 | testimonial |
| `--fs-h2` | clamp(1.875rem, 1.6vw + 1.3rem, 2.5rem) | 1.12 | Newsreader 500, -0.015em | section titles |
| `--fs-stat` | clamp(2.25rem, 1.5vw + 1.5rem, 2.75rem) | 1 | Newsreader 500, -0.02em | proof values |
| `--fs-display` | clamp(2.5rem, 2.9vw + 1.6rem, 3.75rem) | 1.04 | Newsreader 600, -0.025em | hero headline only, max-width 21ch |

- The closing CTA title is the one exception: clamp(2.125rem, 2vw + 1.5rem, 3rem).
- The reference still uses a few off-scale sizes (14px pills and copyright, 16px header name and
  large buttons, 18px closing paragraph). Fold them into `--fs-ui` / `--fs-body`.
- Monospace is for short labels and dates only. Tags leave the homepage (they stay on case-study
  and archive pages).
- Text measure: paragraphs max 52–60ch.

## Spacing

Everything on the homepage sits on an 8px grid (4 and 12 allowed for tight pairs). Suggested
steps, as `--space-*` tokens: 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 96, 128px.

| Relationship | Value |
| --- | --- |
| Between sections | clamp(80px, 9vw, 128px) |
| Hero top / bottom | clamp(48px, 7vw, 96px) / clamp(56px, 6vw, 80px) |
| Section heading → content | 40–48px |
| Grid gaps | 32px columns, 56px rows (work), 24px (service cards) |
| Inside an item | 8px meta→title, 12px title→summary, 16px summary→outcome |
| Hero: headline → paragraph → buttons → note | 24 / 40 / 16px |
| Container | 1120px max, 24px side padding, every section on the same edge |

The key fix: the space between sections (currently 2rem) must be clearly larger than the space
inside them.

## Surfaces, borders and shadows

- No box shadows on homepage content. Remove `--shadow-sm` from preview cards here.
- Cards and media use a 1px hairline: `color-mix(in srgb, var(--border-default) 70%, transparent)`
  in sunset, `--border-default` in dark. Hover warms the border toward `--brand-primary`; work
  media lift 3px on fine pointers only, none under reduced motion.
- Only two section surfaces besides the page:
  - **Services band:** `--bg-brand-soft`, full-bleed, with white (`--bg-card`) cards on it.
    (Measured: the 8% tint alone is 1.08:1 against the page, so it needs the hairlines and white
    cards to read as a section.)
  - **Closing surface (new tokens, palette values only):**

    | Token | sunset | dark |
    | --- | --- | --- |
    | `--surface-inverse` | `#2f2f2f` | `#221f1d` |
    | `--on-inverse` | `#f7f3ee` | `#f7f3ef` |
    | `--on-inverse-muted` | `#d1c8c1` | `#d1c8c1` |
    | `--inverse-line` | `rgba(247, 243, 238, 0.16)` | `#3d3733` |

    On it, focus rings use `--color-primary` (the default `--brand-text` ring is invisible on ink
    in sunset). The primary button keeps `--on-brand` on `--brand-primary`.
- Drop the warm footer tint and the hairline-bordered book-call band.

## Section specs

### 1. Header
- Logo image + name only (drop the "Engineering journal and selected work" line from the header).
- Nav comes from Site Settings → Navigation. Suggested: About, Projects, Articles, Contact (Testimonials in the footer only).
- Theme toggle, then **Book a call as an outline button** (`theme-btn-outline`). The orange
  primary appears once per view.
- Keep the existing mobile menu toggle; the reference shows the nav wrapping only because it's
  static.

### 2. Hero (`HomeIdentity.js`)
- Eyebrow, headline, supporting text: unchanged CMS fields, new sizes.
- **Remove the trust-chips list** (it repeats the proof strip; LANDING_PAGE.md already says the
  strip replaces it).
- Buttons: `Book a call` (primary, 52px tall) and `See selected work` (outline, links to `#work`).
- New note under the buttons, 15px muted: "A focused call to discuss the problem, delivery
  constraints, and a practical next step." Make it a CMS field (`primaryCtaNote`).
- Portrait unit unchanged in structure (portrait + name + title link to /about); 4:5 crop,
  28px radius, offset `--bg-brand-soft-strong` block. Keep the existing mobile collapse into a
  compact row above the headline.

### 3. Proof strip (`HomeProof.js`)
- Unchanged content. Grid `repeat(auto-fit, minmax(140px, 1fr))` so phones get two columns.
- Values `--fs-stat`, labels `--fs-ui` muted, max 22ch.
- Company names 17px 600 muted, 40px apart.

### 4. Selected work (`SelectedProjects.js`)
- Title "Selected work" + one "All case studies" link.
- The whole card is one link (no separate "Read more", no tags). Order: 16:10 media → role (meta
  style) → title (`--fs-item`) → summary (muted) → hairline → **Outcome:** line.
- Outcome needs a new project field (see Content). Hide the outcome row when empty.
- Replace the stock UDP illustration with a real screenshot so all three images match.

### 5. Ways to work together (new `HomeServices.js`, anchor `#services`)
- Left: title + one intro sentence. Right: two cards, `01` / `02` in meta style, title, description,
  one CTA link.
- Cards: "Project or services" → "Tell me about a product, platform, or engineering need." and
  "Consultancy" → "Start a focused advisory or technical review conversation." (the contact
  wizard's own intent copy).
- CTAs link to `/contact/` with the intent preselected (`/contact/?intent=…`); `contact.js` needs
  to read that query param.

### 6. Testimonial (`Testimonials.js`)
- Heading stack becomes title + one link (drop the eyebrow and description, per STYLEGUIDE).
- Layout: title column left, quote column right (flex-wrap; stacks on phones).
- **Fix truncation:** cut at the last space before the limit, never mid-word (currently
  `slice(0, 257)` produces "grow h…").
- Pick the homepage quote by setting which testimonial is featured and first by `sortOrder`.
- Source link reads "Read on LinkedIn".

### 7. Articles (`LatestWritings.js`)
- On `bg-page`, not the tinted box. Title + description + one "All articles" link.
- Each post is one row link with hairline separators: date · reading time (meta, 200px column),
  title + summary, arrow on the right. No tags, no separate "Read article" link.
- Row hover: `--bg-brand-soft` background, arrow nudges 4px.

### 8. Closing + footer (`BookCallSection.js`, `Footer.js`)
- One inverse surface. Top: CTA title + paragraph left, `Book a call` (primary) + "or send a
  message" text link right, aligned to the bottom. Left-aligned, not centered.
- Hairline, then footer: name, one-line description, labelled pill links (GitHub, LinkedIn, Email,
  CV; 44px tall, icon + text), a two-column nav, copyright.

## Content and CMS changes (`portfolio-cms`)

| Where | Field | Purpose |
| --- | --- | --- |
| Home Page global | `primaryCtaNote` | line under the hero buttons |
| Home Page global | `servicesTitle`, `servicesDescription`, `servicesLimit` | section 5 heading; an empty title hides the section |
| Services collection (new) | `title`, `summary`, `highlights[]`, `contactIntent`, `ctaLabel`, `showOnHome`, `sortOrder`, `status` | one row per way to work together (project delivery, consultancy, architecture review, technical co-founder, ...) |
| Posts collection | `projectOutcome` | outcome line on homepage project cards |

- The testimonial uses the existing Testimonials collection: the homepage shows the first featured,
  published row by `sortOrder`, cut at a word boundary.
- `contactIntent` must match a Contact page help-type value; the card links to
  `/contact/?intent=<value>` and the wizard preselects it.
- The UI reads `/api/services` and treats a 404 (CMS without the collection) as no services.

## Implementation notes

- Styles live in the "Phase F" block at the end of `src/styles/global.css`; the type and spacing
  tokens there were first applied to the homepage; the "Phase H" block now applies them site-wide (see `docs/style/STYLEGUIDE.md` → "Site-wide page scale").
- The closing surface (book-call section + footer) is site-wide.

## Acceptance checks

- [ ] CMS running on port 3001; `npm run develop` renders the homepage with real content.
- [ ] Side by side with the reference at 1440px and 390px, in sunset and dark themes.
- [ ] No horizontal scroll at 390px; proof stats in two columns; headline ≤ 6 lines on a phone.
- [ ] Exactly one orange primary button visible per screen (header uses outline).
- [ ] Keyboard: Tab reaches every link and button in order; focus ring visible on page, tinted
      band and the inverse closing surface.
- [ ] Reduced motion on: no card lift, no button scale; colour feedback remains.
- [ ] Text contrast: body and muted text ≥ 4.5:1 on every surface in both themes (muted text is
      not used on the 8% tint in sunset).
- [ ] Testimonial never ends mid-word.
- [ ] `npm run build` succeeds (static export).
- [ ] LANDING_PAGE.md and STYLEGUIDE.md updated to match.
