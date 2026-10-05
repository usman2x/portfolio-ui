# Style Guide

The visual system for every page. Tokens live in `src/styles/global.css`: palette and theme
tokens at the top, the shared scale in the "Phase F" block, About-specific rules in "Phase G",
and site-wide page rules in "Phase H".

## Direction

- Calm, content-led and minimal: typography, spacing and hierarchy carry the design.
- One moment of emphasis per section; colour creates focus, not decoration.
- Quiet is not flat: the homepage opens with large display type and concrete proof.

## Themes

- `sunset` (light, default) and `dark`, set as `data-theme` on `<html>`.
- The first visit follows the operating-system preference; the header toggle overrides it and is
  remembered in `localStorage` (`site-theme`).
- Components use semantic tokens only, never raw hex values.

## Palette

The palette is fixed. Contrast is met through how colours are used, never by changing values.

| Token | sunset | dark |
| --- | --- | --- |
| `--color-primary` / `--brand-primary` | `#E97A3C` | `#F19A64` |
| `--color-secondary` | `#F2B38A` | `#BF8F72` |
| `--color-accent` | `#6F8798` | `#8EA8BB` |
| `--bg-page` | `#F7F3EE` | `#171514` |
| `--bg-card` | `#FFFFFF` | `#221F1D` |
| `--text-main` | `#2F2F2F` | `#F7F3EF` |
| `--text-muted` | `#6B6B6B` | `#D1C8C1` |
| `--border-default` | `#C9C3BD` | `#3D3733` |

Derived tokens:

- `--brand-text`: main text in sunset, primary in dark. Use it for text or rings that should carry
  brand emphasis.
- `--on-brand`: label colour on filled primary buttons.
- `--bg-brand-soft` (8% primary) and `--bg-brand-soft-strong` (14%): tinted band and portrait
  offset block.
- `--hairline`: `color-mix(--border-default 70%, transparent)` in sunset, `--border-default` in dark.
- Inverse closing surface: `--surface-inverse` (`#2F2F2F` / `#221F1D`), `--on-inverse`,
  `--on-inverse-muted` (`#D1C8C1`), `--inverse-line`.

### Contrast (required)

- Every text pair meets WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text (24px, or 19px bold),
  UI boundaries and focus indicators. Check new pairs in both themes before merging.
- Sunset primary is 2.6:1 on the page, so in light mode it is only for fills, underlines, borders,
  indicators and tints, never text or focus rings.
- Muted text fails on the 8% tint in sunset (4.48:1); text on tinted bands uses main text.
- Focus rings: 3px `--brand-text` on the page, cards and tinted band; `--color-primary` on the
  inverse surface.

## Typography

Three faces, self-hosted by `next/font` in `src/pages/_app.js`, each with one job:

| Role | Face | Use |
| --- | --- | --- |
| Display / section / quote | Newsreader (optical sizes) | page titles, section titles, proof values, quotes (italic) |
| Body / item | Inter | running text, summaries, card titles (600), navigation, buttons |
| Meta | IBM Plex Mono | eyebrows, dates, reading time, roles, labels (uppercase, 0.06em) |

`next/font` defines the face variables (`--font-serif`, `--font-sans`, `--font-mono-face`) on the
`.font-root` wrapper. The role tokens (`--font-heading`, `--font-body`, `--font-mono`) are declared
on both `:root` and `.font-root`; declared only on `:root` they silently fall back to Georgia and
system fonts.

### Scale

| Token | Size | Line height | Use |
| --- | --- | --- | --- |
| `--fs-meta` | 13px | 1.3 | mono labels, dates, roles, tags |
| `--fs-ui` | 15px | 1.45 | navigation, buttons, captions, CTA links, footer |
| `--fs-body` | 17px | 1.6 | summaries, card and section copy |
| lead | 20px | 1.6 | page-intro and hero paragraphs |
| `--fs-item` | 22px | 1.3 | card, service, role and article titles (Inter 600) |
| prose headings | 24–28px | 1.25 | `h2` inside article and case-study bodies |
| `--fs-quote` | 22–28px | 1.45 | testimonials (Newsreader italic) |
| `--fs-section` | 30–40px | 1.12 | section titles (Newsreader 500) |
| `--fs-stat` | 36–44px | 1 | proof values |
| `--fs-page-title` | 36–48px | 1.08 | archive and utility page titles |
| `--fs-display` | 40–60px | 1.04 | Home, About, case-study and article titles (Newsreader 600) |

- Home and About are the most prominent pages; archive and utility pages (Projects, Articles,
  Testimonials, Contact, 404, Thank-you) use `--fs-page-title`.
- Headings use `text-wrap: balance`; display titles are capped at 21–22ch, paragraphs at 52–62ch.
- Monospace never sets sentences or headings.

## Spacing

- 8px grid (4 and 12 allowed for tight pairs).
- `--section-gap` (80–128px) between sections, always larger than the space inside a section.
- Page top: `clamp(3rem, 7vw, 6rem)` above the first heading on every page.
- Section heading to content: 40–48px. Inside an item: 8px meta→title, 12px title→summary,
  16px summary→outcome.
- Every page ends a full `--section-gap` above the closing section.
- Container: `.container`, 1120px max including 20px side padding (15px on phones). Every section
  shares this edge.

## Surfaces

- No box shadows anywhere.
- Cards and media: one 1px `--hairline`, 16px corners. Hover warms the border toward
  `--brand-primary`; media may lift 3px on fine pointers only.
- Three surfaces besides the page:
  - **Tinted band** (`--bg-brand-soft`, full-bleed, hairlines top and bottom): homepage services
    and the About testimonial. Cards on it are `--bg-card`.
  - **Inverse closing surface**: the book-call section and footer, site-wide.
- No gradients or large saturated blocks.

## Components

### Page intro

Optional mono eyebrow, title, then a 20px muted lead (max 56ch), left-aligned. Used by Projects,
Articles, Testimonials, Contact, 404 and Thank-you (`.page-intro`). Home, About, case studies and
articles have their own intros with the same rhythm.

### Buttons

- `.theme-btn-primary` (filled) and `.theme-btn-outline`: 44px tall, 15px, 8px corners.
- Large, 52px / 16px / 10px corners: hero, About intro and closing CTAs only.
- One orange primary per view. Secondary actions (header "Book a Call", share, load more, back to
  home) are outlined.
- Press feedback `scale(0.97)`, removed under reduced motion.

### Links

- `.text-link-cta`: main text with a persistent 2px `--brand-primary` underline ("All articles",
  "View case study", back links), identifiable without colour.
- Navigation links reveal a primary underline on hover and focus; the active page keeps it.
- Back links are CTA links: "Back to all projects", "Back to all articles".

### Tags

Pill chips: card background, muted mono text, hairline border. Archive and detail pages only; the
homepage shows no tags. Tags are plain words, never prefixed with `#`.

### Cards in use

- Project card: no outer box; image, role, title, summary, tags, CTA.
- Article card (archive): hairline box with meta, title, description, tags, CTA, optional image.
- Homepage article: hairline-separated row link.
- Service card: `--bg-card` box on the tinted band; the whole card is a link.
- Testimonial card (archive): hairline box; on Home and About the quote sits unboxed.

## Motion

- Animate only `transform` and `opacity`, at most 300ms, with the easing tokens in `global.css`.
- Hover movement only under `@media (hover: hover) and (pointer: fine)`.
- Under `prefers-reduced-motion: reduce` movement is removed; short colour changes remain.
- The reading progress bar updates directly with `requestAnimationFrame`, without transitions.

## Accessibility

- Semantic landmarks, one `h1` per page, a visible focus ring on every interactive element.
- Touch targets at least 44px; form inputs at least 16px.
- No horizontal scroll at 390px.
- Verify changes at 1440px and 390px in both themes, with the keyboard and with reduced motion.
