import React from "react"
import Link from "next/link"
import { withBasePath } from "../lib/site"

const HomeIdentity = ({ siteSettings, homeContent }) => {
  const identitySection = homeContent || {}
  const eyebrow = identitySection.eyebrow
  const headline = identitySection.headline
  const supportingText = identitySection.supportingText
  const trustChips = Array.isArray(identitySection.trustChips)
    ? identitySection.trustChips
    : []
  const primaryCtaLabel = identitySection.primaryCtaLabel
  const secondaryCtaLabel = identitySection.secondaryCtaLabel

  return (
    <section
      className="container landing-section landing-section-surface landing-section-surface-brand identity-section"
      id="top"
    >
      <div className="identity-layout">
        <Link href="/about/" className="identity-link-card">
          <div className="identity-portrait">
            <img
              src={siteSettings.portraitUrl?.startsWith("http") ? siteSettings.portraitUrl : withBasePath(siteSettings.portraitUrl)}
              alt={siteSettings.portraitAlt}
              className="identity-portrait-image"
              loading="eager"
            />
          </div>
          <div className="identity-heading-block">
            <p className="identity-name">{siteSettings.name}</p>
            <p className="identity-title">{siteSettings.professionalTitle}</p>
          </div>
        </Link>
        <div className="identity-body">
          <p className="identity-eyebrow">{eyebrow}</p>
          <h1 className="identity-headline">{headline}</h1>
          <p className="identity-supporting">{supportingText}</p>
          {trustChips.length ? (
            <ul className="identity-trust-chips">
              {trustChips.map((item) => (
                <li key={item} className="identity-trust-chip">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="identity-actions">
            <a
              href={siteSettings.meetingLink}
              className="theme-btn-primary theme-btn-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {primaryCtaLabel}
            </a>
            <Link href="/projects/" className="theme-btn-outline theme-btn-sm">
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeIdentity
