# Design Consistency Backlog

Pages outside the homepage and About still use older patterns. This backlog brings them in line
with the redesign. Each item is self-contained: pick one, implement it, verify it, commit it.

- **Status (2026-10-06, after review):** done: 1a, 2, 3, 4, 8, 10, 11. Not doing: 5, 6, 7 (built,
  reviewed and reverted; the earlier pages read better). Open: 9 (whether labels leave mono).
- **Source of truth:** `docs/style/STYLEGUIDE.md` describes the live site and its principles
  (P1–P8), including where pages deliberately depart from them.
  Also `docs/pages/HOME_PAGE.md`, `docs/pages/ABOUT_PAGE.md` and the Phase F/H tokens in
  `src/styles/global.css`.
- **Visual references:** `docs/design/homepage-redesign.reference.html` and
  `docs/design/about-redesign.reference.html` (open in a browser).
- **Audit:** 2026-10-06, against the static build of `c233795` at 1440px. Every page was measured
  in a headless browser (font sizes, borders, shadows, buttons, labels, gaps) and reviewed
  full-length. Shadows are already gone everywhere; the header and footer are consistent. Since
  then `b521877` changed the homepage services row only.

Each item ships in one commit with:

- the matching `docs/pages/*.md` updated when it changes a page's layout or behaviour (AGENTS.md);
- its **Migrating** markers removed from `STYLEGUIDE.md`, so the guide never describes a pattern
  the site no longer uses.

## Principles

P1–P8 live in `docs/style/STYLEGUIDE.md` ("Principles"); items refer to them by number.

## Shared patterns

Build each once and reuse it.

| Pattern | Where it already exists | Use it on |
| --- | --- | --- |
| Page intro (P2) | `.page-intro` (Phase H) | every non-detail page (done) |
| Project card: whole-card link, role, title, summary, outcome; no tags (P3, P5) | `ProjectCard.js` | Home, `/projects/` (done) |
| Article row: meta, title + summary, arrow; whole row is the link (P3, P5) | `ArticleRow.js` | Home, `/blog/` (done); not previous/next (item 5) |
| Quote: serif italic at `--fs-quote`, caption with initial avatar (P3) | homepage testimonial | not `/testimonials/` (item 6, kept as cards) |
| Closing band directly above the footer (P7) | `BookCallSection.js`, `Footer.js` | every page except Contact, Thank-you, 404 (item 1a) |

## Backlog

### 1. Separate the closing call to action from the footer (P7). Done, then superseded by 1a.

`BookCallSection` is a contained `--bg-brand-soft-strong` panel at the end of `<main>`, a full
`--section-gap` above and below; the footer has its own inverse surface with no internal line.
Home, Contact, Thank-you and 404 have no panel. The homepage ends with the services section and a
closing row built from the existing bookCall fields (no new CMS field).

<details><summary>Original brief</summary>


- **Files:** `Layout.js`, `BookCallSection.js`, `Footer.js`, `HomeServices.js`, `pages/index.js`,
  `pages/thank-you.js`, `pages/404.js`, the Phase F block in `global.css`,
  `docs/structure/STRUCTURE.md`.
- **Problem:** the call to action and the footer share `--surface-inverse` with a faint line between
  them, so the call to action reads as part of the footer. Contact (`showBookCall={false}`) ends on
  a short footer, every other page on a tall dark block. Thank-you and 404 show a sales pitch. The
  homepage asks twice ("Ways to work together" and the closing call to action). The footer
  repeats "Book a call".
- **Change:**
  - Render `BookCallSection` inside `<main>` as a contained panel: `--bg-brand-soft-strong`,
    24px radius, padding `clamp(40px, 5vw, 64px)`, `--section-gap` above and below, all text
    `text-main`.
  - Footer: its own inverse surface, 64px top padding, no internal line, no "Book a call" link.
  - `showBookCall={false}` on Home, Contact, Thank-you and 404.
  - Homepage: move `HomeServices` to the end of the page and add a closing row under the cards:
    "Not sure which fits?" plus the bookCall description, the bookCall button and "or send a
    message". Reuse the existing bookCall fields rather than adding a Home Page field: a new field
    needs a migration while `docs/TODO.md` is removing unused ones.
- **Done when:** both reference files' endings match, and on every page the panel and the footer
  never touch.

</details>

### 1a. One closing band, directly above the footer (P7). Done.

`BookCallSection` is a full-bleed `--surface-closing` band on every page except Contact, Thank-you
and 404. `--surface-closing` is derived from the palette with `color-mix()` (inverse surface + 14%
primary), and every pair on it meets the style guide's AA rules in both themes (text 6.7–11.4:1,
button and focus ring 3.8 / 5.7:1); the secondary link keeps its text colour on hover because
sunset primary as text would be 3.8:1. The band sits a section gap below the content and directly on the footer. Its top margin is the only
bottom space (the homepage and About wrappers no longer add their own). The homepage closing row
is gone and services are back after the projects. Verified on 11 routes at 1440 and 390px in both
themes: band-to-footer 0px, gap above 128 / 80px.

<details><summary>Brief</summary>


Decided 2026-10-06 after reviewing the built pages. Visual target: the endings of both files in
`docs/design/`.

- **Files:** `BookCallSection.js`, `Layout.js`, `HomeServices.js`, `pages/index.js`, `global.css`
  (Phase F `.home-page`, Phase G `.about-page`, Phase H `.content` and `.book-call-section`),
  `docs/structure/STRUCTURE.md`, `docs/pages/HOME_PAGE.md`, `docs/pages/ABOUT_PAGE.md`.
- **Problems (drift found in the code):**
  - Homepage: it ends on the full-bleed services band, then an empty page-coloured strip before the
    footer. Two rules both add bottom space: `.content { padding-bottom: var(--section-gap) }`
    (Phase H) and `.home-page.landing-home { padding-bottom: var(--section-gap) }` (Phase F).
  - Two closing components: the homepage uses a sans "closing row" inside the services band
    (`.home-services-closing`); other pages use the serif rounded panel. They look unrelated.
  - About: the tinted testimonial band, a gap, the tinted panel, another gap, then the footer.
    That's two warm surfaces back to back and a panel floating between two strips of page.
- **Change:**
  - New token `--surface-closing`: a softer ink in the footer's palette (the inverse surface
    mixed with 14% primary). Sunset `#493a31`, dark `#3f3027`. Measured contrast on it:
    `--on-inverse` 9.8:1 / 11.4:1, `--on-inverse-muted` 6.6:1 / 7.7:1, the orange button
    3.8:1 / 5.7:1. Against the footer it is 1.23:1 / 1.3:1 plus a warmer hue, enough to read as
    a separate block.
  - `BookCallSection` becomes a full-bleed band (the section spans the viewport; its content
    sits in `.container`). Background `--surface-closing`, title serif at `--fs-section`, text
    `--on-inverse` / `--on-inverse-muted`, padding-block `clamp(64px, 7vw, 96px)`,
    `margin-top: var(--section-gap)`, **`margin-bottom: 0`, so it sits directly on the footer**.
    Focus rings use `--color-primary`. No radius.
  - One owner of the bottom gap: the band's `margin-top`. Remove the page wrappers' own bottom
    padding and margins (`.home-page.landing-home` padding-bottom, `.about-page > :last-child`
    margin-bottom), and keep `.content` padding-bottom only on pages without the band.
  - Homepage: `showBookCall` always true; remove the `.home-services-closing` row; move
    `HomeServices` back to right after `SelectedProjects` (the offer follows the evidence; the
    band is the ending, the same as every other page).
  - Contact, Thank-you and 404: unchanged. No band; the footer follows a section gap.
  - Footer: unchanged (`--surface-inverse`, no "Book a call" link).
- **Done when:** the homepage and About endings match the references in both themes; no strip of
  page colour sits between the band and the footer on any page; every page with a band uses the
  same component.

</details>

### 2. One page intro pattern (P2). Done.

Contact dropped its eyebrow, `/experience/` is gone (item 8), `--fs-h1` is retired (`.page-title`
uses `--fs-page-title`), and the 404 title reads "This page doesn’t exist" (seed). Testimonials keeps
its eyebrow with its cards (item 6).

<details><summary>Original brief</summary>


- **Files:** `pages/testimonials.js`, `pages/contact.js`, `pages/experience.js`,
  `WorkExperienceTimeline.js`, the `.page-title` / `--fs-h1` rules in `global.css`.
- **Problem:** the shared `.page-intro` (Phase H) already covers Projects, Articles, Thank-you and
  404. What remains: Testimonials and Contact add an eyebrow label above the title; Experience has
  no page intro, only the timeline's section title promoted to `h1`; 404 reads "404: Not Found";
  and the legacy `--fs-h1` still sizes `.page-title` outside Phase H.
- **Change:** no new component. Drop the eyebrows on Testimonials and Contact. Give Experience a
  `.page-intro` (see item 8). Retire `--fs-h1` in favour of `--fs-page-title`. Give 404 a human
  title, such as "This page doesn't exist", in the System Pages global (content only).
- **Done when:** every non-detail page starts the same way, with the same distance from the header
  to the title and from the title to the content.

</details>

### 3. Projects archive uses the homepage project card (P3, P4, P5). Done.

`ProjectCard` renders both the homepage and `/projects/` cards; the `.project-preview-*` and
`.projects-archive-*` styles are removed.

<details><summary>Original brief</summary>


- **Files:** `pages/projects/index.js`, `.projects-archive-*` and `.project-preview-*` styles.
- **Problem:** 9 cards each carry 2–3 tags (24 in total, with no filter) and their own
  "View case study →" link, which puts 9 orange-underlined links on one screen.
- **Change:** reuse the `.home-work-*` card. The title link covers the card; show role, summary and
  outcome (`projectOutcome`, hidden when empty); remove the tags and the per-card link. Same 16:10
  media frame and grid as the homepage.
- **Done when:** a homepage card and an archive card for the same project look the same.

</details>

### 4. Articles archive uses the homepage article row (P3, P4, P5). Done.

`ArticleRow` renders both lists; `ArticleCard` and the `.writing-list-*` styles are removed, and
the filter title is a sans heading.

<details><summary>Original brief</summary>


- **Files:** `pages/blog/index.js`, `ArticleCard.js` (`.writing-list-*`).
- **Problem:** 6 white boxed cards, each with tags and a "Read article" link.
- **Change:** use the `.home-article-*` row (meta, title + summary, arrow; the whole row is the link;
  hairline separators). Keep the topic filter on the left: it is the one place tags help. Keep
  "Load more articles" as the single outlined button. Retire `ArticleCard` if nothing else uses it.
- **Done when:** the homepage list and the archive list look the same.

</details>

### 5. Detail pages: header, sharing, author and next/previous (P3, P4, P6). Not doing.

Built, reviewed and reverted on 2026-10-06; the detail pages keep their header, share buttons,
author card and previous/next cards. Their spacing follows item 10.

<details><summary>Original brief</summary>


- **Files:** `pages/projects/[slug].js`, `pages/blog/[slug].js`, `ShareActions.js`,
  `AuthorCard.js`, `ContentNavigation.js`, `ProjectGallery.js`.
- **Problems:**
  - "Back to all projects" and "Back to all articles" use the orange call-to-action link style
    right above the title.
  - The case-study header shows category tags labelled "Tech stack" (Data Platforms, Backend)
    but no role, period or outcome, all of which the homepage card shows.
  - The article page has 4 orange-outlined share buttons (Share, LinkedIn, X, "Copy Link"), the
    loudest element after the title.
  - The author card, "Keep reading" (one half-width card) and "Explore another case study" are
    boxed cards.
  - The gallery helper text "1 image · Select an image to view it full size." is monospace.
- **Change:**
  - Back link: quiet text (`--fs-ui`, `text-muted`, "← All projects"), with no underline until
    hover.
  - Case-study header: back link, title, summary, then one facts row: role · period · outcome. The
    category tags move to the end of the page (or go). The real stack stays in the body.
  - Share: one quiet row of text links ("Share · LinkedIn · X · Copy link") under the article or in
    the side rail, with no buttons.
  - Author: no box. Avatar, name, title and links on a hairline.
  - Previous/next and "Keep reading": article/project rows (shared patterns), with a direction label
    in plain text.
  - Gallery helper text: `--fs-ui` sans, muted.
- **Done when:** a detail page has no orange outlined buttons and no boxed cards except media.

</details>

### 6. Testimonials page as a quote list (P3, P6). Not doing.

Built, reviewed and reverted on 2026-10-06: the card grid reads better. The page keeps its cards,
eyebrow and expand toggle; each card's source label now links to the LinkedIn recommendations
page (`sourceUrl` in the seed).

<details><summary>Original brief</summary>


- **Files:** `pages/testimonials.js`, `Testimonials.js`.
- **Problem:** 7 white boxed cards in two columns (the last one alone), small italic quotes cut
  short, and "Read full recommendation" and a monospace "LinkedIn recommendation" label repeated on
  every card.
- **Change:** one column (max ~760px) of full quotes at `--fs-quote`, separated by hairlines and
  `--section-gap`/2. Caption: initial avatar, name, role, relationship ("managed Muhammad"). Say
  "Recommendations from LinkedIn" once in the intro; link each name to its source when
  `sourceUrl` exists. Expand/collapse only for quotes over ~600 characters, cut at a word.
- **Done when:** no boxes, no repeated labels, and every quote is readable without a click.

</details>

</details>

### 7. Contact page: labels and boxes (P3, P6). Not doing.

Built, reviewed and reverted on 2026-10-06; Contact keeps its progress card and labels. Only its
eyebrow was removed (item 2).

<details><summary>Original brief</summary>


- **Files:** `pages/contact.js`, `.quote-aside-card`, `.quote-form-section`.
- **Problem:** three small labels ("Contact", "Your path", "Prefer a conversation?") and two boxed
  panels around the wizard.
- **Change:** page intro per item 2. Show the progress trail without a box; give the form a single
  surface (keep the intent options as real bordered controls). Keep "Prefer a conversation?" as
  sans text, not a monospace label.
- **Done when:** the page uses at most one monospace label and one boxed surface besides the form
  controls.

</details>

### 8. Decide what `/experience/` is for (P2, P5). Done: removed.

Decided 2026-10-06: About is enough. `src/pages/experience.js` is deleted, the About timeline
section has `id="experience"`, and the runbook adds a permanent Caddy redirect to
`/about/#experience` (applied with the release; "Remaining production steps").

<details><summary>Original brief</summary>


- **Files:** `pages/experience.js`, sitemap, navigation.
- **Problem:** it repeats About's work history in full under a weaker title, and nothing on the
  site links to it, yet it is in the sitemap.
- **Options:**
  - (a) Keep it as the full CV: page intro "Full work history" plus one sentence, every highlight,
    and a link back to About.
  - (b) Remove it and redirect to `/about/#experience`. The UI is a static export, so the
    redirect belongs in the Caddyfile.
- **Decide with the user**, then update the sitemap and `docs/pages/ABOUT_PAGE.md`.

</details>

### 9. Monospace label budget (P6). Open.

The sans conversion was built with items 5 and 7 and reverted with them. Mono currently sets data
(dates, reading time, periods, roles, indexes) and short labels (eyebrows, tags, "Tech stack",
"Share this article", "Written by", direction labels, the gallery hint, Contact labels). Decide
whether the labels stay mono.

<details><summary>Original brief</summary>


- **Files:** global; currently "Tech stack", "Browse by topic", "Share this article", "Written by",
  "← Previous project", "→ Next article", the gallery helper text, and the Contact labels.
- **Change:** monospace only for dates, reading time, periods and roles. Turn the rest into sans
  headings (`--fs-ui` 600) or remove them where the content speaks for itself. Most are resolved by
  items 5 and 7.

</details>

### 10. Section rhythm (P1). Done.

Applied to the existing detail pages: case studies have `--section-gap` between sections, 48px
from a heading to its content (gallery, previous/next) and 40px from the header to the gallery;
articles have 40px from the header to the body and a full section gap above "Keep reading". Every
page intro sits 40px above its first content block (`.interior-page`, `.writings-page`). Measured
at 1440 and 390px.

<details><summary>Original brief</summary>


- **Files:** case-study and article page styles.
- **Problem:** the case study uses 56 / 56 / 128px between sections, the Articles archive 56px
  from the intro to the list.
- **Change:** `--section-gap` between sections, 48px from a section heading to its content, 40px
  from the page intro to the first content block.

### 11. System pages metadata. Done.

Thank-you uses `thankYouTitle` as its SEO title, renders `noindex` and is excluded from the
sitemap; 404 already did both.

## Content

Case studies, testimonials and project media are seeded from `portfolio-cms/scripts/`, and
`seed:core` overwrites matching records. Change them there, not in Payload Admin, or the next seed
reverts the edit.

- **Case studies:** done in `scripts/core-content/case-studies/*.md`: the repeated "Case Study: …"
  heading is gone, headings are sentence case, and the non-link "Walmart Inhouse product" sections
  are removed. Production picks this up at the next `seed:core`.
- **Cover images:** Banking-as-a-Service and Error Reprocessing Tool keep the placeholder tile
  (decided 2026-10-06).
- **Homepage testimonial:** Clinton Jones stays the only `featured` testimonial (decided
  2026-10-06); his relationship is "manager" in the seed and in `../portfolio/testimonials/`.
- **NeMo demo link:** text and target now both use the URL from the project's `notes.md`, in the
  seed copy and in `../portfolio/projects/real-time-nemo-asr/index.md`.
- **Content repo in step:** `../portfolio/projects/*/index.md` bodies match the seed copies
  (same heading fixes).

## Verifying any item

1. Run `run-local.command`, then check each changed page at 1440px and 390px, in the sunset and
   dark themes.
2. Keyboard: tab through everything; the focus ring is visible on the page, the tinted surfaces and
   the inverse footer.
3. Reduced motion: no lifts, slides or drawn rails.
4. Contrast: muted text never sits on a brand tint in sunset.
5. Count per page: one orange primary button per view, at most one `.text-link-cta` per section,
   no boxed cards outside media and form controls.
6. `npm run build` in both repos. Don't commit until the user has reviewed.
