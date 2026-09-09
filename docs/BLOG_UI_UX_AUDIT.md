# Blog UI/UX Audit

This document audits the current blog implementation based on the shipped code, with emphasis on look, visualization, editorial readability, scanning, and conversion flow.

It is intended as an actionable implementation brief, not a generic design critique.

## Scope

Pages and files reviewed:

- `src/pages/blog.js`
- `src/templates/blog-template.js`
- `src/components/ShareActions.js`
- `src/components/Header.js`
- `src/components/Footer.js`
- `src/components/LatestWritings.js`
- `src/styles/global.css`
- `src/lib/content.js`
- published writing records from Payload CMS

Reference docs used:

- `docs/style/STYLEGUIDE.md`
- `docs/structure/STRUCTURE.md`
- `docs/pages/WRITINGS_PAGE.md`
- `docs/seo/SEO_URLS.md`
- `docs/content/CONTENT_CONFIGURATION.md`

## Executive Summary

The blog has a solid base:

- archive filtering exists
- pagination exists
- article width is close to the intended reading width
- tags, cover images, and reading time are present
- content is sourced cleanly from Markdown and CMS

The main problem is not missing infrastructure. The main problem is that the current visual treatment is more product UI than editorial UI.

The style docs define the site as calm, blog-first, minimal, and typography-led. The code currently adds too much card chrome, too much sticky utility UI, and too few continuation paths after the article. The result is usable, but not yet strong as a high-trust writing experience.

## Current Strengths

### 1. Archive behavior is functional

The archive already supports:

- single-tag filtering
- page query params
- reading time
- optional cover media

This aligns with the archive behavior described in `docs/pages/WRITINGS_PAGE.md`.

### 2. Article body is structurally close to the target

The article body uses:

- narrow reading width
- restrained prose sizing
- clear heading hierarchy
- good image handling

The foundation in `src/styles/global.css` for `.article-prose` is directionally correct.

### 3. Theme consistency is mostly preserved

The implementation uses the existing token system rather than introducing arbitrary colors. That keeps the current design system coherent and makes refinement easier.

## Primary Findings

## P1. Archive cards are visually too heavy for the documented style

### Why this matters

The archive should feel like an editorial list that is easy to scan. Right now, each item uses:

- rounded card container
- visible border
- box shadow
- separate bordered image container

This adds too much UI chrome relative to the amount of content.

### Code signals

- `src/styles/global.css`
  - `.writing-list-item`
  - `.writing-list-item-with-media`
  - `.writing-list-media`

### Why it conflicts with the docs

The style guide says:

- let typography and spacing carry the design
- avoid unnecessary card usage
- avoid heavy shadows
- avoid visually heavy archive cards

The archive currently reads closer to a portfolio grid than a writing archive.

### Action

Refactor archive items into a lighter editorial list:

- remove `box-shadow` from `.writing-list-item`
- reduce border contrast or remove the border on default state
- keep hover emphasis subtle through `--bg-brand-soft` instead of stronger chrome
- reduce the image frame treatment so media feels integrated, not boxed separately
- increase vertical spacing between list items if borders are reduced

### Expected outcome

The page will feel more premium, calmer, and faster to scan without changing the underlying content model.

## P1. Archive intro is too weak and misses the intended editorial framing

### Why this matters

The archive currently renders only the page title. The spec calls for a short supporting sentence that explains what the writing covers.

Without that line, the archive opens abruptly and feels more like a raw listing than a curated thought archive.

### Code signals

- `src/pages/blog.js`
  - `writings-page-header` renders only `Writings`

### Action

Add a short supporting line directly under the H1:

- engineering
- AI
- systems thinking
- human side of building and working

Keep this content configurable rather than hardcoded if the archive intro is likely to evolve.

### Expected outcome

Stronger orientation, better editorial positioning, and a clearer promise before the user starts scanning.

## P1. Article pages do not create a continuation path after reading

### Why this matters

This is the largest UX gap in the blog.

After finishing an article, the user gets:

- tags
- comments

But the intended writing flow requires:

- related writings
- previous and next posts
- continued discovery
- focused post-read conversion

The current article experience ends too abruptly for both readers and business goals.

### Code signals

- `src/templates/blog-template.js`
  - no related posts section
  - no previous/next section
  - no post-read CTA band
- `src/lib/content.js`
  - blog pages are created with `slug` and `sourceType` only

### Action

Update page generation and template behavior:

1. In `src/lib/content.js`, provide previous and next post data for blog pages.
2. In the blog template, render previous and next links after comments.
3. Build a simple related-posts system based on shared tags, excluding the current post.
4. Add a subtle post-read CTA band before the footer.

Recommended CTA hierarchy:

- expertise/business posts: `Get a Quote`
- credibility/relationship CTA: `Book a Call`
- reflective/personal posts: lighter CTA, or route back to archive/about

### Expected outcome

Higher session depth, better internal linking, and better conversion without making the article feel sales-heavy.

## P1. Share UI is too prominent for a reading-first page

### Why this matters

The current share rail is sticky and button-heavy:

- one primary button
- multiple outline buttons
- full-width stacked controls

For a calm writing surface, this is too much utility UI competing with the article body.

### Code signals

- `src/templates/blog-template.js`
  - sticky aside for sharing
- `src/components/ShareActions.js`
  - four button-like actions
- `src/styles/global.css`
  - `.blog-share-rail`
  - `.share-actions`

### Action

Demote share affordances:

- move share controls below the article or below tags
- use one compact row instead of a stacked sticky panel
- keep `Copy Link` and native `Share` as the lead actions
- treat LinkedIn and X as secondary actions, visually lighter than the main CTA system

If the sticky rail is retained, it should use quiet text links or icon buttons rather than full action pills.

### Expected outcome

More editorial focus and less interface competition inside the article layout.

## P1. Tag styling and tag strategy are drifting apart

### Why this matters

Tags are both a visual system and an information system. Right now both need tightening.

Visually:

- `tag-chip` behaves like a neutral mini-card

Structurally:

- tags mix broad domains with one-off concepts
- capitalization is inconsistent at the content level
- the taxonomy will become noisy as post count grows

### Code signals

- `src/styles/global.css`
  - `.tag-chip`
  - `.blog-tag-pill`
- the active Payload tag records and published posts

### Action

Visual:

- shift tags toward `--bg-accent-soft` and `--brand-accent`
- reduce neutral-border card feel
- keep active state clearer than passive tags

Content model:

- define a canonical tag list
- keep labels human-readable
- keep slugs normalized
- avoid one-off concept tags unless they are intended as lasting categories

Suggested first-pass tag groups:

- domain: `AI`, `Technology`, `Engineering`
- practice: `Productivity`, `Systems Thinking`
- reflective: `Mental Health`, `Healing`

### Expected outcome

Cleaner filtering, more consistent visual rhythm, and better long-term archive hygiene.

## P2. Header chrome is stronger than the blog-first style intends

### Why this matters

The current sticky header uses a saturated darkened brand background. That treatment is stronger than the rest of the blog and pulls attention upward on article pages where focus should remain on the content.

### Code signals

- `src/styles/global.css`
  - `.header`

### Action

On blog archive and article pages, consider a quieter chrome mode:

- background closer to `--bg-page` or a lightly tinted neutral
- keep the divider subtle
- reserve stronger brand treatments for homepage or primary CTA moments

### Expected outcome

Better content focus and stronger alignment with the documented quiet-navigation rule.

## P2. Footer is structurally present but under-leveraged as a conversion surface

### Why this matters

The structure guide expects the footer to act as a second-chance conversion area. The current footer contains identity, credential icons, and navigation, but it does not clearly present the next best action.

### Code signals

- `src/components/Footer.js`

### Action

Add one restrained conversion line in the footer:

- short outcome-oriented sentence
- one primary next step
- one trust action

Recommended pair:

- `Get a Quote`
- `Book a Call`

Keep this quiet and lightweight. Do not turn the footer into a card block.

### Expected outcome

Better end-of-page conversion support without breaking the minimal aesthetic.

## P2. Archive CTA is generic and not content-aware

### Why this matters

The archive currently includes:

- `Need help with similar work?`

That copy assumes service alignment for all content. Some blog posts are reflective or personal, so the CTA does not always fit the article mix.

### Code signals

- `src/pages/blog.js`
  - results bar CTA to `/quote/`

### Action

Use a more neutral archive CTA or make it content-aware:

- neutral archive-level CTA: `Start a project conversation`
- alternative trust CTA: `See projects`
- keep `Get a Quote` for explicitly expertise-led sections or article CTAs

### Expected outcome

Better intent match and less friction between reflective content and commercial actions.

## P3. Homepage writings preview should stay lighter than the archive

### Why this matters

The homepage writings section is correctly list-based, but as the archive becomes lighter, the homepage preview should remain even more reduced so it feels like a preview, not a duplicate archive pattern.

### Code signals

- `src/components/LatestWritings.js`

### Action

Keep homepage previews minimal:

- date
- title
- short summary
- tags
- one text CTA

Avoid expanding into card-heavy treatments or archive-like media blocks on the homepage.

## Visual Design Adjustments Recommended Within Current Style

These are refinements to the current style, not a redesign.

### 1. Shift emphasis from card chrome to surface rhythm

Prefer:

- whitespace
- section spacing
- soft tinted backgrounds
- restrained hover states

Reduce:

- shadows
- multiple stacked borders
- pill-heavy UI

### 2. Make the blog feel more editorial than app-like

Prefer:

- text-first hierarchy
- quiet metadata
- subtle supporting UI

Reduce:

- sticky utility rails
- full-width button clusters
- visually boxed fragments around every element

### 3. Use accent color more deliberately

Use `--brand-primary` for:

- key links
- one focal action per section
- active filter state

Use `--brand-accent` more clearly for:

- passive tags
- secondary metadata emphasis
- supporting surfaces

### 4. Keep one emphasis moment per section

For the archive:

- emphasis should be article titles, not card shells

For article pages:

- emphasis should be title and reading body, not share controls

For post-read conversion:

- emphasis should be one CTA block, not multiple competing utilities

## Recommended Implementation Order

### Phase 1: Editorial quality and continuation

1. Add archive intro copy under `Writings`
2. Add related posts
3. Add previous/next post navigation
4. Add post-read CTA band

### Phase 2: Visual refinement

1. Lighten archive cards into a more editorial list
2. Reduce share rail prominence
3. Restyle tags using accent-soft tokens
4. Quiet the blog header treatment

### Phase 3: Content and taxonomy cleanup

1. Normalize tag taxonomy
2. Tune CTA copy by content intent
3. Add a stronger footer conversion line

## Suggested Doc Follow-Ups

If the implementation follows this audit, update docs where the design system becomes more explicit:

- `docs/style/STYLEGUIDE.md`
  - add blog-specific guidance for archive item weight, tag styling, and share UI restraint
- `docs/pages/WRITINGS_PAGE.md`
  - add explicit rules for related-post ranking, previous/next behavior, and post-read CTA variants
- `docs/content/CONTENT_CONFIGURATION.md`
  - add a tag taxonomy rule if tag normalization becomes part of the content system

## Final Direction

The correct direction is not to make the blog more decorative.

The correct direction is to make it:

- quieter
- more editorial
- more connected after each article
- more intentional about where visual emphasis appears

That will improve perceived quality, scanning speed, trust, and conversion while staying aligned with the current style language.
