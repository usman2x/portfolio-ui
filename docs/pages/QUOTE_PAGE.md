# Quote Page Blueprint

This document defines the structure for the quote / project intake page.

It is meant to replace a generic contact form with a clearer qualification flow.

## Goal
- Help visitors describe a concrete ask
- Capture better inbound leads
- Make the CTA `Get a Quote` meaningful
- Keep the experience simple and guided

## Delivery and storage

The form posts JSON to `NEXT_PUBLIC_CMS_URL/api/quote-requests/submit`. Successful submissions are stored in Payload's private `quote-requests` collection and are visible to active CMS administrators under **Quote Requests**. Public API users cannot list, read, update, or delete submissions.

The endpoint validates every select value, normalizes and limits text fields, restricts browser origins with `UI_PUBLIC_URL` / `QUOTE_ALLOWED_ORIGINS`, and includes a honeypot plus lightweight rate limiting. Production deployments should set both origin variables explicitly.

## Recommended URL
Preferred:
- `/quote/`

Alternative:
- `/start-a-project/`

Recommendation:
- Use `/quote/` if you want the shortest and clearest CTA destination.
- Use `/start-a-project/` if you want a more consultative tone.

## SEO Direction
Recommended title:
- `Get a Quote | Muhammad Usman`

Recommended description direction:
- `Share your project scope, timeline, and goals to get a clearer estimate for engineering, data, or AI-related work.`

Canonical:
- self-referencing canonical for the chosen route

## Page Purpose
This page should answer:
- What kind of help do you need?
- What are you trying to build or improve?
- How urgent is it?
- What level of engagement are you expecting?
- How should I respond?

## Page Structure
1. Intro block
2. Quote wizard or guided intake form
3. Alternative actions
4. Trust / credentials strip
5. Footer

## 1. Intro Block
Purpose:
- Frame the page clearly before asking for input

Required content:
- Page title
- 2 to 3 line explanation

Recommended title:
- `Get a Quote`

Recommended supporting copy:
- `Tell me what you need help with and I’ll respond with the best next step, whether that’s a quote, a call, or a clarification request.`

Optional supporting line:
- `Best for product engineering, platform work, data systems, and practical AI implementation.`

Rule:
- Keep this section brief.
- It should reduce ambiguity, not sell aggressively.

## 2. Quote Wizard / Guided Intake
Purpose:
- Replace a blank message box with structured input

Recommended flow:
1. What do you need help with?
2. What type of work is this?
3. What is your timeline?
4. What is your budget or engagement range?
5. What should I know before replying?
6. How should I contact you?

## Step 1: What do you need help with?
Goal:
- Identify the core request

Recommended options:
- Build a new product or feature
- Improve or modernize an existing system
- Data platform / ETL / analytics work
- AI integration or workflow automation
- Architecture review or technical consulting
- Something else

Rule:
- One primary choice should be enough to route the rest of the intake.

## Step 2: What type of work is this?
Goal:
- Clarify scope shape

Recommended options:
- Short consultation
- Fixed-scope project
- Ongoing engineering support
- Audit / review / assessment

Rule:
- This helps distinguish between quoting, consulting, and advisory work.

## Step 3: What is your timeline?
Goal:
- Understand urgency and planning horizon

Recommended options:
- ASAP
- Within 2 weeks
- Within 1 month
- Within 1 to 3 months
- Flexible / exploring

Rule:
- Keep the options simple and business-readable.

## Step 4: Budget or Engagement Range
Goal:
- Help qualify seriousness without forcing precision

Recommended options:
- Under $2k
- $2k to $5k
- $5k to $10k
- $10k+
- Prefer to discuss first

Rule:
- Use ranges, not a raw numeric field only.
- This should qualify gently, not feel hostile.

## Step 5: Additional Context
Goal:
- Let the user explain the ask in plain language

Recommended field:
- one open text area

Suggested prompt:
- `What are you trying to build, improve, or fix? Include any useful context.`

Rule:
- This is the only free-form section.
- Everything before it should reduce ambiguity.

## Step 6: Contact Details
Goal:
- Make follow-up easy and structured

Recommended fields:
- Name
- Email
- Company or project name
- Preferred contact method

Preferred contact method options:
- Email
- WhatsApp
- Schedule a call

Optional:
- LinkedIn profile

Rule:
- Ask only for what is needed to continue the conversation.

## 3. Alternative Actions
Purpose:
- Support users who are not ready for the full quote flow

Recommended alternatives:
- `Book a Call`
- `Email Me`
- `Connect on WhatsApp`

Rule:
- These should be secondary to the quote flow, not competing primary actions.

## 4. Trust / Credentials Strip
Purpose:
- Reassure the user before submission

Recommended contents:
- LinkedIn
- GitHub
- Resume
- Short trust line

Example trust line:
- `8+ years across full-stack engineering, data systems, cloud delivery, and AI-enabled product work.`

Rule:
- Keep this compact.
- It should support confidence, not distract from completion.

## 5. Footer
Purpose:
- Keep site-wide consistency

Footer should match the global footer structure used on the rest of the site.

## CTA Hierarchy on This Page
- Primary: `Submit Quote Request`
- Secondary: `Book a Call`
- Utility: `Email` / `WhatsApp`

Rule:
- Do not add multiple primary buttons.

## Recommended Content Model
For best practice, this page should be configurable.

Suggested content file:
- Payload **Quote Page** global

Suggested fields:
- page title
- intro copy
- step labels
- option lists
- field labels
- success message
- alternative CTA labels

Rule:
- The wizard structure can live in components.
- The step labels and option sets should live in content files.

## Suggested Success State
After submission, user should see:
- confirmation message
- expected response window
- optional backup contact methods

Recommended message direction:
- `Thanks. I’ve received your request and will review it before replying with the best next step.`

Optional supporting line:
- `If your request is urgent, you can also reach out by email or WhatsApp.`

## Internal Linking Rules
This page should be linked from:
- homepage primary CTA
- About page CTA
- project detail page CTA
- footer CTA

This page should link out to:
- Book a Call
- Email
- WhatsApp
- credentials if needed

## What to Avoid
- Generic `Message` as the only input
- Long multi-paragraph intros
- Too many required fields
- Forcing exact budgets
- Mixing quote flow with unrelated newsletter/contact behavior
- Hiding backup contact options
