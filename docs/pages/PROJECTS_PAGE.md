# Projects and Case Studies Blueprint

This document defines the structure for the projects archive and individual project detail pages.

It includes page hierarchy, content structure, and SEO-aware URL guidance.

## Goal

- Turn project previews into credible case studies
- Make project pages useful for both users and search engines
- Keep homepage project cards short while giving deeper proof on internal pages

## Recommended URL Structure

Archive page:

- `/projects/`

Detail pages:

- `/projects/<slug>/`

Examples:

- `/projects/data-landscape-scanner/`
- `/projects/unified-data-platform/`
- `/projects/error-reprocessing-tool/`
- `/projects/core-payment-services-platform/`

Rule:

- Use one stable canonical slug per project.
- Do not change slugs unless there is a strong reason.

## Slug Rules

- Use lowercase
- Use hyphens, not spaces
- Keep them human-readable
- Prefer descriptive slugs over abbreviations unless the abbreviation is the common name
- Avoid dates in project slugs
- Avoid version numbers in public URLs unless required

Good:

- `data-landscape-scanner`
- `unified-data-platform`
- `error-reprocessing-tool`

Avoid:

- `project-1`
- `udp-v2-final`
- `my-work-april-2026`

## Archive Page: `/projects/`

Purpose:

- Show the full set of project previews
- Help users scan by relevance
- Route users into project detail pages

Required content:

- Page title
- Project list
- Optional filtering by category or tag

Content source rule:

- published Payload posts tagged `case-study` are the only source for project archive entries

Recommended title:

- `Projects`

Recommended meta description direction:

- `Selected software engineering, data platform, cloud, and AI-related projects by Muhammad Usman.`

Project preview content:

- Project preview image when available
- Project title
- One-sentence summary
- Role or contribution
- Tags
- Link to detail page

Recommended optional filters:

- Data Platforms
- Backend Systems
- Cloud / DevOps
- Payments / Fintech
- Frontend / Product

Rule:

- Keep the archive intro to one visible heading.
- Archive cards should summarize.
- Detail pages should carry the full proof.

## Detail Page: `/projects/<slug>/`

Purpose:

- Present one project as a case study
- Show context, contribution, and outcome clearly

Recommended page order:

1. Case study header
2. Tech stack and outcome strip
3. Context / problem
4. Solution / approach
5. Role and responsibilities
6. Outcomes / impact
7. Project link / reference
8. Related projects
9. Book a call block
10. Footer

## 1. Case Study Header

Required content:

- Project title
- Short descriptor
- Optional project category
- Project image when available

Example:

- `Data Landscape Scanner`
- `Data discovery and governance across 40+ technologies`

SEO rule:

- Title tag should start with the project name.

Recommended title tag pattern:

- `<Project Name> | Project Case Study`

## 2. Tech Stack

Purpose:

- Give quick technical context near the top of the page

Should include:

- compact stack list
- scannable tags or chips

Rule:

- Keep stack visible early, but visually quiet.

## 3. Context / Problem

Purpose:

- Explain the business or technical challenge

Examples:

- data discovery across multiple technologies
- ETL orchestration complexity
- migration error observability
- payment workflow reliability

Rule:

- Frame the project around a real problem, not only the stack.

## 4. Solution / Approach

Purpose:

- Explain how the problem was addressed

Should answer:

- What changed?
- What kind of system or workflow was introduced?
- How was the implementation direction shaped?

Rule:

- Keep this readable and outcome-oriented, not just technical narration.
- Detail sections may mix narrative text, arrow-list points, and optional image figures with captions.

## 5. Role and Responsibilities

Purpose:

- Clarify your contribution with more detail than the summary line

Should answer:

- What was your role?
- What did you own?
- What decisions or work areas were yours?

Recommended content:

- role summary line
- 3 to 6 responsibility points when available

Rule:

- Focus on meaningful ownership, not generic task listing.

## 6. Outcomes / Impact

Purpose:

- Show why the project matters

Examples of outcome framing:

- improved discovery coverage
- reduced migration risk
- strengthened security posture
- improved delivery reliability
- reduced manual effort

Rule:

- Preserve the evidence and language from the source case study.
- Do not add decorative statistics or inferred outcomes; explain the work and impact in the narrative.
- Project images come from the CMS Media collection. Detail pages show the complete ordered gallery as thumbnails and open the original image in an in-page viewer.

## 7. Project Link / Reference

Purpose:

- Provide an external destination when it adds context

Should include:

- live product link, public site, or reference page when available

Rule:

- Treat this as a supporting reference, not the primary proof.

## 8. Continue Exploring

Purpose:

- Give users a simple route into the neighboring case studies

Should include:

- Previous and next case-study cards when available
- Title and concise project summary

Rule:

- Keep this to one navigation section; do not add a second related-project grid.

## 9. Book a Call Block

Purpose:

- Offer a focused conversion step after the case-study navigation

Required content order:

- business proposition line
- short subtitle
- `Book a Call` button

Rule:

- Keep this block as the last section before the footer.

## SEO Requirements

### Canonical URL

- Every project detail page should have a canonical URL matching `/projects/<slug>/`

### Meta Title

Recommended pattern:

- `<Project Name> | Project Case Study`

Alternative:

- `<Project Name> | Muhammad Usman`

### Meta Description

Should include:

- project name
- type of work
- your contribution or domain

### H1

- H1 should match or closely mirror the project title

### Internal Linking

Project pages should link to:

- `/projects/`
- relevant writings if related
- CTA destination

Homepage and archive pages should link into:

- `/projects/<slug>/`

### Slug Consistency

- Slug must be stored in content data, not generated ad hoc in components.

## Recommended Content Model

Project and case-study content belongs in Payload. Shared page labels are maintained in the Payload **Project Template** global.

Recommended CMS fields:

- `title`
- `slug`
- `description`
- `category`
- `tags`
- `cover`
- `featured`

Suggested structured JSON fields for case-study details:

- `summary`
- `sections`
- `link`
- `linkLabel`

Suggested section structure:

- `title`
- `tone`
- `blocks`

Supported block types:

- `text`
- `list`
- `image`

Suggested image-block fields:

- `image`
- `caption`
- `alt`

## Candidate Starting Case Studies from Current Repo Content

- Data Landscape Scanner
- Unified Data Platform
- Error Reprocessing Tool
- Core Payment Services Platform

These are the strongest starting candidates because they show:

- depth
- systems thinking
- delivery responsibility
- technical credibility

## What to Avoid

- External-only project links as the long-term main destination
- Project pages that only list technologies
- Slugs generated from display text at runtime
- Very long archive cards
- Repeating the same generic CTA on every block without hierarchy
