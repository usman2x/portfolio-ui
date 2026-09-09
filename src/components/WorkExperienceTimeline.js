import React, { useMemo, useState } from "react"

const WorkExperienceTimeline = ({ entries: sourceEntries = [], title }) => {
  const entries = useMemo(() => sourceEntries || [], [sourceEntries])
  const [activeId, setActiveId] = useState(entries[0]?.id || "")
  const activeEntry = entries.find((entry) => entry.id === activeId) || entries[0]

  if (!activeEntry) {
    return null
  }

  return (
    <section className="interior-section">
      <h2 className="interior-section-title">{title}</h2>
      <div className="work-experience-layout">
        <div className="work-experience-nav" role="tablist" aria-label="Work experience timeline">
          {entries.map((entry) => {
            const isActive = entry.id === activeEntry.id
            return (
              <button
                key={entry.id}
                type="button"
                className={`work-experience-item ${isActive ? "active" : ""}`}
                onClick={() => setActiveId(entry.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`work-experience-panel-${entry.id}`}
                id={`work-experience-tab-${entry.id}`}
              >
                <span className="work-experience-period">{entry.period}</span>
                <span className="work-experience-company">{entry.company}</span>
                <span className="work-experience-role">{entry.role}</span>
              </button>
            )
          })}
        </div>

        <article
          className="work-experience-panel"
          role="tabpanel"
          id={`work-experience-panel-${activeEntry.id}`}
          aria-labelledby={`work-experience-tab-${activeEntry.id}`}
        >
          <p className="work-experience-panel-period">{activeEntry.period}</p>
          <h3 className="work-experience-panel-title">
            {activeEntry.role} at {activeEntry.company}
          </h3>
          <p className="work-experience-panel-meta">{activeEntry.location}</p>
          <p className="work-experience-panel-summary">{activeEntry.summary}</p>
          {activeEntry.website ? (
            <a
              href={activeEntry.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link-cta link-underline"
            >
              Visit company
            </a>
          ) : null}
          <ul className="work-experience-highlights">
            {activeEntry.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default WorkExperienceTimeline
