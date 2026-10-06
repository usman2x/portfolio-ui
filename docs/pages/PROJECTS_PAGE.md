# Projects and Case Studies

Routes: `/projects/` (`src/pages/projects/index.js`) and `/projects/<slug>/`
(`src/pages/projects/[slug].js`).

A project is a published **Post** tagged `case-study`. Projects keep the order returned by the CMS
(newest first); the archive, homepage featured list and previous/next navigation all use it.

## Archive: `/projects/`

1. Page intro: **Archive Settings** `projectsTitle` (`--fs-page-title`) and `projectsDescription`
   (20px lead), left-aligned.
2. Project grid: `repeat(auto-fit, minmax(300px, 1fr))`, 56px / 32px gaps.
3. Closing band.

Each card is the homepage project card (`ProjectCard`, `.home-work-*`), with no outer box:

- 16:10 cover image (thumbnail size) with a hairline and 16px corners; a text fallback panel
  (initials and title) when the post has no cover
- role (mono meta, from `projectRole`)
- title (`h2`, `--fs-item`), summary (`--fs-body` muted)
- outcome (`projectOutcome`), hidden when empty

The title link stretches over the whole card, so each card is one click target and one tab stop.
No tags and no per-card "View case study" link.

## Case study: `/projects/<slug>/`

1. Quiet back link "← All projects" (`BackLink`, **Project Template → backLabel**): `--fs-ui`
   muted, underlined on hover only
2. Title (`--fs-display`, max 22ch) and summary (20px lead)
3. Facts row on a hairline: **Role** (`projectRole`) and **Outcome** (`projectOutcome`), each
   hidden when empty. Projects have no period field, so none is shown. No category tags; the real
   stack is in the body.
4. Optional reference link (post `link`, label `linkLabel` or Project Template `defaultLinkLabel`,
   `↗`), the page's one CTA link
5. Gallery (**Posts → projectGallery**) 40px below the header, with a keyboard-accessible
   full-size viewer; the count and hint ("8 images · Select an image…") are `--fs-ui` sans, muted.
   Without a gallery, the cover image.
6. Story: the rich-text body (the **Project Template → storyTitle** heading is visually hidden);
   headings inside the prose use the shared prose size (24–28px)
7. Optional structured sections (text, list and image blocks; `soft` tone uses a 16px tinted panel)
8. "Explore another case study": previous/next as article rows (`ContentNavigation`) with a plain
   "Previous project" / "Next project" label (Project Template labels) in the meta column
9. Closing band

Sections are `--section-gap` apart and a section heading sits 48px above its content.

## SEO

- Title: post `seoTitle`, else `<Project title> | Project Case Study`
- Description: `seoDescription`, else the summary
- Canonical: self, unless the post sets `canonicalUrl`; `noindex` is honoured
- OG image: `ogImage`, else the cover

## Content

- **Posts** (tagged `case-study`): title, slug, excerpt/summary, `projectRole`, `projectOutcome`
  (used on the homepage card), `coverImage`, `projectGallery`, tags, rich-text content, SEO fields
- **Project Template** global: shared labels
- **Archive Settings**: archive title, description and SEO description
