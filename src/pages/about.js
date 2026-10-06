import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import WorkExperienceTimeline from "../components/WorkExperienceTimeline"
import AboutVideo from "../components/AboutVideo"
import Testimonials from "../components/Testimonials"
import {
  fetchAboutPage,
  fetchHomePage,
  fetchSiteSettings,
  fetchTestimonialsPage,
  fetchWorkExperience,
} from "../lib/cms"

// Order (docs/pages/ABOUT_PAGE.md): intro + video, core strengths, work experience,
// one testimonial on the tinted band, then the shared closing section from Layout.
const AboutPage = ({ aboutPage, siteSettings, workExperience, sharedLabels }) => {
  const [lead, ...rest] = aboutPage.summary

  return (
    <Layout siteSettings={siteSettings}>
      <SEO
        title={aboutPage.seoTitle}
        description={aboutPage.seoDescription}
        pathname="/about/"
        siteSettings={siteSettings}
      />
      <div className="about-page">
        <section className="container about-intro" aria-labelledby="about-title">
          <p className="about-eyebrow">{aboutPage.eyebrow}</p>
          <h1 id="about-title" className="about-title">{aboutPage.title}</h1>
          <div className="about-intro-row">
            <div className="about-intro-copy">
              {lead ? <p className="about-lead">{lead}</p> : null}
              {rest.map(paragraph => (
                <p key={paragraph} className="about-copy">{paragraph}</p>
              ))}
              <div className="about-actions">
                {siteSettings.meetingLink ? (
                  <a
                    href={siteSettings.meetingLink}
                    className="theme-btn-primary about-action"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sharedLabels.primaryCtaLabel}
                  </a>
                ) : null}
                {siteSettings.resumeLink ? (
                  <a
                    href={siteSettings.resumeLink}
                    className="theme-btn-outline about-action"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download CV
                  </a>
                ) : null}
              </div>
            </div>
            <AboutVideo video={aboutPage.video} />
          </div>
        </section>

        {aboutPage.strengths?.length ? (
          <section className="container about-strengths" aria-labelledby="about-strengths-title">
            <h2 id="about-strengths-title" className="landing-section-title">
              {aboutPage.strengthsTitle}
            </h2>
            <ol className="about-strengths-list">
              {aboutPage.strengths.map((item, index) => (
                <li key={item.title} className="about-strength">
                  <span className="strength-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="about-strength-title">{item.title}</h3>
                  <p className="about-strength-description">{item.description}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <div className="container about-experience">
          <WorkExperienceTimeline
            entries={workExperience}
            title={aboutPage.experienceTitle}
            cvHref={siteSettings.resumeLink}
          />
        </div>

        {aboutPage.featuredTestimonial ? (
          <div className="about-testimonial-band">
            <Testimonials
              testimonials={[aboutPage.featuredTestimonial]}
              content={sharedLabels}
              archiveHref="/testimonials/"
              variant="home"
              showRelationship
              quoteLimit={null}
            />
          </div>
        ) : null}
      </div>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [aboutPage, siteSettings, workExperience, testimonialsPage, homePage] =
    await Promise.all([
      fetchAboutPage(),
      fetchSiteSettings(),
      fetchWorkExperience(),
      fetchTestimonialsPage(),
      fetchHomePage(),
    ])
  // Shared labels: the testimonials page title, the homepage's archive link and CTA labels.
  const sharedLabels = {
    testimonialsTitle: testimonialsPage.title,
    testimonialsArchiveLabel: homePage.testimonialsArchiveLabel || "Read all testimonials",
    primaryCtaLabel: homePage.primaryCtaLabel || "Book a call",
  }
  return { props: { aboutPage, siteSettings, workExperience, sharedLabels } }
}

export default AboutPage
