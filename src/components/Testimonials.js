import React, { useState } from "react"
import Link from "next/link"

const Testimonials = ({ testimonials = [], content, archiveHref, showHeading = true }) => {
  const [expandedIds, setExpandedIds] = useState([])
  if (!testimonials.length) return null

  const toggleExpanded = id => setExpandedIds(current =>
    current.includes(id) ? current.filter(item => item !== id) : [...current, id]
  )

  return (
    <section id="testimonials" className="container landing-section testimonials-section" aria-labelledby="testimonials-title">
      {showHeading && <div className="landing-section-header testimonials-heading">
        <div>
          <p className="section-eyebrow">{content.testimonialsEyebrow}</p>
          <h2 id="testimonials-title" className="landing-section-title">{content.testimonialsTitle}</h2>
        </div>
        <div className="testimonials-heading-aside">
          <p>{content.testimonialsDescription}</p>
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
          const isLong = testimonial.quote.length > 260
          const displayedQuote = !isLong || isExpanded
            ? testimonial.quote
            : `${testimonial.quote.slice(0, 257).trim()}…`
          return (
          <figure key={testimonial.id} className="testimonial-card">
            <blockquote>“{displayedQuote}”</blockquote>
            {isLong ? (
              <button type="button" className="testimonial-expand" onClick={() => toggleExpanded(testimonial.id)} aria-expanded={isExpanded}>
                {isExpanded ? "Show less" : "Read full recommendation"}
              </button>
            ) : null}
            <figcaption>
              <span className="testimonial-avatar" aria-hidden="true">{testimonial.name?.charAt(0)}</span>
              <span>
                <strong>{testimonial.name}</strong>
                <small>{[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}</small>
              </span>
              {testimonial.sourceUrl ? (
                <a href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-link-cta link-underline">{testimonial.sourceLabel}</a>
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
