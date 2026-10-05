# About Page Redesign Spec

Implementation spec for the About page. The target look is
`docs/design/about-redesign.reference.html` (open it in a browser; the moon button switches
themes; the video poster is a placeholder). It uses the same type scale, spacing, surfaces and
closing section as the homepage redesign: read `docs/pages/HOMEPAGE_REDESIGN.md` first and reuse
its "Phase F" tokens in `src/styles/global.css`.

## Goals

For a prospective client the About page answers, in order:

1. Who is this person? → intro + video
2. What do they bring? → core strengths (scannable, before the history)
3. Have they done it before? → work experience with outcomes
4. What do people who worked with them say? → one testimonial
5. Next step → hero buttons and the shared closing section

## Section order

| # | Section | Component | Surface |
| --- | --- | --- | --- |
| 1 | Header | `Header.js` (About active) | `bg-page` |
| 2 | Intro: eyebrow, title, lead, one paragraph, buttons, video | `about.js`, `AboutVideo.js` | `bg-page` |
| 3 | Core strengths | `about.js` | `bg-page` |
| 4 | Work experience | `WorkExperienceTimeline.js` | `bg-page` |
| 5 | Testimonial | `Testimonials.js` (`variant="home"` layout) | full-bleed `bg-brand-soft`, hairlines |
| 6 | Closing CTA + footer | `BookCallSection.js`, `Footer.js` | inverse (already built) |

Strengths move above experience. Sections are `--section-gap` apart.

## Section specs

### 2. Intro (`about.js`, `AboutVideo.js`)
- Eyebrow (`--fs-meta` mono), then the title at `--fs-display` (line height 1.04, max 22ch).
- Below, a two-column flex-wrap row, 48px / 80px gaps:
  - Left: first summary paragraph as the lead (20px / 1.6, `text-main`, max 52ch), the second
    paragraph at `--fs-body` muted. Then `Book a call` (primary, 52px, meeting link) and
    `Download CV` (outline, resume link).
  - Right: the video. Poster 16:9, 16px radius, 1px `--hairline`, no tinted card, no shadow.
    Under it: title (17px 600), description (15px muted), "Read video transcript" disclosure.
- Drop the video eyebrow ("Meet the engineer"): one heading per block.
- Content: the third summary paragraph (the stack list) repeats Core strengths. Remove it in the
  CMS (About Page → Summary); the UI renders whatever paragraphs exist.

### 3. Core strengths
- No cards and no accent bars. Grid `repeat(auto-fit, minmax(230px, 1fr))`, 40px / 32px gaps.
- Each item: 1px `--hairline` top border, 24px padding-top, `01` (mono, `text-main`), title
  (20px 600), description (`--fs-body` muted).

### 4. Work experience (`WorkExperienceTimeline.js`)
- Header row: section title + "Download full CV" text link (resume link).
- Each role is a row (flex-wrap, 8px / 48px gaps), no card:
  - Left column (220px): period (mono meta), company (17px 600, links to the company website,
    underline on hover; replaces the separate "Visit company" link), location (15px muted).
  - Right column: 2px `--hairline` left border as the timeline rail, 40px left padding, 56px
    bottom padding (0 on the last). Title (`--fs-item` sans), summary (`--fs-body` muted,
    max 62ch), then the **first two highlights** (17px `text-main`, 8×2px `--brand-primary`
    dash markers).
  - Node: 12px circle on the rail at the title's top; filled `--brand-primary` for the current
    role, page-coloured with a `--border-default` ring for the others.
- Keep the existing scroll-drawn rail fill if you like it: it can run on the right column's
  border; respect reduced motion as it does today.
- Show "Self-employed", not "at Self-Employed"; drop the "at" prefix everywhere.
- Content: order each role's highlights in the CMS so the two with measurable results come
  first (e.g. Alex Solutions: the 10–20% speed-up and the 25+ scanners; Confiz: 10% → 80% and
  the 90% onboarding reduction). Bolding the numbers is optional.

### 5. Testimonial
- Same two-column layout as the homepage testimonial, on the tinted band: title left
  ("What collaborators say about working with me", the Testimonials page title) with "Read all
  testimonials", quote right at `--fs-quote` italic, avatar initial on `--bg-card`.
- Pick the quote with a new About Page field `featuredTestimonial` (relationship to
  `testimonials`, optional; hide the section when empty). Suggested: Pascal Inard (he managed
  Muhammad; "I heartily recommend him with no reservations"). Show his relationship ("managed
  Muhammad") after the role.
- New CMS field ⇒ new migration (`npm run migrate:create -- about_featured_testimonial`).

### 6. Closing
- Already site-wide from the homepage work; nothing to change.

## Acceptance checks

- [ ] Side by side with the reference at 1440px and 390px, sunset and dark.
- [ ] No horizontal scroll at 390px; roles stack (dates/company above the rail column).
- [ ] One orange primary button per view.
- [ ] Keyboard: video play button, transcript disclosure, company links and CTAs all reachable
      with visible focus, including on the tinted band and the inverse closing surface.
- [ ] Reduced motion: no rail animation or reveal movement.
- [ ] Muted text never sits on the brand tint in sunset (testimonial caption uses `text-main`).
- [ ] `npm run build` passes in both repos; `LANDING`/`STYLEGUIDE` docs unaffected, this spec
      added under `docs/pages/`.
