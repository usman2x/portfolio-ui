import React from "react"
import contactData from "../content/misc/contact-data.json"

const ContactForm = () => {
  const formLink = process.env.GATSBY_FORM_LINK || "#"
  const siteUrl = (
    process.env.GATSBY_SITE_URL || "http://localhost:8000"
  ).replace(/\/+$/, "")
  const redirectPage = siteUrl
    ? new URL(contactData["redirect-page"], siteUrl).href
    : contactData["redirect-page"]

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="contact-form-card">
        <form action={formLink} method="POST">
          <div className="contact-form-field">
            <label className="contact-form-label">Name</label>
            <input
              type="text"
              name="name"
              className="contact-form-input"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="contact-form-field">
            <label className="contact-form-label">Email</label>
            <input
              type="email"
              name="email"
              className="contact-form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="contact-form-field">
            <label className="contact-form-label">Message</label>
            <textarea
              name="message"
              className="contact-form-input"
              rows="4"
              placeholder="Write your message..."
              required
            ></textarea>
          </div>
          <input type="hidden" name="_next" value={redirectPage} />
          <button
            type="submit"
            className="theme-btn-primary contact-submit-btn"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
