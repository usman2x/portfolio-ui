import React, { useMemo, useRef, useState } from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import { fetchQuotePage, fetchSiteSettings } from "../lib/cms"

const INITIAL_VALUES = {
  intent: "",
  work_type: "",
  timeline: "",
  budget: "",
  context: "",
  wants_reply: false,
  name: "",
  email: "",
  phone: "",
  company: "",
  preferred_contact: "Email",
}

const INTENT_COPY = {
  Feedback: "Share a thought, suggestion, or something I could improve.",
  "Project or services":
    "Tell me about a product, platform, or engineering need.",
  Consultancy: "Start a focused advisory or technical review conversation.",
  "General message": "For introductions, questions, and everything else.",
}

const RequiredMark = () => <span aria-hidden="true"> *</span>

const ContactPage = ({ quotePage, siteSettings }) => {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [stepIndex, setStepIndex] = useState(0)
  const [submission, setSubmission] = useState({ state: "idle", message: "" })
  const [validationMessage, setValidationMessage] = useState("")
  const panelRef = useRef(null)
  const cmsUrl = (
    process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001"
  ).replace(/\/$/, "")
  const isCommercial =
    values.intent === "Project or services" || values.intent === "Consultancy"
  const needsReply = isCommercial || values.wants_reply

  const steps = useMemo(() => {
    const nextSteps = [
      { id: "intent", label: "Intent", title: "What brings you here?" },
    ]
    if (isCommercial)
      nextSteps.push({
        id: "details",
        label: "Details",
        title: "A little about the engagement",
      })
    nextSteps.push(
      {
        id: "message",
        label: "Message",
        title: isCommercial
          ? "What should I know?"
          : "What would you like to share?",
      },
      {
        id: "contact",
        label: "Contact",
        title: isCommercial
          ? "How should I reach you?"
          : "Would you like a reply?",
      },
      { id: "review", label: "Review", title: "Review and send" }
    )
    return nextSteps
  }, [isCommercial])

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]
  const intentOptions = quotePage.helpTypes?.length
    ? quotePage.helpTypes
    : Object.keys(INTENT_COPY).map(value => ({ label: value, value }))

  const updateValue = event => {
    const { name, type, checked, value } = event.target
    setValues(current =>
      name === "intent"
        ? {
            ...current,
            intent: value,
            work_type: "",
            timeline: "",
            budget: "",
          }
        : {
            ...current,
            [name]: type === "checkbox" ? checked : value,
          }
    )
    setValidationMessage("")
  }

  const focusPanel = () => window.setTimeout(() => panelRef.current?.focus(), 0)

  const validateStep = () => {
    if (currentStep.id === "intent" && !values.intent)
      return "Choose what you would like to contact me about."
    if (
      currentStep.id === "details" &&
      (!values.work_type || !values.timeline || !values.budget)
    )
      return "Complete the three engagement details to continue."
    if (currentStep.id === "message" && values.context.trim().length < 10)
      return "Please add at least 10 characters so I have enough context."
    if (currentStep.id === "contact" && needsReply) {
      if (!values.name.trim())
        return "Add your name so I know how to address you."
      if (
        values.preferred_contact === "WhatsApp" &&
        !/^\+?[\d\s().-]{7,30}$/.test(values.phone)
      )
        return "Enter a valid WhatsApp phone number, including the country code."
      if (
        values.preferred_contact !== "WhatsApp" &&
        !/^\S+@\S+\.\S+$/.test(values.email)
      )
        return "Enter a valid email address so I can reply."
      if (!values.preferred_contact)
        return "Choose how you would prefer me to respond."
    }
    return ""
  }

  const goNext = () => {
    const message = validateStep()
    if (message) {
      setValidationMessage(message)
      return
    }
    setStepIndex(index => Math.min(index + 1, steps.length - 1))
    focusPanel()
  }

  const goBack = () => {
    setValidationMessage("")
    setStepIndex(index => Math.max(index - 1, 0))
    focusPanel()
  }

  const submitContact = async event => {
    event.preventDefault()

    if (currentStep.id !== "review") {
      goNext()
      return
    }

    setSubmission({ state: "submitting", message: quotePage.submittingLabel })
    setValidationMessage("")

    try {
      const response = await fetch(`${cmsUrl}/api/quote-requests/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          name: needsReply ? values.name : "",
          email: needsReply ? values.email : "",
          phone: needsReply ? values.phone : "",
          company: isCommercial ? values.company : "",
          preferred_contact: needsReply ? values.preferred_contact : "",
          help_type: values.intent,
          wants_reply: needsReply,
          source_url: window.location.href,
          website: event.currentTarget.elements.website.value,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok)
        throw new Error(result.message || quotePage.errorMessage)
      setValues(INITIAL_VALUES)
      setStepIndex(0)
      setSubmission({ state: "success", message: quotePage.successMessage })
    } catch (error) {
      setSubmission({
        state: "error",
        message:
          error instanceof Error ? error.message : quotePage.errorMessage,
      })
    }
  }

  const startAgain = () => {
    setValues(INITIAL_VALUES)
    setStepIndex(0)
    setSubmission({ state: "idle", message: "" })
  }

  return (
    <Layout showBookCall={false} siteSettings={siteSettings}>
      <SEO
        title={quotePage.seoTitle}
        description={quotePage.seoDescription}
        pathname="/contact/"
        siteSettings={siteSettings}
      />
      <section className="container interior-page quote-page-shell">
        <section className="interior-section quote-intro">
          <p className="section-eyebrow">{quotePage.eyebrow}</p>
          <h1 className="page-title">{quotePage.title}</h1>
          <p className="page-description">{quotePage.description}</p>
        </section>

        <div className="quote-layout contact-wizard-layout">
          <aside className="quote-aside" aria-label="Form progress">
            <div className="quote-aside-card">
              <p className="quote-aside-kicker">Your path</p>
              <ol className="wizard-progress-list">
                {steps.map((step, index) => (
                  <li
                    key={step.id}
                    className={
                      index === stepIndex
                        ? "is-current"
                        : index < stepIndex
                        ? "is-complete"
                        : ""
                    }
                    aria-current={index === stepIndex ? "step" : undefined}
                  >
                    <span>{index < stepIndex ? "✓" : index + 1}</span>
                    <div>
                      <strong>{step.label}</strong>
                      <small>
                        {index === stepIndex
                          ? step.title
                          : index < stepIndex
                          ? "Complete"
                          : "Up next"}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="quote-response-note">{quotePage.responseNote}</p>
            </div>
            <div className="quote-alternatives">
              <p className="quote-aside-kicker">
                {quotePage.alternativesTitle}
              </p>
              <a
                href={siteSettings.meetingLink}
                className="text-link-cta link-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {quotePage.callLabel}
              </a>
              <a
                href={`mailto:${siteSettings.email}`}
                className="text-link-cta link-underline"
              >
                {quotePage.emailLinkLabel}
              </a>
            </div>
          </aside>

          <section
            className="quote-form-section contact-wizard"
            aria-labelledby="contact-form-heading"
          >
            {submission.state === "success" ? (
              <div className="quote-success" role="status" aria-live="polite">
                <span className="quote-success-icon" aria-hidden="true">
                  ✓
                </span>
                <p className="quote-form-step">{quotePage.successEyebrow}</p>
                <h2 id="contact-form-heading">{quotePage.successTitle}</h2>
                <p>{submission.message}</p>
                <button
                  type="button"
                  className="theme-btn-outline theme-btn-sm"
                  onClick={startAgain}
                >
                  {quotePage.sendAnotherLabel}
                </button>
              </div>
            ) : (
              <form className="quote-form" onSubmit={submitContact}>
                <div className="quote-honeypot" aria-hidden="true">
                  <input
                    name="website"
                    type="text"
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>
                <div className="wizard-progress-mobile" aria-hidden="true">
                  <span
                    style={{
                      width: `${((stepIndex + 1) / steps.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="quote-form-header wizard-form-header">
                  <div>
                    <p className="quote-form-step">
                      Step {stepIndex + 1} of {steps.length} ·{" "}
                      {currentStep.label}
                    </p>
                    <h2 id="contact-form-heading" ref={panelRef} tabIndex="-1">
                      {currentStep.title}
                    </h2>
                  </div>
                  <p>
                    {currentStep.id === "contact" && !needsReply
                      ? "Optional details"
                      : "One step at a time"}
                  </p>
                </div>

                <div className="wizard-panel" key={currentStep.id}>
                  {currentStep.id === "intent" && (
                    <fieldset className="quote-fieldset">
                      <legend className="sr-only">Choose your intent</legend>
                      <p className="wizard-guidance">
                        I’ll only ask questions that fit your choice.
                      </p>
                      <div className="intent-options">
                        {intentOptions.map(option => (
                          <label
                            key={option.value}
                            className={`intent-option ${
                              values.intent === option.value
                                ? "is-selected"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="intent"
                              value={option.value}
                              checked={values.intent === option.value}
                              onChange={updateValue}
                            />
                            <span>
                              <strong>{option.label}</strong>
                              <small>
                                {INTENT_COPY[option.value] ||
                                  "Start with a short message and choose whether you need a reply."}
                              </small>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {currentStep.id === "details" && (
                    <fieldset className="quote-fieldset">
                      <legend className="sr-only">Engagement details</legend>
                      <p className="wizard-guidance">
                        Rough answers are fine. They help me suggest a useful
                        next step.
                      </p>
                      <div className="quote-grid">
                        {[
                          [
                            "work_type",
                            quotePage.workTypeLabel,
                            quotePage.workTypes,
                          ],
                          [
                            "timeline",
                            quotePage.timelineLabel,
                            quotePage.timelines,
                          ],
                          ["budget", quotePage.budgetLabel, quotePage.budgets],
                        ].map(([name, label, options]) => (
                          <div
                            className={`quote-field ${
                              name === "work_type" ? "quote-field-wide" : ""
                            }`}
                            key={name}
                          >
                            <label
                              className="contact-form-label"
                              htmlFor={name}
                            >
                              {label}
                              <RequiredMark />
                            </label>
                            <select
                              id={name}
                              name={name}
                              className="contact-form-input"
                              value={values[name]}
                              onChange={updateValue}
                            >
                              <option value="">
                                {quotePage.selectPlaceholder}
                              </option>
                              {options.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {currentStep.id === "message" && (
                    <fieldset className="quote-fieldset">
                      <legend className="sr-only">Your message</legend>
                      <div className="quote-field">
                        <label className="contact-form-label" htmlFor="context">
                          {isCommercial
                            ? quotePage.contextLabel
                            : "Your message"}
                          <RequiredMark />
                        </label>
                        <textarea
                          id="context"
                          name="context"
                          rows="7"
                          className="contact-form-input"
                          value={values.context}
                          onChange={updateValue}
                          placeholder={
                            isCommercial
                              ? quotePage.contextPlaceholder
                              : "Share your feedback, question, or note here."
                          }
                          maxLength="5000"
                        />
                        <span className="quote-field-help">
                          {isCommercial
                            ? quotePage.contextHelp
                            : "A short message is perfectly fine."}{" "}
                          {values.context.length}/5000
                        </span>
                      </div>
                    </fieldset>
                  )}

                  {currentStep.id === "contact" && (
                    <fieldset className="quote-fieldset">
                      <legend className="sr-only">Contact details</legend>
                      {!isCommercial && (
                        <label
                          className={`reply-choice ${
                            values.wants_reply ? "is-selected" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="wants_reply"
                            checked={values.wants_reply}
                            onChange={updateValue}
                          />
                          <span>
                            <strong>I’d like a reply</strong>
                            <small>
                              Leave this unchecked to send your message
                              anonymously.
                            </small>
                          </span>
                        </label>
                      )}
                      {needsReply ? (
                        <div className="quote-grid quote-contact-grid">
                          <div className="quote-field">
                            <label
                              className="contact-form-label"
                              htmlFor="name"
                            >
                              {quotePage.nameLabel}
                              <RequiredMark />
                            </label>
                            <input
                              id="name"
                              name="name"
                              className="contact-form-input"
                              value={values.name}
                              onChange={updateValue}
                              placeholder={quotePage.namePlaceholder}
                              autoComplete="name"
                            />
                          </div>
                          <div className="quote-field">
                            <label
                              className="contact-form-label"
                              htmlFor="preferred_contact"
                            >
                              {quotePage.preferredContactLabel}
                              <RequiredMark />
                            </label>
                            <select
                              id="preferred_contact"
                              name="preferred_contact"
                              className="contact-form-input"
                              value={values.preferred_contact}
                              onChange={updateValue}
                            >
                              {quotePage.contactMethods.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {values.preferred_contact === "WhatsApp" ? (
                            <div className="quote-field">
                              <label
                                className="contact-form-label"
                                htmlFor="phone"
                              >
                                WhatsApp number
                                <RequiredMark />
                              </label>
                              <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className="contact-form-input"
                                value={values.phone}
                                onChange={updateValue}
                                placeholder="+92 300 1234567"
                                autoComplete="tel"
                              />
                            </div>
                          ) : (
                            <div className="quote-field">
                              <label
                                className="contact-form-label"
                                htmlFor="email"
                              >
                                {quotePage.emailLabel}
                                <RequiredMark />
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                className="contact-form-input"
                                value={values.email}
                                onChange={updateValue}
                                placeholder={quotePage.emailPlaceholder}
                                autoComplete="email"
                              />
                            </div>
                          )}
                          {isCommercial && (
                            <div className="quote-field">
                              <label
                                className="contact-form-label"
                                htmlFor="company"
                              >
                                {quotePage.companyLabel}
                              </label>
                              <input
                                id="company"
                                name="company"
                                className="contact-form-input"
                                value={values.company}
                                onChange={updateValue}
                                placeholder={quotePage.companyPlaceholder}
                                autoComplete="organization"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="anonymous-note">
                          No personal details are needed. Your message will be
                          submitted without contact details.
                        </p>
                      )}
                    </fieldset>
                  )}

                  {currentStep.id === "review" && (
                    <div className="wizard-review">
                      <p className="wizard-guidance">
                        Check the essentials before sending. Use Back if you
                        want to change anything.
                      </p>
                      <dl>
                        <div>
                          <dt>Intent</dt>
                          <dd>{values.intent}</dd>
                        </div>
                        {isCommercial && (
                          <>
                            <div>
                              <dt>Engagement</dt>
                              <dd>{values.work_type}</dd>
                            </div>
                            <div>
                              <dt>Timing</dt>
                              <dd>{values.timeline}</dd>
                            </div>
                            <div>
                              <dt>Budget</dt>
                              <dd>{values.budget}</dd>
                            </div>
                          </>
                        )}
                        <div>
                          <dt>Message</dt>
                          <dd>{values.context}</dd>
                        </div>
                        <div>
                          <dt>Reply</dt>
                          <dd>
                            {needsReply
                              ? `${values.name} · ${
                                  values.preferred_contact === "WhatsApp"
                                    ? values.phone
                                    : values.email
                                } · ${values.preferred_contact}`
                              : "No reply requested"}
                          </dd>
                        </div>
                      </dl>
                      <p className="quote-privacy-note">
                        {quotePage.privacyNote}
                      </p>
                    </div>
                  )}
                </div>

                {validationMessage && (
                  <p
                    className="quote-form-status quote-form-status-error"
                    role="alert"
                  >
                    {validationMessage}
                  </p>
                )}
                {submission.state === "error" && (
                  <p
                    className="quote-form-status quote-form-status-error"
                    role="alert"
                  >
                    {submission.message}
                  </p>
                )}

                <div className="wizard-actions">
                  {stepIndex > 0 && (
                    <button
                      type="button"
                      className="theme-btn-outline"
                      onClick={goBack}
                    >
                      Back
                    </button>
                  )}
                  {currentStep.id === "review" ? (
                    <button
                      type="submit"
                      className="theme-btn-primary quote-submit-btn"
                      disabled={submission.state === "submitting"}
                    >
                      {submission.state === "submitting"
                        ? quotePage.submittingLabel
                        : quotePage.submitLabel}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="theme-btn-primary"
                      onClick={goNext}
                    >
                      Continue <span aria-hidden="true">→</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [quotePage, siteSettings] = await Promise.all([
    fetchQuotePage(),
    fetchSiteSettings(),
  ])
  return { props: { quotePage, siteSettings } }
}

export default ContactPage
