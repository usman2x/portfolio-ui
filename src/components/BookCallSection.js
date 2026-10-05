import React from "react"
import Link from "next/link"

// Closing call to action. It shares the inverse surface with the footer below it, so the page
// ends on one strong block (docs/pages/HOMEPAGE_REDESIGN.md, section 8).
const BookCallSection = ({ siteSettings }) => {
  const content = siteSettings.bookCall || {}
  return (
    <section className="book-call-section" aria-labelledby="book-call-title">
      <div className="container book-call-content">
        <div className="book-call-copy">
          <h2 id="book-call-title" className="book-call-proposition">
            {content.title}
          </h2>
          <p className="book-call-subtitle">{content.description}</p>
        </div>
        <div className="book-call-actions">
          <a
            href={siteSettings.meetingLink}
            className="theme-btn-primary book-call-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.buttonLabel}
          </a>
          <Link href="/contact/" className="text-link-cta book-call-secondary">
            or send a message
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BookCallSection
