# Style Guide

This is the minimal visual reference for the current site.

---

## Design Direction

- Blog-first, content-heavy, calm, and minimal.
- Balance **readability (like Medium)** with **subtle brand expression**.
- Let typography, spacing, and hierarchy carry most of the design.
- Use color intentionally to create **focus and identity**, not decoration.
- Aim for a quiet interface with **one moment of emphasis per section**.
- Quiet does not mean flat: the homepage opening and proof points should feel confident, with large display type and concrete evidence before any content lists.

---

## Theme System

- Theme values live in `src/styles/global.css`.
- Use semantic tokens, not raw hex values, in component styling.
- Active themes:

  - `sunset` (light)
  - `dark` (alternate)

- The initial theme follows the visitor's operating-system preference. A navigation-bar toggle lets the visitor override it, and that choice is remembered locally.

---

## Color Palette

Default `sunset` theme:

- Primary: `#E97A3C`
- Secondary: `#F2B38A`
- Accent: `#6F8798`
- Page background: `#F7F3EE`
- Card background: `#FFFFFF`
- Main text: `#2F2F2F`
- Muted text: `#6B6B6B`
- Border: `#C9C3BD`

### Derived Surface Tokens (Required)

Use soft tinted backgrounds to introduce subtle visual structure:

- `--bg-brand-soft`: rgba(233, 122, 60, 0.08)
- `--bg-brand-soft-strong`: rgba(233, 122, 60, 0.14) (rare use)
- `--bg-accent-soft`: rgba(111, 135, 152, 0.08)

These should be used for:

- Section separation
- Hero or intro surfaces
- Subtle emphasis blocks

---

## Color Usage Rules

- Use `--text-main` and `--text-muted` for most of the interface.
- Use `--brand-primary` for:

  - Links
  - Active states
  - One key emphasis per section

- Use `--brand-accent` for:

  - Tags
  - Secondary emphasis
  - Contrast against warm primary areas

- Keep backgrounds mostly neutral, but introduce **soft tinted sections** for rhythm.
- Avoid large areas of fully saturated brand color.
- Borders should remain subtle and structural.

### Contrast (Required)

The palette is fixed. Contrast is met through how each color is used, never by changing palette values.

- Every text/background pair meets WCAG 2.2 AA: `4.5:1` for body and small text, `3:1` for large text (24px, or 19px bold), UI boundaries, and focus indicators.
- Sunset primary `#E97A3C` measures 2.6:1 on the page background, so in the light theme it is used for fills, underlines, borders, active indicators, and tints, not for text. Text that should carry brand emphasis uses `--brand-text` (main text in light, primary in dark, where it measures 8.3:1).
- Filled primary buttons use `--on-brand`: main text `#2F2F2F` on `#E97A3C` (4.66:1) in light; page background on primary in dark (8.3:1). Hover blends the primary toward the secondary so the label keeps contrast.
- Muted text `#6B6B6B` passes on the page and cards but not on the 8% brand tint (4.48:1); copy inside tinted containers uses main text.
- Accent `#6F8798` is for tag and structural accents, not small text (3.4:1).
- Focus rings use `--brand-text` at 3px.
- Verify new color pairs with a contrast calculation before merging, in both themes.

### Emphasis Rule (Core Principle)

Each section should have:

- **One primary visual focus**
- Color should support that focus, not compete across multiple elements

---

## Typography

Three typefaces, each with one job. All are self-hosted by `next/font` in `src/pages/_app.js` (downloaded at build time, served from the site's own origin, no third-party requests at runtime) and exposed as `--font-heading`, `--font-body`, and `--font-mono`.

| Role | Face | Weight | Used for |
| --- | --- | --- | --- |
| Display | Newsreader (serif, optical sizes) | 600 | homepage headline, page titles, case-study titles |
| Section | Newsreader | 500 | section titles, article `h2`/`h3`, proof numbers |
| Quote | Newsreader italic | 400 | testimonials |
| Item | Inter | 600 | card, list, and option titles |
| Body | Inter | 400 | running text, summaries, navigation, buttons |
| Meta | IBM Plex Mono | 400–500 | dates, reading time, tags, eyebrows, labels |

- Card and list titles use the sans, not the serif, so they read as items rather than sections.
- Monospace is for metadata only; never set sentences or headings in it.
- Uppercase is limited to short mono labels (eyebrows, dates).
- Base font size: `18px`
- Base line height: `1.7`
- Long-form content width: `680px` (case-study body `760px`)

Type scale (tokens in `global.css`, 1.25 ratio from the 16px root):

| Token | Size | Use |
| --- | --- | --- |
| hero | `clamp(2.1rem, 3.8vw, 3.2rem)` | homepage headline only |
| `--fs-h1` | `clamp(2.1rem, 3.8vw, 3rem)` | page titles |
| `--fs-h2` | `clamp(1.65rem, 2.6vw, 2.25rem)` | section titles |
| `--fs-h3` | `1.3rem` | card and list titles |
| `--fs-lead` | `clamp(1.1rem, 1.4vw, 1.25rem)` | page intros and summaries |
| body | `1.125rem` | running text |
| `--fs-small` | `0.9375rem` | meta lines, labels |
| `--fs-meta` | `0.8125rem` | tags, eyebrows; the minimum text size |

- Headings use `text-wrap: balance`; long titles are capped near `20–24ch`.

Typography rules:

- `h1` to `h4` default to the serif; item-level headings override to the sans
- Do not load render-blocking font stylesheets from third-party origins
- Prioritize readable paragraph rhythm over dense layouts
- Prefer strong type hierarchy over heavy UI treatment
- Keep headings clear and direct

### Spacing Rhythm

- Headings should have more top margin than bottom margin
- Paragraph spacing should support relaxed reading
- Maintain consistent vertical rhythm across sections
- Interactive targets should be at least `44px` on touch layouts. Primary homepage actions use a `48px` minimum height.
- Every animated transition must respect `prefers-reduced-motion`.

---

## Components

### Buttons

- Use:

  - `.theme-btn-outline` as default
  - `.theme-btn-primary` only for key actions (hero, main CTA)
- Minimum height `40px`, and `44px` on touch (`pointer: coarse`)

- Buttons should feel functional, not promotional
- Avoid multiple competing button styles in one section

### Cards

- Use `.card` only when grouping improves scanning
- Avoid unnecessary card usage
- Featured cards may:

  - Use subtle brand border accents
  - Slight background variation on hover

### Links

- Inline and navigation links: `--brand-primary` or text color, underline revealed on hover/focus
- Call-to-action text links (`.text-link-cta`: "Read more", "All writings", "View case study"): `--text-main` with a persistent 2px `--brand-primary` underline, so they are identifiable without relying on color (WCAG 1.4.1)
- Keep visually understated but clearly identifiable
- Use a left-to-right underline transition in the primary color
- Keep hover underlines aligned to the link text itself, not the full row or container width

### Tags

- Background: `--bg-accent-soft`
- Text: `--brand-accent`
- Keep compact and quiet

---

## Layout Rules

- Keep section spacing consistent and generous
- Prefer vertical flow over complex multi-column layouts
- Use fewer containers and more whitespace
- Prefer spacing over divider lines between sections
- Use **alternating background surfaces** for section separation:

  - `--bg-page`
  - `--bg-brand-soft`

- Keep navigation and footer visually quiet
- Show the CMS-configured site logo and the light/dark theme control in the top navigation.
- Header and footer may use a subtle full-width structural divider line to read as site chrome rather than page content
- Footer should read as a restrained full-width closing section through spacing and soft tone, not through heavy card treatment
- Favor rhythm and scanning over density

---

## Section Design Guidelines

### Section Headings

- Default to one visible heading per section
- Avoid eyebrow + title + descriptive line stacks for standard content sections
- Reserve extra heading lines for true page-intro contexts only
- Let supporting copy read like body text, not a second or third heading

### Hero Section

- Sit directly on `--bg-page`; do not wrap the hero in a bordered, shadowed card
- Lead with the headline: display serif at `clamp(2.1rem, 3.8vw, 3.2rem)`, tight line height, balanced wrapping
- The eyebrow uses a darkened `--brand-accent` (not `--brand-primary`) so the primary color stays reserved for the main action
- Show specialties as a quiet inline list separated by middots, not as pill chips
- The portrait sits beside the copy on desktop with one offset `--bg-brand-soft-strong` block behind it; this is the section's single decorative moment
- On mobile the portrait, name, and title collapse into a compact row above the headline
- Avoid gradients and large saturated color blocks

### Proof Strip

- Follows the hero on the homepage, separated by a single structural rule aligned to the content edge
- Up to four stats: large serif value in `--text-main`, short muted label beneath
- Company names render as quiet text wordmarks with a small uppercase label; no logos unless licensed and consistent
- Every stat must be backed by a case study or work-experience entry

### Content Sections

- Default to neutral backgrounds
- Introduce tinted backgrounds sparingly for contrast
- Ensure clear entry point for the eye
- On information-dense detail pages, use typography and section rhythm as the main separator before adding stronger surfaces

### Featured Elements

- Use subtle emphasis:

  - border accents
  - soft background shifts

- Avoid heavy shadows or loud styling
- On the homepage, featured project previews should feel lighter than archive cards and rely on consistent image sizing plus spacing over card borders

---

## Do / Don't

### Do

- Use theme tokens from `global.css`
- Use color to guide attention, not decorate
- Maintain one clear focal point per section
- Preserve consistency across components
- Use soft surfaces to create structure
- Keep UI quiet so content leads
- Use imagery in project previews and project detail pages when available

### Don't

- Introduce random new colors outside the theme system
- Hardcode palette values inside components
- Apply brand color to multiple competing elements
- Overuse cards, borders, or visual containers
- Use divider lines when spacing can carry the separation
- Use gradients, heavy shadows, or loud UI by default
- Let portfolio elements overpower readability
- Keep everything neutral to the point of flatness

---

## Mental Model (Reference)

- Typography → carries content
- Spacing → creates clarity
- Color → creates focus

If everything is minimal, nothing stands out.
Use restraint, but allow intentional emphasis.
