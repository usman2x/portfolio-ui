import React, { useEffect, useRef } from "react"

// The rail fills with scroll progress; each role's node lights when the fill
// reaches it, and its card reveals once. Without JS, or under reduced motion,
// the timeline renders fully drawn and every card is visible.
const REACH_LINE = 0.62 // fraction of the viewport height the fill reaches

const WorkExperienceTimeline = ({ entries = [], title }) => {
  const timelineRef = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const timeline = timelineRef.current
    const fill = fillRef.current
    if (!timeline || !fill) return undefined
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

    const rail = fill.parentElement
    const items = Array.from(timeline.querySelectorAll(".experience-entry"))
    let frame = 0

    const update = () => {
      frame = 0
      const rect = rail.getBoundingClientRect()
      const reachY = window.innerHeight * REACH_LINE
      // At the page bottom the last roles may never cross the reach line.
      const atPageEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      const progress = atPageEnd
        ? 1
        : Math.min(Math.max((reachY - rect.top) / rect.height, 0), 1)
      fill.style.transform = `scaleY(${progress})`

      items.forEach(item => {
        const node = item.querySelector(".experience-node")
        const reached = atPageEnd || node.getBoundingClientRect().top <= reachY
        item.toggleAttribute("data-reached", reached)
        if (reached) item.setAttribute("data-revealed", "")
      })
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    timeline.setAttribute("data-animated", "")
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      timeline.removeAttribute("data-animated")
    }
  }, [entries])

  if (!entries.length) return null

  return (
    <section className="interior-section experience-section">
      <h2 className="interior-section-title">{title}</h2>
      <div className="experience-timeline" ref={timelineRef}>
        <span className="experience-rail" aria-hidden="true">
          <span className="experience-rail-fill" ref={fillRef} />
        </span>
        <ol className="experience-list">
          {entries.map(entry => (
            <li key={entry.id} className="experience-entry">
              <span className="experience-node" aria-hidden="true" />
              <article className="experience-card">
                <p className="experience-period">{entry.period}</p>
                <h3 className="experience-title">
                  {entry.role}
                  <span className="experience-company">
                    <span className="experience-at">at</span> {entry.company}
                  </span>
                </h3>
                {entry.location || entry.website ? (
                  <p className="experience-meta">
                    {entry.location ? <span>{entry.location}</span> : null}
                    {entry.website ? (
                      <a
                        href={entry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link-cta link-underline"
                      >
                        Visit company
                      </a>
                    ) : null}
                  </p>
                ) : null}
                <p className="experience-summary">{entry.summary}</p>
                {entry.highlights?.length ? (
                  <ul className="experience-highlights">
                    {entry.highlights.map((highlight, index) => (
                      <li key={highlight} style={{ transitionDelay: `${120 + index * 60}ms` }}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default WorkExperienceTimeline
