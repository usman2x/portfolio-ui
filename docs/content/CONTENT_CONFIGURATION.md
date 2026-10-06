# Content Configuration

The UI owns layout, interaction, routes and presentation. Payload CMS owns all publishable text,
links, option lists, ordering and page metadata. Components never hardcode business copy; the few
fixed UI labels ("Download CV", "Load more articles", "Back to all articles") are interface text.

Schema and access rules: `../portfolio-cms/docs/CONTENT_MODEL.md`. How the UI fetches and
normalizes content: `docs/CMS_INTEGRATION.md`.

## Globals

| Global | Fields the UI renders |
| --- | --- |
| **Site Settings** | `name`, `professionalTitle`, `logo`/`logoPath`/`logoAlt`, `portrait`/`portraitPath`/`portraitAlt`, `email`, `meetingLink` (every "Book a call"), `resumeLink` (CV links), `socialLinks`, `navigation` (`isPrimary` = outlined header button), `footerDescription`, `bookCall` (closing band), `defaultSeoTitle`, `defaultSeoDescription`. Also feeds the article "Written by" card. |
| **Home Page** | SEO; hero `eyebrow`, `headline`, `supportingText`, `primaryCtaLabel`, `secondaryCtaLabel`, `primaryCtaNote`; proof `proofTitle`, `proofCompanies`, `proofStats`; work `projectsTitle`, `projectsArchiveLabel`, `featuredProjects` (max 3 shown); services `servicesTitle` (empty hides the section), `servicesDescription`, `servicesLimit`; testimonial `testimonialsTitle`, `testimonialsArchiveLabel`, `testimonialLimit`; articles `writingsTitle`, `writingsDescription`, `writingsArchiveLabel`, `writingsLimit`. |
| **About Page** | SEO, `eyebrow`, `title`, `summary` (first paragraph is the lead), `video` (`title`, `description`, `url`, `transcript`, `transcriptLabel`), `strengthsTitle`, `strengths`, `experienceTitle`, `featuredTestimonial` (optional; empty hides the About testimonial). |
| **Testimonials Page** | SEO, `eyebrow`, `title` (also the About testimonial heading), `description`. |
| **Contact Page** (slug `quote-page`) | Page copy, process, alternatives, form labels and placeholders, `helpTypes` (the four intents), engagement, timeline and budget options, contact methods, submission and success messages. |
| **Archive Settings** | `writingsTitle`, `writingsDescription`, `writingsSeoDescription`, `filterTitle`, `filterDescription`, `postsPerPage`, `readArticleLabel`, `projectsTitle`, `projectsDescription`, `projectsSeoDescription`. |
| **Project Template** | `backLabel`, `stackLabel`, `linkLabel`, `defaultLinkLabel`, `linkDescription`, `storyTitle`, `previousLabel`, `nextLabel`. |
| **System Pages** | `notFoundTitle`, `notFoundMessage`, `thankYouTitle`, `thankYouMessage`, `homeButtonLabel`. |

Stored but not rendered: Site Settings `shortLabel`; Home Page `postHeroLine`,
`testimonialsEyebrow`, `testimonialsDescription`; About Page `video.eyebrow`; Archive Settings
`writingCtaLabel`.

## Collections

| Collection | Used for |
| --- | --- |
| **Posts** | Articles (no `case-study` tag) and projects (tagged `case-study`). Articles are `native` (local page) or `external` (opens the source). Projects add `projectRole`, `projectOutcome` (homepage "Outcome:" line) and an ordered `projectGallery`. |
| **Services** | Homepage "Ways to work together": `title`, `summary`, `highlights`, `contactIntent` (must match a Contact `helpTypes` value), `ctaLabel`, `showOnHome`, `sortOrder`, `status`. |
| **Work Experience** | About and `/experience/` timeline: `company`, `role`, `period` (contains "Present" for the current role), `location`, `website`, `summary`, `highlights` (the first two are shown; put measurable results first), `sortOrder`, `status`. |
| **Testimonials** | `name`, `role`, `company`, `relationship`, `quote`, `sourceLabel`, `sourceUrl`, `featured` (homepage), `sortOrder`, `status`. |
| **Tags** | Article and project tags; `slug` drives `/blog/?tag=`. |
| **Media** | Images and files; public only when `isPublic`. |
| **Contact Requests** (slug `quote-requests`) | Private form submissions, admin-only. |

## Editorial workflow

1. Edit a global or collection record in Payload Admin (`https://cms.themuhammadusman.com/admin`).
2. Save or publish. Published posts, services, testimonials, work experience and every global
   trigger the UI rebuild webhook; the static site updates when the build finishes (a minute or
   two). Admins can also use **Rebuild UI** on the dashboard.
3. Locally, restart `npm run develop` in `portfolio-ui` to pick up CMS changes.

Build-time CMS reads use bounded timeouts and retry transient failures; persistent failures stop the
build so stale or incomplete content is never published.

## Seed data

`portfolio-cms/scripts/seed-data.mjs` is the content baseline; it contains no articles. Development
articles live in `portfolio-cms/scripts/seed-articles.local.mjs` and load only through the local-only
`npm run seed:dev`; production articles are written in Payload Admin. `npm run seed:core` upserts the baseline:
records are matched by slug (posts, tags), name (testimonials), company (work experience) or title
(services) and overwritten with the seed values; globals receive every field the seed defines. It
never deletes records it does not define. Use it to set up environments; once production has been
edited in the admin, change content there instead of re-running the seed.
