import React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import identity from "../content/misc/identity.json"
import homeContent from "../content/pages/home.json"
import contactData from "../content/misc/contact-data.json"

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
        <Link to="/about/" className="identity-link-card">
          <div className="identity-portrait">
            <StaticImage
              src="../images/usman.jpg"
              alt={identity.portraitAlt}
              placeholder="blurred"
              quality={88}
              formats={["auto", "webp", "avif"]}
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
            <Link to="/projects/" className="theme-btn-outline theme-btn-sm">
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeIdentity
