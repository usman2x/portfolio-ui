import React from "react"
import Link from "next/link"
import { withBasePath } from "../lib/site"

const HomeIdentity = ({ siteSettings, homeContent }) => {
  const identitySection = homeContent || {}
  const eyebrow = identitySection.eyebrow
  const headline = identitySection.headline
  const supportingText = identitySection.supportingText
  // trustChips stay in the CMS but are no longer shown: the proof strip below carries the
  // same facts (docs/pages/HOME_PAGE.md).
  const primaryCtaNote = identitySection.primaryCtaNote
  const primaryCtaLabel = identitySection.primaryCtaLabel
  const secondaryCtaLabel = identitySection.secondaryCtaLabel

  return (
    <section className="container identity-section" id="top">
      <div className="identity-layout">
        <div className="identity-body">
          <p className="identity-eyebrow">{eyebrow}</p>
          <h1 className="identity-headline">{headline}</h1>
          <p className="identity-supporting">{supportingText}</p>
          <div className="identity-actions">
            <a
              href={siteSettings.meetingLink}
              className="theme-btn-primary identity-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              {primaryCtaLabel}
            </a>
            <Link
              href="/#projects"
              className="theme-btn-outline identity-action"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
          {primaryCtaNote ? (
            <p className="identity-cta-note">{primaryCtaNote}</p>
          ) : null}
        </div>
        <Link href="/about/" className="identity-link-card">
          <div className="identity-portrait">
            <img
              src={
                siteSettings.portraitUrl?.startsWith("http")
                  ? siteSettings.portraitUrl
                  : withBasePath(siteSettings.portraitUrl)
              }
              alt={siteSettings.portraitAlt}
              className="identity-portrait-image"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </div>
          <div className="identity-heading-block">
            <p className="identity-name">{siteSettings.name}</p>
            <p className="identity-title">{siteSettings.professionalTitle}</p>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default HomeIdentity
