import React, { useEffect, useRef } from "react"

// Each role is a row: dates, company and location on the left; on the right a hairline rail
// with a node per role (filled for the current one), the title, summary and the first two
// highlights. Highlights are ordered in the CMS so the measurable results come first.
// While scrolling, a brand fill travels down the rail to the reach line and lights each node it
// passes. Without JS, or under reduced motion, the rail stays a static hairline.
const HIGHLIGHT_LIMIT = 2
const REACH_LINE = 0.62 // fraction of the viewport height the fill reaches

const WorkExperienceTimeline = ({ entries = [], title, cvHref, cvLabel = "Download full CV" }) => {
  const listRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

    const segments = Array.from(list.querySelectorAll(".experience-what"))
    let frame = 0

    const update = () => {
      frame = 0
      const reachY = window.innerHeight * REACH_LINE
      // At the page bottom the last roles may never cross the reach line.
      const atPageEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      segments.forEach(segment => {
        const rect = segment.getBoundingClientRect()
        const progress = atPageEnd
          ? 1
          : Math.min(Math.max((reachY - rect.top) / Math.max(rect.height, 1), 0), 1)
        segment.style.setProperty("--rail-progress", progress.toFixed(4))
        // The node sits 8px below the segment top.
        segment.toggleAttribute("data-reached", atPageEnd || rect.top + 8 <= reachY)
      })
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    list.setAttribute("data-animated", "")
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      list.removeAttribute("data-animated")
    }
  }, [entries])

  if (!entries.length) return null

  return (
    // id="experience" is the target of the retired /experience/ route (redirected in Caddy).
    <section id="experience" className="experience-section" aria-labelledby="experience-title">
      <div className="landing-section-header experience-header">
        <h2 id="experience-title" className="landing-section-title">{title}</h2>
        {cvHref ? (
          <a href={cvHref} target="_blank" rel="noopener noreferrer" className="text-link-cta link-underline">
            {cvLabel}
          </a>
        ) : null}
      </div>
      <ol className="experience-list" ref={listRef}>
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
              <span className="experience-rail-fill" aria-hidden="true" />
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
