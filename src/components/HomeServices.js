import React from "react"
import Link from "next/link"

// "Ways to work together": published Services rows marked showOnHome. Each card opens the
// contact wizard with its intent preselected. Hidden when the CMS has no title or no rows.
const HomeServices = ({ services = [], homeContent }) => {
  const title = homeContent?.servicesTitle
  const items = services.slice(0, homeContent?.servicesLimit || 4)
  if (!title || !items.length) return null

  return (
    <section
      id="services"
      className="home-services"
      aria-labelledby="home-services-title"
    >
      <div className="container home-services-inner">
        <div className="home-services-heading">
          <h2 id="home-services-title" className="landing-section-title">
            {title}
          </h2>
          {homeContent.servicesDescription ? (
            <p className="home-services-description">
              {homeContent.servicesDescription}
            </p>
          ) : null}
        </div>
        <ul className="home-services-list">
          {items.map((service, index) => (
            <li key={service.id}>
              <Link
                href={`/contact/?intent=${encodeURIComponent(
                  service.contactIntent
                )}`}
                className="home-service-card"
              >
                <span className="home-service-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="home-service-title">{service.title}</h3>
                <p className="home-service-summary">{service.summary}</p>
                {service.highlights.length ? (
                  <ul className="home-service-highlights">
                    {service.highlights.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                <span className="home-service-cta">{service.ctaLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default HomeServices
