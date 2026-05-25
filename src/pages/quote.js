import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import quotePage from "../content/pages/quote.json"
import contactData from "../content/misc/contact-data.json"
import { resolveSitePageUrl } from "../utils/url"
import { siteMetadata } from "../lib/site"

const QuotePage = () => {
  const formLink = process.env.NEXT_PUBLIC_FORM_LINK || "#"
  const siteUrl = siteMetadata.siteUrl
  const redirectPage = siteUrl
    ? resolveSitePageUrl(siteUrl, contactData["redirect-page"])
    : contactData["redirect-page"]

  return (
    <Layout>
      <SEO
        title={quotePage.seo.title}
        description={quotePage.seo.description}
        pathname="/quote/"
      />
      <section className="container interior-page quote-page-shell">
        <section className="interior-section quote-intro">
          <h1 className="page-title">{quotePage.intro.title}</h1>
          <p className="page-description">{quotePage.intro.description}</p>
        </section>

        <section className="interior-section quote-form-section">
          <form action={formLink} method="POST" className="quote-form">
            <div className="quote-grid">
              {quotePage.steps.map(step => (
                <div key={step.id} className="quote-field">
                  <label className="contact-form-label" htmlFor={step.id}>
                    {step.label}
                  </label>
                  <select
                    id={step.id}
                    name={step.name}
                    className="contact-form-input"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {step.options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="quote-field">
              <label className="contact-form-label" htmlFor="context">
                {quotePage.contextLabel}
              </label>
              <textarea
                id="context"
                name="context"
                rows="6"
                className="contact-form-input"
                placeholder={quotePage.contextPlaceholder}
                required
              ></textarea>
            </div>

            <div className="quote-grid quote-contact-grid">
              {quotePage.contactFields.map(field => (
                <div key={field.name} className="quote-field">
                  <label className="contact-form-label" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    className="contact-form-input"
                    placeholder={field.placeholder}
                    required={field.name !== "company"}
                  />
                </div>
              ))}
              <div className="quote-field">
                <label
                  className="contact-form-label"
                  htmlFor="preferred_contact"
                >
                  {quotePage.contactMethod.label}
                </label>
                <select
                  id="preferred_contact"
                  name={quotePage.contactMethod.name}
                  className="contact-form-input"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {quotePage.contactMethod.options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <input type="hidden" name="_next" value={redirectPage} />
            <button
              type="submit"
              className="theme-btn-primary quote-submit-btn"
            >
              {quotePage.submitLabel}
            </button>
          </form>
        </section>

        <section className="interior-section alternative-actions">
          <h2 className="interior-section-title">Prefer another path?</h2>
          <div className="cta-actions">
            <a
              href={contactData.meetingLink}
              className="theme-btn-outline theme-btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Call
            </a>
            <a
              href={`mailto:${contactData.email.value}`}
              className="theme-btn-outline theme-btn-sm"
            >
              Email Me
            </a>
          </div>
        </section>
      </section>
    </Layout>
  )
}

export default QuotePage
