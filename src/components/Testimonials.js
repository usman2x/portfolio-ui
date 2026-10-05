import React, { useState } from "react"
import Link from "next/link"

// Cut at the last word boundary before the limit, never mid-word.
const truncateAtWord = (text, limit) => {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, "")}…`
}

const Testimonials = ({ testimonials = [], content, archiveHref, showHeading = true, variant = "default", showRelationship = false, quoteLimit = 260 }) => {
  const isHome = variant === "home"
  const [expandedIds, setExpandedIds] = useState([])
  if (!testimonials.length) return null

  const toggleExpanded = id => setExpandedIds(current =>
    current.includes(id) ? current.filter(item => item !== id) : [...current, id]
  )

  return (
    <section id="testimonials" className={`container landing-section testimonials-section${isHome ? " home-testimonials" : ""}`} aria-labelledby="testimonials-title">
      {showHeading && <div className="landing-section-header testimonials-heading">
        <div>
          {!isHome && content.testimonialsEyebrow ? <p className="section-eyebrow">{content.testimonialsEyebrow}</p> : null}
          <h2 id="testimonials-title" className="landing-section-title">{content.testimonialsTitle}</h2>
        </div>
        <div className="testimonials-heading-aside">
          {!isHome && content.testimonialsDescription ? <p>{content.testimonialsDescription}</p> : null}
          {archiveHref && (
            <Link href={archiveHref} className="text-link-cta link-underline">
              {content.testimonialsArchiveLabel}
            </Link>
          )}
        </div>
      </div>}
      <div className="testimonials-grid">
        {testimonials.map(testimonial => {
          const isExpanded = expandedIds.includes(testimonial.id)
          // quoteLimit={null} shows the full quote.
          const isLong = quoteLimit != null && testimonial.quote.length > quoteLimit
          // The homepage shows a teaser; the full text lives on the testimonials page.
          const canExpand = isLong && !isHome
          const displayedQuote = !isLong || isExpanded
            ? testimonial.quote
            : truncateAtWord(testimonial.quote, quoteLimit)
          return (
          <figure key={testimonial.id} className="testimonial-card">
            <blockquote>“{displayedQuote}”</blockquote>
            {canExpand ? (
              <button type="button" className="testimonial-expand" onClick={() => toggleExpanded(testimonial.id)} aria-expanded={isExpanded}>
                {isExpanded ? "Show less" : "Read full recommendation"}
              </button>
            ) : null}
            <figcaption>
              <span className="testimonial-avatar" aria-hidden="true">{testimonial.name?.charAt(0)}</span>
              <span>
                <strong>{testimonial.name}</strong>
                <small>{[testimonial.role, testimonial.company, showRelationship ? testimonial.relationshipLabel : null].filter(Boolean).join(" · ")}</small>
              </span>
              {testimonial.sourceUrl ? (
                <a href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-link-cta link-underline">{isHome && /linkedin\./i.test(testimonial.sourceUrl) ? "Read on LinkedIn" : testimonial.sourceLabel}</a>
              ) : (
                <span className="testimonial-source">{testimonial.sourceLabel}</span>
              )}
            </figcaption>
          </figure>
        )})}
      </div>
    </section>
  )
}

export default Testimonials
