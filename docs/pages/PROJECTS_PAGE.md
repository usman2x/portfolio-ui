# Projects and Case Studies

Routes: `/projects/` (`src/pages/projects/index.js`) and `/projects/<slug>/`
(`src/pages/projects/[slug].js`).

A project is a published **Post** tagged `case-study`. Projects keep the order returned by the CMS
(newest first); the archive, homepage featured list and previous/next navigation all use it.

## Archive: `/projects/`

1. Page intro: **Archive Settings** `projectsTitle` (`--fs-page-title`) and `projectsDescription`
   (20px lead), left-aligned.
2. Project grid: `repeat(auto-fit, minmax(300px, 1fr))`, 56px / 32px gaps.
3. Shared closing section.

Each project card has the same anatomy as the homepage's selected work, with no outer box:

- 16:10 cover image (thumbnail size) with a hairline and 16px corners; a text fallback panel
  (initials and title) when the post has no cover
- role (mono meta, from `projectRole`)
- title (`--fs-item`), summary (`--fs-body` muted)
- tags as chips
- "View case study →" text link

Image and title both link to the case study.

## Case study: `/projects/<slug>/`

1. "Back to all projects" text link (**Project Template → backLabel**)
2. Title (`--fs-display`, max 22ch) and summary (20px lead)
3. **Tech stack** label with tag chips; optional project link block (Project Template
   `linkLabel` / `linkDescription`, post link)
4. Gallery (**Posts → projectGallery**) with a keyboard-accessible full-size viewer; or, without a
   gallery, the cover image
5. Story: **Project Template → storyTitle** (`--fs-section`) beside the rich-text body; headings
   inside the prose use the shared prose size (24–28px)
6. Optional structured sections (text, list and image blocks; `soft` tone uses a 16px tinted panel)
7. "Explore another case study": previous/next cards (Project Template labels)
8. Shared closing section

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
