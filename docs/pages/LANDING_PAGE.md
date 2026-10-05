# Landing Page Blueprint

This document defines the structure of the homepage.

It translates `docs/structure/STRUCTURE.md` into a concrete landing page plan.

## Goal

- Introduce you clearly
- Show proof through selected work and writing
- Give users a clear next action
- Keep the page quiet, minimal, and content-led

## Landing Page Order

The order follows a prospective client's questions: what you do, proof, how to engage, trust,
then how you think. Full layout, type, spacing and surface rules: `docs/pages/HOMEPAGE_REDESIGN.md`
(visual target: `docs/design/homepage-redesign.reference.html`).

1. Header
2. Identity block
3. Proof strip
4. Selected projects
5. Ways to work together (Services collection)
6. Testimonial preview
7. Articles
8. Book a call block and footer (one inverse surface)

## 1. Header

Purpose:

- Help users orient quickly
- Keep top navigation simple

Recommended links (Site Settings → Navigation):

- About
- Projects
- Articles
- Contact Me
- Book a Call (outlined; the orange primary appears once per view, in the hero)

Testimonials can live in the footer only.

Rule:

- Logo image and name only; no tagline line under the name.
- Keep the header visually quiet.
- Use a subtle primary-color underline on nav hover and active states.
- Avoid adding too many links.

## 2. Identity Block

Purpose:

- Establish who you are in one screen
- Give a quick reason to trust the site
- Create a path to the full About page

Required content:

- Portrait
- Name
- Professional title
- Small eyebrow
- Main headline
- Supporting text
- Link to `/about`

Recommended framing:

- The picture, name, and title should read as one unit
- That unit should link to `/about`

Content intent:

- This is not a large marketing hero
- It should feel like a calm personal introduction

Suggested content pattern:

- Small eyebrow
- Main headline (`--fs-display`, max 21ch)
- Supporting text
- Two buttons and a one-line note under them (`primaryCtaNote`)

The trust-chips list is removed; the proof strip carries that evidence.

Example structure:

- `Senior Software Engineer · Backend · Data · AI Systems`
- `Building reliable backend, data, and AI systems for teams that need software to scale.`
- `8+ years delivering production-grade systems across full-stack engineering, data platforms, and infrastructure for global teams.`

Primary action inside this section:

- `Book a call` (primary, 52px tall)

Secondary action:

- `See selected work` (outline, links to `#work`)

Rule:

- Keep this block compact.
- Let typography and spacing do the work.
- Do not add a filler sentence between the identity block and the next section; the proof strip follows directly.

## 2a. Proof Strip

Purpose:

- Give concrete evidence within the first screen
- Replace vague trust chips with numbers and named teams

Required content (CMS **Home Page → Proof**):

- `proofStats`: up to four `value` + `label` pairs, each backed by a case study or experience entry
- `proofTitle`: short label for the company row, e.g. `Trusted by teams at`
- `proofCompanies`: company or client names

Rule:

- Hide the strip entirely when both lists are empty.
- Stats use a two-column grid on mobile and four columns on desktop.

## 3. Selected Projects

Purpose:

- Show real work without making the homepage feel heavy
- Move users toward deeper case studies

Section title:

- `Selected work`

Required content:

- 3 featured projects
- Short description for each
- Link from each project to a detailed project page or case study
- Project preview image when available

Each project preview should show, in this order:

- 16:10 image
- Your role (meta style)
- Project name
- One-sentence context
- Hairline, then `Outcome:` from the post's `projectOutcome` field (hidden when empty)

The whole card is one link; no tags and no separate `Read more`.

Project detail pages should eventually include:

- Context
- Problem
- Your role
- What you built or changed
- Stack
- Result

CTA in this section:

- `All case studies`

Rule:

- Homepage cards are previews only.
- Keep the section intro to one visible heading.
- Do not place long project descriptions on the landing page.
- Keep selected-project previews visually light with consistent image sizing and hairline borders, no shadows.

## 3a. Ways to Work Together

Purpose:

- Answer "how do we work together?" before trust and reading content

Content:

- Home Page global: `servicesTitle`, `servicesDescription`, `servicesLimit` (an empty title hides the section)
- Services collection: published rows with `showOnHome`, ordered by `sortOrder`

Layout:

- Full-bleed `--bg-brand-soft` band with hairlines; title and one sentence on the left, white cards on the right
- Each card: `01`/`02` index, title, summary, optional highlights, one CTA
- The whole card links to `/contact/?intent=<contactIntent>`; the contact wizard preselects that intent

## 3b. Testimonial Preview

- Title and one `Read all testimonials` link on the left, the quote on the right (stacks on phones)
- Shows the first featured, published testimonial by `sortOrder`
- The quote is cut at a word boundary, never mid-word; no expand button on the homepage
- The source link reads `Read on LinkedIn` when the testimonial has a LinkedIn `sourceUrl`

## 4. Articles

Purpose:

- Reinforce expertise
- Make the site clearly writing-led
- Create a path into the blog archive

Section title:

- `Articles`

Required content:

- Latest articles (Home Page `writingsLimit`, default 2), newest first
- One-line description (`writingsDescription`)
- Link to `/blog`

Each article is one row link with hairline separators:

- Date · reading time (meta style)
- Title and short summary
- Arrow on the right

No tags and no separate `Read article` link on the homepage; the archive keeps the full cards.

Archive page requirements:

- Load more
- Tag filters

Article detail page requirements:

- Related writings
- Previous/next post
- Share actions

CTA in this section:

- `All articles`

Rule:

- Articles sit on the page background, not a tinted box.
- Keep the section intro to one visible heading.

## 5. Book a Call Block

Purpose:

- Offer a single high-intent action before the footer
- Make the conversion handoff clear and focused

Required content order:

- business proposition line
- short supporting subtitle
- `Book a call` button, plus an `or send a message` text link

Rule:

- Shares one inverse surface (`--surface-inverse`) with the footer, site-wide.
- Left-aligned: copy on the left, actions on the right, aligned to the bottom.
- Use one primary action only.

## 6. Footer

Purpose:

- Re-engage users at the bottom of the page
- Keep important routes and trust links available

Footer should include:

- Short CTA
- Navigation
- Credentials/social links
- Email or booking link

Credentials appear as labelled pill links (icon + text, 44px tall) under the footer name and
description: GitHub, LinkedIn, Email, CV. Navigation is a two-column list without a heading.

Optional:

- One featured project
- One featured article

Rule:

- Footer should feel useful, not decorative.
- Every page should end with a meaningful next step.

## Page-Level Hierarchy

- Identity introduces you
- Projects prove capability
- Writings prove thinking
- CTA converts intent
- Footer catches late-stage visitors

## What the Landing Page Should Not Try to Do

- Tell your full life story
- Show every project
- Replace detailed case studies
- Replace the full writings archive
- Use a long, generic contact section as the only conversion path

## Build Priority

Recommended implementation order:

1. Identity block
2. Selected projects with detail-page links
3. Articles section
4. CTA block with credentials
5. Footer

## Open Follow-Ups

- Create `/about` page structure
- Create project/case-study detail template
- Create writings archive behavior: load more + tags
- Create quote wizard flow

---

# Content-Ready Homepage Spec

> Superseded for order and layout by the sections above and `docs/pages/HOMEPAGE_REDESIGN.md`.
> Kept for the content notes below.

This section turns the landing page blueprint into concrete homepage content using the material currently in the repo.

## Recommended Homepage Order

1. Header
2. Identity block
3. Selected projects
4. Articles
5. CTA block
6. Footer

## 1. Header

Recommended nav:

- About
- Projects
- Articles
- Contact Me
- Book a Call

Right-side utility links may include:

- LinkedIn
- GitHub

Rule:

- Keep the header small and quiet.
- Use only one high-visibility action in the header.

Recommended header CTA:

- `Book a Call`

## 2. Identity Block

This should replace the current oversized hero pattern with a compact personal entry point.

Required content:

- Portrait
- Name
- Professional title
- Short introduction
- Link to `/about`

Recommended content draft:

- Name: `Muhammad Usman`
- Title: `Software Engineer working across full-stack, data, and AI systems`
- Intro line 1: `I build reliable software products and write about engineering, AI, and execution.`
- Intro line 2: `8+ years of experience delivering systems for global teams, including Fortune 100 environments.`

Primary action:

- `Book a Call`

Secondary action:

- `View Projects`

Supporting line about writings and selected work should be placed below the identity block, not inside the hero copy.

Linking rule:

- The name + portrait block should link to `/about`.

## 3. Selected Projects

Recommended section title:

- `Projects I’ve worked on`

Recommended section subtitle:

- `Selected work across data platforms, cloud systems, and product engineering.`

Recommended featured homepage projects:

1. `Data Landscape Scanner`
2. `Unified Data Platform (UDP)`
3. `Error Reprocessing Tool`
4. `Core Payment Services Platform`

Why these four:

- They show stronger technical depth than the website projects.
- Together they cover data systems, platform engineering, observability, and fintech.

Recommended homepage card structure:

- Project title
- One-sentence summary
- Short role line
- Link to detailed case study

Recommended homepage summaries:

### Data Landscape Scanner

- Summary: `A data discovery and governance system supporting 40+ technologies for cataloguing, lineage, and classification.`
- Role line: `Worked on connectors, security hardening, tagging, and scanner optimization.`

### Unified Data Platform (UDP)

- Summary: `A platform for designing and deploying big data pipelines without exposing users to infrastructure complexity.`
- Role line: `Built backend features, Airflow integrations, quality gates, and automated testing coverage.`

### Error Reprocessing Tool

- Summary: `A system for monitoring and recovering data migration failures in near real time.`
- Role line: `Helped improve observability, recovery flow, and operational reliability during migration work.`

### Core Payment Services Platform

- Summary: `A full digital payments platform covering card activation, transactions, fee handling, and notifications.`
- Role line: `Worked end-to-end across backend, frontend integration, deployment, and production support.`

Section CTA:

- `View All Projects`

Important structural note:

- Homepage cards should eventually link to internal project detail pages, not only external profile links.
- Each project detail page should become a case study.

## 4. Articles

Recommended section title:

- `Articles`

Recommended section subtitle:

- `Notes on AI, engineering, and the human side of doing meaningful work.`

Current articles available in repo:

1. `The Digital Paradigm and AI: A Perspective`
2. `Sometimes the Anxiety You Feel Isn’t About the Moment: It’s Your Younger Self Asking to Be Seen, Heard, and Healed`

Recommended homepage article cards:

### The Digital Paradigm and AI: A Perspective

- Summary: `A perspective on AI as productivity acceleration, changing skill models, and the future of work.`
- Tags: `AI`, `Digital Paradigm`, `Technology`, `Productivity`

### Sometimes the Anxiety You Feel Isn’t About the Moment...

- Summary: `A reflective article on hidden anxiety, subconscious triggers, and mindful self-observation.`
- Tags: `anxiety`, `healing`, `mental-health`

Section CTA:

- `All articles`

Structural note:

- Since only two posts exist right now, show both.
- When more posts are added, keep homepage display limited to the latest 3 to 6.

Archive requirements for `/blog`:

- Load more
- Tag filters

Detail page requirements:

- Related writings
- Previous and next post
- Share actions

## 5. Book a Call Block

This section should provide a clear single conversion path before footer.

Required content order:

- business proposition line
- short subtitle
- `Book a Call` button

## 6. Footer

Recommended footer structure:

### Column 1: Identity and trust

- Name
- One-line positioning

### Column 2: Navigate

- About
- Projects
- Articles
- Contact Me

Credentials placement:

- Show credentials as icon links (LinkedIn, GitHub, WhatsApp, Email, Resume)
- Place icons directly under the name/intro block in the footer

Rule:

- Footer should appear on every page with the same structure.

## Recommended Homepage CTA Hierarchy

- Primary: `Book a Call`

## Implementation Notes

- Keep the landing page summary-driven.
- Do not place the full bio on the homepage.
- Do not list all projects on the homepage.
- Do not turn latest writings into a full archive block.
- Build internal destinations next:
  - `/about`
  - project detail pages
  - improved `/blog`
  - quote wizard flow
