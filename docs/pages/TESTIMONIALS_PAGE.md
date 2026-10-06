# Testimonials

Route: `/testimonials/` · Page: `src/pages/testimonials.js` · Component: `TestimonialList.js`

## Page order

1. Page intro: **Testimonials Page** title (`--fs-page-title`) and description, which names the
   source once ("Recommendations on LinkedIn…"). No eyebrow.
2. One column (max 760px) of every published testimonial, ordered by `sortOrder`, separated by
   hairlines with half a `--section-gap` above and below each quote. No boxes. Each entry: the full
   quote (Newsreader italic, `--fs-quote`, paragraphs kept), then a caption with the initial
   avatar, the name (linked to `sourceUrl` when set) and role · company · relationship
   ("managed Muhammad"). No per-entry source label. Only quotes longer than 600 characters
   collapse, cut at a word boundary, with a "Read the full recommendation" / "Show less" toggle.
3. Closing band

## Other uses of `Testimonials.js`

- **Homepage** (`variant="home"`): the first featured testimonial, teaser only (no toggle), with
  "Read on LinkedIn" when the source is LinkedIn. See `docs/pages/HOME_PAGE.md`.
- **About** (`variant="home"`, full quote, relationship shown): the About Page's featured
  testimonial on the tinted band. See `docs/pages/ABOUT_PAGE.md`.

## Content

- **Testimonials Page** global: SEO, title, description (`eyebrow` is no longer shown)
- **Testimonials** collection: name, role, company, relationship (manager, colleague, client,
  other), quote, source label and URL, `featured`, `sortOrder`, `status`
- **Home Page → testimonialLimit** and the featured flag control the homepage preview
