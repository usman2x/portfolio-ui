# Contact Page Blueprint

This document defines the generalized contact experience. The filename remains unchanged to preserve existing documentation links; `/contact/` is the canonical public route and `/quote/` is a legacy redirect.

## Goal

- Give readers, prospective clients, and consultancy leads an equally clear starting point.
- Ask only questions that match the visitor’s intent.
- Keep progress and the upcoming path visible throughout.
- Allow anonymous feedback without weakening service-enquiry qualification.

## Delivery and storage

The form posts JSON to `NEXT_PUBLIC_CMS_URL/api/quote-requests/submit`. The endpoint and Payload slugs remain stable for compatibility, while the CMS labels the records **Contact Requests**. Public users cannot list, read, update, or delete submissions.

The endpoint validates intent and all branch-specific fields, normalizes and limits text, restricts browser origins, and retains the honeypot and rate limit.

## Route and SEO

- Canonical route: `/contact/`
- Legacy route: `/quote/`, which redirects in the statically exported site and is excluded from the sitemap
- Title: `Contact Me | Muhammad Usman`
- Description: mention feedback, services, consultancy, and general messages

## Wizard flow

The first step asks, “What brings you here?” with four choices:

- Feedback
- Project or services
- Consultancy
- General message

Project and consultancy branches continue through engagement type, timeline, and budget. All branches then collect a message, contact preference, and review confirmation. Feedback and general messages may be sent anonymously; selecting “I’d like a reply” reveals and requires name, email, and preferred contact method.

The visible progress trail adapts from four to five steps after intent selection. It marks completed, current, and upcoming steps. Mobile layouts use a compact progress bar and retain explicit “Step X of Y” text.

## Interaction rules

- Show one conceptual group at a time.
- Preserve answers when moving Back and Continue.
- Validate before advancing and place errors in an announced status region.
- Move keyboard focus to the new step heading.
- Keep controls at least 44px tall and respect reduced-motion preferences.
- End with a plain-language review before submission.

## Content ownership

Payload’s legacy `quote-page` global remains the source for page copy, engagement options, contact methods, submission labels, and success/error messages. Its `helpTypes` array now represents the four top-level intents. The UI includes compatibility copy so an older published global does not prevent the generalized form from rendering.

## Alternative actions

“Book a short call” and “Send an email” remain secondary options beside the wizard. They should never compete visually with the active Continue or Send action.
