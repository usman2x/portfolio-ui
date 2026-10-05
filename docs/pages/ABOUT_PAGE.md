# About Page

Route: `/about/` · Page: `src/pages/about.js` · Visual reference: `docs/design/about-redesign.reference.html`

For a prospective client the page answers, in order: who is this person (intro and video), what do
they bring (core strengths), have they done it before (work experience), what do collaborators say
(one testimonial), and what is the next step (intro buttons and the shared closing section).

## Section order

| # | Section | Component | Surface |
| --- | --- | --- | --- |
| 1 | Header (About active) | `Header.js` | page |
| 2 | Intro: eyebrow, title, lead, paragraphs, buttons, video | `about.js`, `AboutVideo.js` | page |
| 3 | Core strengths | `about.js` | page |
| 4 | Work experience | `WorkExperienceTimeline.js` | page |
| 5 | Testimonial | `Testimonials.js` (`variant="home"`) | full-bleed `--bg-brand-soft` band with hairlines |
| 6 | Closing CTA + footer | `BookCallSection.js`, `Footer.js` | inverse surface, site-wide |

Sections are `--section-gap` apart. Styles live in the "Phase G" block of `src/styles/global.css`.

## 2. Intro

- Eyebrow (mono meta) and title (`--fs-display`, line height 1.04, max 22ch) from **About Page**.
- Below, a two-column flex-wrap row (48px / 80px gaps):
  - Left: the first **Summary** paragraph as the lead (20px, main text, max 52ch); any further
    paragraphs at `--fs-body` muted. Then "Book a call" (primary, 52px, Site Settings meeting
    link) and "Download CV" (outline, Site Settings resume link). The primary label comes from
    **Home Page → primaryCtaLabel**.
  - Right: the introduction video as a figure: 16:9 YouTube poster (16px corners, hairline, no
    card), then the title (17px 600), description (15px muted) and a "Read video transcript"
    disclosure. Clicking the poster swaps in the `youtube-nocookie` player.
- The video eyebrow field is not rendered.

## 3. Core strengths

- Grid `repeat(auto-fit, minmax(230px, 1fr))`, 40px / 32px gaps; no cards or accent bars.
- Each item: 1px hairline top border, 24px padding-top, `01` index (mono, main text), title
  (20px 600), description (`--fs-body` muted).

## 4. Work experience

The same component renders `/experience/`, where its title is the page `h1`.

- Header row: section title and a "Download full CV" link (resume link).
- Each role is a row (flex-wrap, 8px / 48px gaps), no card:
  - Left column (220px): period (mono meta, `-` normalized to an en dash), company (17px 600,
    links to the company website, underlined on hover), location (15px muted).
  - Right column: 2px hairline left border as the rail, 40px left padding, 56px bottom padding
    (0 on the last role). Title (`--fs-item`), summary (`--fs-body` muted, max 62ch), then the
    first two highlights (17px main text with 8×2px `--brand-primary` dash markers).
  - Node: a 12px circle on the rail at the title's top; filled `--brand-primary` for the current
    role (period contains "Present"), page-coloured with a `--border-default` ring otherwise.
- On phones the left column stacks above the rail column.
- The rail is static: no scroll-drawn fill and no reveal animation.
- Order each role's highlights in the CMS so the two with measurable results come first.

## 5. Testimonial

- Rendered only when **About Page → Featured testimonial** is set to a published testimonial.
- Same two-column layout as the homepage testimonial, on the tinted band: the **Testimonials
  Page** title with a "Read all testimonials" link on the left, the full quote on the right
  (`--fs-quote` italic), avatar initial on `--bg-card`.
- The caption adds the relationship after the role ("Former Software Development Manager ·
  managed Muhammad"). Caption text uses main text on the band.

## Content

**About Page** (eyebrow, title, summary, video, strengths, experience title, featured testimonial),
**Work Experience** collection, **Testimonials Page** title, **Home Page** labels and **Site
Settings** links. Field reference: `docs/content/CONTENT_CONFIGURATION.md`.
