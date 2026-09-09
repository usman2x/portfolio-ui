import React from "react"
const BookCallSection = ({ siteSettings }) => {
  const content = siteSettings.bookCall || {}
  return (
    <section className="book-call-section" aria-label="Book a call">
      <div className="container book-call-content">
        <h2 className="book-call-proposition">{content.title}</h2>
        <p className="book-call-subtitle">{content.description}</p>
        <a
          href={siteSettings.meetingLink}
          className="theme-btn-primary theme-btn-sm book-call-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.buttonLabel}
        </a>
      </div>
    </section>
  )
}

export default BookCallSection
