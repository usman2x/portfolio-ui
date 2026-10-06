import React, { useState } from "react"
import { truncateAtWord } from "./Testimonials"

// Testimonials page: one column of full quotes separated by hairlines, no boxes and no repeated
// source labels (the page intro names the source once). Only quotes longer than EXPAND_OVER
// characters collapse, cut at a word boundary.
const EXPAND_OVER = 600

const TestimonialEntry = ({ testimonial }) => {
  const [expanded, setExpanded] = useState(false)
  const canExpand = testimonial.quote.length > EXPAND_OVER
  const quote = canExpand && !expanded ? truncateAtWord(testimonial.quote, EXPAND_OVER) : testimonial.quote
  const details = [testimonial.role, testimonial.company, testimonial.relationshipLabel].filter(Boolean)

  return (
    <li className="testimonial-entry">
      <figure>
        <blockquote className="testimonial-entry-quote">“{quote}”</blockquote>
        {canExpand ? (
          <button
            type="button"
            className="testimonial-entry-toggle"
            onClick={() => setExpanded(value => !value)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read the full recommendation"}
          </button>
        ) : null}
        <figcaption className="testimonial-entry-caption">
          <span className="testimonial-avatar" aria-hidden="true">{testimonial.name?.charAt(0)}</span>
          <span className="testimonial-entry-person">
            {testimonial.sourceUrl ? (
              <a href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer" className="testimonial-entry-name">
                {testimonial.name}
              </a>
            ) : (
              <strong className="testimonial-entry-name">{testimonial.name}</strong>
            )}
            {details.length ? <span className="testimonial-entry-details">{details.join(" · ")}</span> : null}
          </span>
        </figcaption>
      </figure>
    </li>
  )
}

const TestimonialList = ({ testimonials = [] }) => {
  if (!testimonials.length) return null

  return (
    <ol className="testimonial-list">
      {testimonials.map(testimonial => (
        <TestimonialEntry key={testimonial.id} testimonial={testimonial} />
      ))}
    </ol>
  )
}

export default TestimonialList
