# About Page Blueprint

This document defines the structure of the About page.

It focuses on layout, section hierarchy, and content responsibilities.

## Goal
- Avoid repeating the landing page intro/identity block
- Explain what kind of work you do through summary, experience, and strengths
- Show experience progression in a scannable chronological format
- Keep conversion clear without repeating footer-level credentials

## About Page Order
1. Extended summary with introduction video
2. Chronological work experience (interactive two-column)
3. Strengths / focus areas
4. Book a call block
5. Footer

Credentials are handled globally in the footer and should not be duplicated as a dedicated About section.

## 1. Extended Summary
Purpose:
- Give a deeper written introduction
- Clarify the kind of problems you solve

Rule:
- Write in clear paragraphs, not bullet overload.
- Pair the introduction with a responsive 16:9 video; never autoplay it.
- Video eyebrow, title, description, and URL come from the Payload **About Page** global.
- Load the YouTube iframe only after the visitor activates the poster.
- Provide a CMS-managed transcript beneath the video.

## 2. Chronological Work Experience
Purpose:
- Visualize career progression in a familiar and scannable format

Layout:
- left column: interactive timeline/list of roles in reverse chronology
- right column: details panel for selected role

Required detail panel fields:
- period
- role and company
- location
- concise summary
- 2 to 4 impact highlights
- optional company link

Rule:
- Keep interactions lightweight and keyboard accessible.

## 3. Strengths / Focus Areas
Purpose:
- Help visitors scan your strongest areas quickly

Rule:
- Keep this section scannable.

## 4. Book a Call Block
Purpose:
- Convert trust into one concrete action

Required content order:
- business proposition line
- short subtitle
- `Book a Call` button

Rule:
- Keep this as the final content band before the footer.

## 5. Footer
Purpose:
- Keep navigation and engagement consistent across the site

Should match the site-wide footer structure defined in `docs/pages/LANDING_PAGE.md`.

## Recommended Content Sources
- Payload **About Page** global
- Payload **Work Experience** collection

## Implementation Notes
- Work experience should come from structured content, not hardcoded JSX.
- Credentials should remain in the global footer icon row.
