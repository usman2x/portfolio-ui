# Articles

Routes: `/blog/` (`src/pages/blog/index.js`) and `/blog/<slug>/` (`src/pages/blog/[slug].js`).
User-facing copy always says "Articles"; the route stays `/blog/` for URL stability.

An article is a published **Post** without the `case-study` tag. `publicationType` decides where it
opens:

- `native`: has a local detail page at `/blog/<slug>/`
- `external`: shown in the same lists with a source label (Medium, LinkedIn, External) and opens
  the original publication in a new tab; it has no local route and is not in the sitemap

## Archive: `/blog/`

1. Page intro: **Archive Settings** `writingsTitle` and `writingsDescription`, left-aligned. With a
   topic selected the title becomes "Articles tagged <tag>" (also used for the page and social
   titles).
2. Two columns on desktop, stacked on phones:
   - **Topic filter panel**: `filterTitle` (sans heading, `--fs-ui` 600), `filterDescription`, an
     "All" pill and one pill per tag in use. One active tag at a time, stored as
     `/blog/?tag=<slug>`; the active pill is highlighted and marked `aria-current`. The filter is
     the only place the archive shows tags.
   - **Article list**: the homepage article rows (`ArticleRow`, `.home-article-*`): meta (source
     label, `MMM D, YYYY`, `N min`; mono), title (`h2`, `--fs-item`) and summary, and an arrow
     (`↗` for external articles). The whole row is the link; hairlines separate the rows. Beside the
     filter the meta column is 11rem and the text column may shrink to 20rem so meta, text and
     arrow stay on one line down to tablet width. No boxes, tags, thumbnails or per-row link
     label.
3. "Load more articles": the first `postsPerPage` (default 6) articles show; the outlined button
   appends the next batch, moves focus to the first new article, and disappears when all are
   shown. Changing the topic resets to the first batch. `/blog/` is one canonical URL; there are no
   paginated routes.
4. Closing band.

## Article: `/blog/<slug>/`

1. Reading progress bar: 3px `--brand-primary` bar on the bottom edge of the sticky header
   (rendered into the header). Empty at the top, full when the end of the article body reaches the
   bottom of the viewport; the author card and footer do not count. Article pages only,
   `aria-hidden`, updated with `requestAnimationFrame`.
2. Quiet back link "← All articles" (`BackLink`)
3. Optional cover image, shown in full at its natural aspect ratio (no crop); width and height
   attributes reserve its space
4. Title (`--fs-display`, max 22ch), description (20px lead), meta (`DATE • N MIN READ`, mono)
5. Body (680px reading column) with a sticky share rail: a "Share" heading (sans) and a list of
   text links (LinkedIn, X, Copy link, plus "More options" for the native share sheet where the
   browser supports it). "Copy link" confirms with "Link copied" and a polite live region. On
   phones the links sit in one row under the body.
6. Tags (plain words, linking to the tag filter)
7. Author line from **Site Settings**, no box: a hairline, then portrait, "Written by", name,
   `professionalTitle`, and social links and email as labelled icon links (external links open
   in a new tab)
8. "Keep reading" a full section gap below: previous and next as article rows
   (`ContentNavigation`) with a plain "Previous article" / "Next article" label
9. Closing band

## SEO

- Archive title: `writingsTitle` (or "Articles tagged <tag>"); description `writingsSeoDescription`
- Article title: `seoTitle` or title; description `seoDescription`, else the excerpt
- Canonical: self, unless `canonicalUrl`; `noindex` honoured
- `BlogPosting` JSON-LD with headline, dates, author and image

## Content

- **Posts**: title, slug, excerpt, content, tags, `coverImage`, `ogImage`, publication fields,
  SEO fields, `readingTimeMinutes`
- **Archive Settings**: `writingsTitle`, `writingsDescription`, `writingsSeoDescription`,
  `filterTitle`, `filterDescription`, `postsPerPage`. `readArticleLabel` and the posts'
  `externalCtaLabel` are no longer rendered (see `docs/TODO.md`)
- **Site Settings**: author card data
- **Home Page**: `writingsTitle`, `writingsDescription`, `writingsArchiveLabel`, `writingsLimit`
  for the homepage Articles section
