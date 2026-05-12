import React from "react"
import contactData from "../content/misc/contact-data.json"
import bookCallContent from "../content/misc/book-call.json"

const BookCallSection = () => {
  return (
    <section className="book-call-section" aria-label="Book a call">
      <div className="container book-call-content">
        <h2 className="book-call-proposition">{bookCallContent.proposition}</h2>
        <p className="book-call-subtitle">{bookCallContent.subtitle}</p>
        <a
          href={contactData.meetingLink}
          className="theme-btn-primary theme-btn-sm book-call-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          {bookCallContent.buttonLabel}
        </a>
      </div>
    </section>
  )
}

export default BookCallSection
