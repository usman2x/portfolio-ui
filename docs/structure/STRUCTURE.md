# Site Structure

Site map, shared layout and calls to action. Visual rules: `docs/style/STYLEGUIDE.md`. Page
details: `docs/pages/`.

## Purpose

Help a visitor quickly understand who Muhammad is, what he builds, the proof behind it, and how to
start working together, while keeping the writing easy to find.

## Routes

| Route | Page file | Doc |
| --- | --- | --- |
| `/` | `src/pages/index.js` | `pages/HOME_PAGE.md` |
| `/about/` | `src/pages/about.js` | `pages/ABOUT_PAGE.md` |
| `/experience/` | `src/pages/experience.js` | `pages/ABOUT_PAGE.md` (work experience) |
| `/projects/`, `/projects/<slug>/` | `src/pages/projects/` | `pages/PROJECTS_PAGE.md` |
| `/blog/`, `/blog/<slug>/` | `src/pages/blog/` | `pages/ARTICLES_PAGE.md` |
| `/testimonials/` | `src/pages/testimonials.js` | `pages/TESTIMONIALS_PAGE.md` |
| `/contact/` | `src/pages/contact.js` | `pages/CONTACT_PAGE.md` |
| `/quote/` | `src/pages/quote.js` | legacy redirect to `/contact/` |
| `/thank-you/` | `src/pages/thank-you.js` | system page |
| 404 | `src/pages/404.js` | system page |

Detail routes exist only for published native articles and published case studies.

## Shared layout (`src/components/Layout.js`)

Every page renders: skip link → `Header` → `<main id="main-content">` (page content, then
`BookCallSection` unless `showBookCall={false}`) → `Footer`. Contact, Thank-you and 404 pass
`showBookCall={false}`.

### Header

- Logo image and name linking to `/`; theme toggle; navigation from **Site Settings →
  Navigation** with the active page underlined; the `isPrimary` item as an outlined button.
- Below 768px the links collapse behind a menu button.
- On article pages the reading progress bar sits on the header's bottom edge.

### Closing band

Each page with a next step ends with the same closing band (P7), directly above the footer.

- **Closing band** (`BookCallSection`, **Site Settings → Book Call**): the last block of `<main>`,
  full-bleed in `--surface-closing` (the inverse surface mixed with 14% primary, a softer ink than
  the footer), padding-block `clamp(64px, 7vw, 96px)`, a full `--section-gap` above it and no space
  below it. Title (`--fs-section` Newsreader, `--on-inverse`) and paragraph (`--on-inverse-muted`)
  on the left; the primary button (meeting link) and an "or send a message" link to `/contact/` on
  the right, aligned to the bottom. Focus rings use `--color-primary`.
- The band's top margin is the only space below the last section; page wrappers add no bottom
  padding or margin of their own.
- Not on Contact (the form is the next step), Thank-you or 404 (a quiet "Back to home" only);
  those pages end a full `--section-gap` above the footer.

### Footer

Its own inverse surface (`--surface-inverse`) directly below the closing band, 64px top padding,
no internal line, never a call to action: name, `footerDescription`, labelled pill links (Site Settings social links, Email, CV
from the resume link; 44px), a two-column navigation without a heading (Site Settings navigation
without the primary item or external links), and the copyright line.

### System pages

404 and Thank-you use the page intro (title, message) and one outlined "Back to home" button
(**System Pages** global), with no closing band and no primary button.

## Calls to action

1. **Book a call**: hero primary, About intro primary, closing band primary. Header shows it
   outlined.
2. **Contact**: service cards (`/contact/?intent=…`), "or send a message", footer Email.
3. **Proof and reading**: "All case studies", "All articles", "Read all testimonials", "View case
   study", "Read article".

Only one orange primary button is visible per view.

## Navigation

Primary navigation (CMS-configured): About, Projects, Articles, Testimonials, Contact Me, and the
outlined Book a Call. The footer repeats the internal links.

## Content hierarchy rules

- One `h1` per page; section titles are `h2`; card and item titles `h3`.
- One visible heading per section; eyebrows only in page intros and the hero.
- Previews (homepage work, articles, testimonial) link to their full pages; detail pages end with
  previous/next navigation and the closing band.
