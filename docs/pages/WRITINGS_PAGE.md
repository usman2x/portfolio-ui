# Articles Blueprint

This document defines the structure for the articles archive and individual article pages.

It covers layout, discovery flow, filtering, pagination, internal linking, and SEO-aware content rules.

## Goal

- Make writing a first-class part of the site
- Keep the archive easy to scan and filter
- Keep article pages readable and connected to other content
- Support both expertise content and reflective writing without losing structure

## Recommended URL Structure

Archive:

- `/blog/`

Article detail:

- `/blog/<slug>/`

Examples:

- `/blog/digital-paradigm-ai/`
- `/blog/hidden-anxiety-healing/`

Rule:

- Slugs must be stable and stored in content frontmatter.

## Articles System

The articles system has three layers:

1. Homepage Articles section
2. Articles archive page
3. Article detail page

The archive supports native and external writing entries. Native articles open on this site. External entries coexist in the same chronological and topic-based lists, but open their original Medium, LinkedIn, or other publication in a new tab. External entries do not generate local detail routes.

## 1. Homepage Articles Section

Purpose:

- Show the newest articles directly on the landing page
- Drive readers into the archive

Layout:

- Header row: section title (`Articles`) with a one-line description underneath on the left; an `All articles →` link to `/blog/` on the right.
- On mobile the `All articles` link moves below the description.
- Below the header, the latest articles, newest first, using the same `ArticleCard` as the archive (title, excerpt, date, tags, cover thumbnail).
- Title, description, link label, and article count (`writingsLimit`, default 2) come from the Home Page global.

Presentation rule:

- Use a vertical list of stacked cards, not a multi-column card grid.

Rule:

- Homepage should preview the archive, not replace it.

## 2. Articles Archive Page: `/blog/`

Purpose:

- Act as the complete archive of articles
- Help users scan by recency, with tag chips for topic discovery
- Route readers into individual articles

Recommended page order:

1. Archive intro
2. Topic filter panel (left column on desktop, above the list on mobile) beside the article list
3. `Load more articles` button
4. Footer

There is no result count.

### Archive Intro

Required content:

- page title
- 1 to 2 line explanation

Recommended title:

- `Articles`

Recommended supporting copy:

- `Notes on engineering, AI, systems thinking, and the human side of building and working.`

Rule:

- Keep the intro brief.
- Center the archive title and supporting copy, and keep the title as the only heading in the archive intro/filter region.

### Topic Filter Panel

- Title and description come from Archive Settings (`filterTitle`, `filterDescription`).
- Shows an `All` pill plus every tag used by an article; the active pill is highlighted and marked `aria-current`.
- One active tag at a time, stored in the URL as `/blog/?tag=<slug>`.

### Tag Filtering

- Tag chips on cards and article pages link to `/blog/?tag=<slug>`.
- With a tag active, the intro heading becomes `Articles tagged <tag>` (also used for the page title and Open Graph/Twitter titles); the `All` pill clears it.
- Tags render as plain words in pill chips, never with a `#` prefix.

### Article List

Each article preview should show:

- title
- publish date
- short description or excerpt
- visible tags
- link to detail page
- source label (`Original`, `Medium`, `LinkedIn`, or `External`)

For external entries, both the title and CTA link directly to the original publication, use a clear platform-specific label, and show an external-link indicator.

Optional:

- reading time
- cover image

Rule:

- Archive cards should be easy to scan.
- Avoid making cards too visually heavy.

### Load More

Purpose:

- keep the archive manageable as content grows without leaving the page

Behavior:

- show the first `postsPerPage` articles (Archive Settings, default 6)
- a `Load more articles` button appends the next batch to the same list
- hide the button once every article for the current topic is shown
- move keyboard focus to the first newly added article
- changing the topic resets the list to the first batch

### Optional CTA Band

Purpose:

- turn engaged readers into leads when appropriate

Recommended CTA:

- `Contact Me`
- `Book a Call`

Rule:

- Keep this subtle.
- Do not overwhelm the archive page with conversion UI.

## 3. Article Detail Page: `/blog/<slug>/`

Purpose:

- maximize readability
- support continued reading
- support sharing
- create pathways into projects or CTA destinations when relevant

Recommended page order:

1. Article header
2. Article body
3. Tags
4. Share actions
5. `Written by` author card
6. A single previous/next discovery section
6. Comments if enabled
7. Book a call block
8. Footer

### Article Header

Required content:

- title
- publish date
- optional reading time
- optional short description

Optional:

- cover image, shown in full at its natural aspect ratio (no cropping); width/height attributes reserve its space

Rule:

- Header should be clean and article-first.

### Reading Progress

- A 3px bar in `--brand-primary` on the bottom edge of the sticky nav bar (rendered inside the header), so it stays visible while scrolling.
- Fills from 0% at the top of the article to 100% when the end of the article body reaches the bottom of the viewport; the author card and footer do not count.
- Article detail pages only; `aria-hidden="true"`; updates via `requestAnimationFrame` without transitions.

### Author Card

- Small `Written by` label, round portrait, name, professional title, and social icon links.
- All values come from Site Settings (`name`, `portrait`, `professionalTitle`, `socialLinks`, `email`); nothing is set per article.
- External links open in a new tab with `rel="noopener noreferrer"` and an `aria-label`.
- Icons reuse the footer credential icon style.

### Article Body

Purpose:

- deliver the main content in a reading-optimized layout

Requirements:

- centered reading width
- strong paragraph rhythm
- clear heading hierarchy

Rule:

- article page is primarily a reading surface, not a marketing page.

### Tags

Purpose:

- help topic discovery

Behavior:

- each tag links back to filtered archive results

Rule:

- tags should be discoverable but quiet.

### Share Actions

Purpose:

- allow easy distribution of articles

Recommended options:

- copy link
- LinkedIn
- X
- native share if available

Rule:

- share UI should not interrupt reading.

### Continued reading

- Show previous and next article navigation when available.
- Present each destination as a readable card with title and short description.
- Do not add a second related-articles grid that duplicates or competes with these choices.
- Keep discovery below the article body so it never interrupts reading.

### Book a Call Block

Purpose:

- convert engaged readers with one focused action

Required order:

- business proposition text
- short subtitle
- `Book a Call` button

Rule:

- place it after article content and comments, just before footer.

### Comments

If enabled:

- place below the article and discovery elements

Rule:

- comments should not interrupt article flow.

## Tag Strategy

Purpose:

- keep the archive organized

Recommended tag categories:

- domain tags
  - `AI`
  - `Technology`
  - `mental-health`
- work-type tags
  - `Productivity`
  - `healing`
  - `Digital Paradigm`

Tag rules:

- use lowercase slugs for filtering behavior
- keep visible tag labels human-readable
- avoid near-duplicate tags
- prefer fewer, stronger tags over too many weak tags

Examples:

- use `mental-health`, not both `mental health` and `mental-health`
- use `ai`, not both `AI` and `Artificial Intelligence` as separate filter tags unless there is a clear distinction

## Batch Size

- 6 to 12 articles per batch (`postsPerPage`)
- `/blog/` stays a single canonical URL; there are no paginated routes

## Internal Linking Rules

Homepage should link to:

- latest articles
- `/blog/`

Archive should link to:

- every article detail page
- filtered views by tag

Articles should link to:

- tag-filtered archive pages
- optional relevant project or CTA page when appropriate

## SEO Requirements

### Archive Page

URL:

- `/blog/`

Title pattern:

- `Articles | Muhammad Usman`

Description direction:

- mention engineering, AI, systems, and reflective writing topics

### Article Pages

URL:

- `/blog/<slug>/`

Required frontmatter:

- `title`
- `date`
- `slug`
- `description`
- `tags`
- `cover`

Recommended title behavior:

- use the article title as the SEO title

Recommended meta description behavior:

- use the frontmatter description

Canonical:

- self-referencing canonical per article

Structured data:

- article pages should support `BlogPosting`

Rule:

- descriptions must be intentional, not autogenerated from random body text when possible.

## Content Model

Current pattern is correct:

- blog posts in Markdown
- frontmatter for metadata

Recommended long-term rules:

- keep article body in Markdown
- keep archive behavior in page logic
- keep tag normalization consistent

## Suggested Editorial Balance

Your current writing already spans:

- engineering / AI thinking
- reflective / human topics

That is acceptable if structure stays clear.

Recommendation:

- keep the archive unified
- use tags to clarify topic clusters
- do not split into multiple blogs unless volume grows significantly

## What to Avoid

- blog archive with no pagination plan
- inconsistent tag naming
- article pages with no onward navigation
- using the homepage as the only way to discover writing
- weak or missing descriptions in frontmatter
- random slug generation

## Open Follow-Ups

- define exact pagination behavior in implementation
- normalize current and future tag naming
- decide whether archive cards should include cover images by default
