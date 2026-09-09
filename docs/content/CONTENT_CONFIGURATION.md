# Content Configuration Guide

The UI owns layout, interaction, routes, and presentation. Payload CMS owns all publishable text, links, option lists, ordering, and page metadata.

## CMS content model

### Globals

- **Site Settings** — identity, portrait, contact details, social links, navigation, footer, and book-call CTA.
- **Home Page** — hero, trust chips, section labels, featured projects, and testimonial preview settings.
- **About Page** — introduction, summary, introduction video URL/copy, strengths, and experience section label.
- **Testimonials Page** — testimonial archive SEO and introduction copy.
- **Quote Page** — page copy, process, form labels/placeholders, selectable options, and submission messages.
- **Archive Settings** — writing/project archive metadata, filters, pagination size, and CTA labels.
- **Project Template** — shared case-study labels and navigation copy.
- **System Pages** — not-found and thank-you copy.

### Collections

- **Posts** — writings and project case studies. A published post tagged `case-study` is a project; its optional role and ordered Media gallery enrich the preview and detail page while the rich-text body holds the full narrative.
- **Work Experience** — chronological roles, summaries, links, and highlights. `sortOrder` controls display order.
- **Testimonials** — recommendation copy, attribution, source, featured state, and display order.
- **Media** — reusable CMS images and files.
- **Quote Requests** — private form submissions visible only to administrators.

## Editorial workflow

1. Edit the relevant global or collection record in Payload.
2. Save/publish it and preview through the local UI.
3. Rebuild or redeploy the statically exported UI so the published site receives the change.

The UI fetches CMS content during `getStaticProps`. Components should not import local content JSON or Markdown, and business copy should not be added directly to JSX.

The Google Calendar destination is maintained in **Site Settings → Meeting Link**. The header, homepage, footer, and book-call band use this single value. The About video accepts standard `youtube.com` or `youtu.be` URLs in **About Page → Introduction video → URL**, with transcript copy stored beside it.

Published content changes trigger the UI deploy webhook configured through `UI_DEPLOY_WEBHOOK_URL`. Posts, testimonials, work experience, and website globals all participate so the static UI does not remain stale after an editorial update.

Build-time CMS reads use bounded timeouts and retry transient failures. Persistent CMS failures still stop the build so stale or incomplete content is never silently published.

## Development data

Run `npm run seed:core` in `portfolio-cms` with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` configured when setting up an environment. It idempotently creates or updates the shared project case studies, their tags, and testimonials through Payload REST endpoints.

Use `npm run seed:dev` locally to add the blog, page, and experience fixtures as well. Canonical case-study Markdown and full-size project images live with the CMS seed inputs. The core seed uploads images through Payload, which stores originals and generated thumbnails in PostgreSQL and attaches ordered galleries to projects. Database migrations are reserved for schema changes.
