# Writings Blueprint

This document defines the structure for the writings archive and individual article pages.

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

## Writings System
The writings system has three layers:
1. Homepage latest writings preview
2. Writings archive page
3. Article detail page

## 1. Homepage Latest Writings Preview
Purpose:
- Show the newest or most relevant writing on the landing page
- Drive readers into the archive

Required content:
- latest 3 to 6 posts
- title
- date
- short summary
- tags
- link to detail page
- link to `/blog/`

Presentation rule:

- On the homepage preview, use a vertical list for latest writings (stacked entries), not a multi-column card grid.

Rule:
- Homepage should preview the archive, not replace it.

## 2. Writings Archive Page: `/blog/`
Purpose:
- Act as the complete archive of writing
- Help users scan by topic and recency
- Route readers into individual articles

Recommended page order:
1. Archive intro
2. Tag filter area
3. Article list
4. Pagination
5. Optional CTA band
6. Footer

### Archive Intro
Required content:
- page title
- 1 to 2 line explanation

Recommended title:
- `Writings`

Recommended supporting copy:
- `Notes on engineering, AI, systems thinking, and the human side of building and working.`

Rule:
- Keep the intro brief.

### Tag Filter Area
Purpose:
- Help readers narrow content quickly

Recommended behavior:
- show all tags
- allow one active filter at a time initially
- include an `All` state

Rule:
- Start simple.
- Single-tag filtering is enough for the first version.

### Article List
Each article preview should show:
- title
- publish date
- short description or excerpt
- visible tags
- link to detail page

Optional:
- reading time
- cover image

Rule:
- Archive cards should be easy to scan.
- Avoid making cards too visually heavy.

### Pagination
Purpose:
- keep the archive manageable as content grows

Recommended behavior:
- page-based pagination
- query param or route-based pagination is acceptable

Preferred UX:
- clear next / previous controls
- visible current page state

Rule:
- Keep pagination simple and readable.

### Optional CTA Band
Purpose:
- turn engaged readers into leads when appropriate

Recommended CTA:
- `Get a Quote`
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
5. Comments if enabled
6. Book a call block
7. Footer

### Article Header
Required content:
- title
- publish date
- optional reading time
- optional short description

Optional:
- cover image

Rule:
- Header should be clean and article-first.

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

## Pagination Strategy
Recommended first version:
- 6 to 12 posts per page

Rule:
- use a predictable archive structure
- keep page titles and canonicals clean if paginated routes are introduced

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
- `Writings | Muhammad Usman`

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
- define related-post selection logic
- normalize current and future tag naming
- decide whether archive cards should include cover images by default
