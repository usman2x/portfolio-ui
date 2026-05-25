import React from "react"
import Link from "next/link"
import identity from "../content/misc/identity.json"
import homeContent from "../content/pages/home.json"
import contactData from "../content/misc/contact-data.json"
import { withBasePath } from "../lib/site"

const HomeIdentity = () => {
  const identitySection = homeContent.identity || {}
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
              src={withBasePath("/images/usman.jpg")}
              alt={identity.portraitAlt}
              className="identity-portrait-image"
              loading="eager"
            />
          </div>
          <div className="identity-heading-block">
            <p className="identity-name">{identity.name}</p>
            <p className="identity-title">{identity.title}</p>
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
              href={contactData.meetingLink}
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
