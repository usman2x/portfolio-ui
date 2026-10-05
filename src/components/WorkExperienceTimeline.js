import React from "react"

// Each role is a row: dates, company and location on the left; on the right a hairline rail
// with a node per role (filled for the current one), the title, summary and the first two
// highlights. Highlights are ordered in the CMS so the measurable results come first.
const HIGHLIGHT_LIMIT = 2

const WorkExperienceTimeline = ({ entries = [], title, cvHref, cvLabel = "Download full CV", headingLevel = "h2" }) => {
  if (!entries.length) return null
  // /experience/ has no other heading, so it renders the title as the page's h1.
  const Heading = headingLevel

  return (
    <section className="experience-section" aria-labelledby="experience-title">
      <div className="landing-section-header experience-header">
        <Heading id="experience-title" className="landing-section-title">{title}</Heading>
        {cvHref ? (
          <a href={cvHref} target="_blank" rel="noopener noreferrer" className="text-link-cta link-underline">
            {cvLabel}
          </a>
        ) : null}
      </div>
      <ol className="experience-list">
        {entries.map((entry, index) => (
          <li key={entry.id} className="experience-role">
            <div className="experience-when">
              <span className="experience-period">{entry.period}</span>
              {entry.website ? (
                <a
                  href={entry.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="experience-company"
                >
                  {entry.company}
                </a>
              ) : (
                <span className="experience-company">{entry.company}</span>
              )}
              {entry.location ? <span className="experience-where">{entry.location}</span> : null}
            </div>
            <div
              className={[
                "experience-what",
                entry.isCurrent ? "experience-what-current" : "",
                index === entries.length - 1 ? "experience-what-last" : "",
              ].filter(Boolean).join(" ")}
            >
              <h3 className="experience-title">{entry.role}</h3>
              {entry.summary ? <p className="experience-summary">{entry.summary}</p> : null}
              {entry.highlights?.length ? (
                <ul className="experience-highlights">
                  {entry.highlights.slice(0, HIGHLIGHT_LIMIT).map(highlight => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default WorkExperienceTimeline
