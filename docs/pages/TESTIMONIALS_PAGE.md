# Testimonials

Route: `/testimonials/` · Page: `src/pages/testimonials.js` · Component: `Testimonials.js`

## Page order

1. Page intro: **Testimonials Page** eyebrow, title (`--fs-page-title`) and description
2. Grid of every published testimonial, ordered by `sortOrder`. Each card (hairline, 16px corners)
   shows the quote (Newsreader italic), attribution (avatar initial, name, role and company) and
   the source label, linked when `sourceUrl` is set. Quotes longer than 260 characters are cut at a
   word boundary with a "Read full recommendation" / "Show less" toggle.
3. Closing band

## Other uses of the component

- **Homepage** (`variant="home"`): the first featured testimonial, teaser only (no toggle), with
  "Read on LinkedIn" when the source is LinkedIn. See `docs/pages/HOME_PAGE.md`.
- **About** (`variant="home"`, full quote, relationship shown): the About Page's featured
  testimonial on the tinted band. See `docs/pages/ABOUT_PAGE.md`.

## Content

- **Testimonials Page** global: SEO, eyebrow, title, description
- **Testimonials** collection: name, role, company, relationship (manager, colleague, client,
  other), quote, source label and URL, `featured`, `sortOrder`, `status`
- **Home Page → testimonialLimit** and the featured flag control the homepage preview
