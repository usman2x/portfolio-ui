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
    <section className="container identity-section" id="top">
      <div className="identity-layout">
        <div className="identity-body">
          <p className="identity-eyebrow">{eyebrow}</p>
          <h1 className="identity-headline">{headline}</h1>
          <p className="identity-supporting">{supportingText}</p>
          {trustChips.length ? (
            <ul className="identity-specialties">
              {trustChips.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
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
              href="/projects/"
              className="theme-btn-outline identity-action"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
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
