import React, { useState } from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import { fetchQuotePage, fetchSiteSettings } from "../lib/cms"

const RequiredMark = () => <span aria-hidden="true"> *</span>

const QuotePage = ({ quotePage, siteSettings }) => {
  const [submission, setSubmission] = useState({ state: "idle", message: "" })
  const [contextLength, setContextLength] = useState(0)
  const cmsUrl = (process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001").replace(/\/$/, "")

  const submitQuote = async event => {
    event.preventDefault()
    setSubmission({ state: "submitting", message: quotePage.submittingLabel })
    const form = event.currentTarget
    const body = Object.fromEntries(new FormData(form).entries())
    body.source_url = window.location.href

    try {
      const response = await fetch(`${cmsUrl}/api/quote-requests/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || quotePage.errorMessage)
      form.reset()
      setContextLength(0)
      setSubmission({ state: "success", message: quotePage.successMessage })
    } catch (error) {
      setSubmission({
        state: "error",
        message: error instanceof Error ? error.message : quotePage.errorMessage,
      })
    }
  }

  return (
    <Layout showBookCall={false} siteSettings={siteSettings}>
      <SEO title={quotePage.seoTitle} description={quotePage.seoDescription} pathname="/quote/" siteSettings={siteSettings} />
      <section className="container interior-page quote-page-shell">
        <section className="interior-section quote-intro">
          <p className="section-eyebrow">{quotePage.eyebrow}</p>
          <h1 className="page-title">{quotePage.title}</h1>
          <p className="page-description">{quotePage.description}</p>
        </section>

        <div className="quote-layout">
          <aside className="quote-aside" aria-label={quotePage.nextStepsTitle}>
            <div className="quote-aside-card">
              <p className="quote-aside-kicker">{quotePage.nextStepsTitle}</p>
              <ol className="quote-process-list">
                {quotePage.process.map((item, index) => (
                  <li key={item.title}>
                    <span>{index + 1}</span>
                    <div><strong>{item.title}</strong><p>{item.description}</p></div>
                  </li>
                ))}
              </ol>
              <p className="quote-response-note">{quotePage.responseNote}</p>
            </div>
            <div className="quote-alternatives">
              <p className="quote-aside-kicker">{quotePage.alternativesTitle}</p>
              <a href={siteSettings.meetingLink} className="text-link-cta link-underline" target="_blank" rel="noopener noreferrer">{quotePage.callLabel}</a>
              <a href={`mailto:${siteSettings.email}`} className="text-link-cta link-underline">{quotePage.emailLinkLabel}</a>
            </div>
          </aside>

          <section className="quote-form-section" aria-labelledby="quote-form-heading">
            {submission.state === "success" ? (
              <div className="quote-success" role="status" aria-live="polite">
                <span className="quote-success-icon" aria-hidden="true">✓</span>
                <p className="quote-form-step">{quotePage.successEyebrow}</p>
                <h2 id="quote-form-heading">{quotePage.successTitle}</h2>
                <p>{submission.message}</p>
                <button type="button" className="theme-btn-outline theme-btn-sm" onClick={() => setSubmission({ state: "idle", message: "" })}>{quotePage.sendAnotherLabel}</button>
              </div>
            ) : (
              <form className="quote-form" onSubmit={submitQuote}>
                <div className="quote-form-header">
                  <div><p className="quote-form-step">{quotePage.formEyebrow}</p><h2 id="quote-form-heading">{quotePage.formTitle}</h2></div>
                  <p><span aria-hidden="true">*</span> {quotePage.requiredFieldsLabel}</p>
                </div>
                <div className="quote-honeypot" aria-hidden="true">
                  <input name="website" type="text" tabIndex="-1" autoComplete="off" aria-hidden="true" />
                </div>

                <fieldset className="quote-fieldset">
                  <legend>{quotePage.scopeLegend}</legend>
                  <div className="quote-grid">
                    {quotePage.steps.map(step => (
                      <div key={step.id} className="quote-field">
                        <label className="contact-form-label" htmlFor={step.id}>{step.label}<RequiredMark /></label>
                        <select id={step.id} name={step.name} className="contact-form-input" required defaultValue="">
                          <option value="" disabled>{quotePage.selectPlaceholder}</option>
                          {step.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="quote-fieldset">
                  <legend>{quotePage.contextLegend}</legend>
                  <div className="quote-field">
                    <label className="contact-form-label" htmlFor="context">{quotePage.contextLabel}<RequiredMark /></label>
                    <textarea id="context" name="context" rows="5" className="contact-form-input" placeholder={quotePage.contextPlaceholder} required minLength="20" maxLength="5000" onChange={event => setContextLength(event.target.value.length)} />
                    <span className="quote-field-help">{quotePage.contextHelp} {contextLength}/5000</span>
                  </div>
                </fieldset>

                <fieldset className="quote-fieldset">
                  <legend>{quotePage.contactLegend}</legend>
                  <div className="quote-grid quote-contact-grid">
                    {quotePage.contactFields.map(field => (
                      <div key={field.name} className="quote-field">
                        <label className="contact-form-label" htmlFor={field.name}>{field.label}{field.name !== "company" && <RequiredMark />}</label>
                        <input id={field.name} type={field.type} name={field.name} className="contact-form-input" placeholder={field.placeholder} required={field.name !== "company"} autoComplete={field.name === "name" ? "name" : field.name === "email" ? "email" : "organization"} />
                      </div>
                    ))}
                    <div className="quote-field">
                      <label className="contact-form-label" htmlFor="preferred_contact">{quotePage.preferredContactLabel}<RequiredMark /></label>
                      <select id="preferred_contact" name="preferred_contact" className="contact-form-input" required defaultValue="">
                        <option value="" disabled>{quotePage.selectPlaceholder}</option>
                        {quotePage.contactMethods.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </div>
                  </div>
                </fieldset>

                <div className="quote-submit-row">
                  <button type="submit" className="theme-btn-primary quote-submit-btn" disabled={submission.state === "submitting"}>{submission.state === "submitting" ? quotePage.submittingLabel : quotePage.submitLabel}</button>
                  <p className="quote-privacy-note">{quotePage.privacyNote}</p>
                </div>
                {submission.state === "error" && <p className="quote-form-status quote-form-status-error" role="alert">{submission.message}</p>}
              </form>
            )}
          </section>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [quotePage, siteSettings] = await Promise.all([fetchQuotePage(), fetchSiteSettings()])
  return { props: { quotePage, siteSettings } }
}

export default QuotePage
