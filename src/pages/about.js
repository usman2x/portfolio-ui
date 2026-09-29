import React, { useRef } from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import WorkExperienceTimeline from "../components/WorkExperienceTimeline"
import AboutVideo from "../components/AboutVideo"
import useRevealOnce from "../lib/useRevealOnce"
import { fetchAboutPage, fetchSiteSettings, fetchWorkExperience } from "../lib/cms"

const AboutPage = ({ aboutPage, siteSettings, workExperience }) => {
  const strengthsRef = useRef(null)
  useRevealOnce(strengthsRef)

  return (
    <Layout siteSettings={siteSettings}>
      <SEO
        title={aboutPage.seoTitle}
        description={aboutPage.seoDescription}
        pathname="/about/"
        siteSettings={siteSettings}
      />
      <section className="container interior-page about-page-shell">
        <header className="about-intro-header">
          <p className="section-eyebrow">{aboutPage.eyebrow}</p>
          <h1 className="page-title">{aboutPage.title}</h1>
        </header>
        <section className="about-intro-grid">
          <div className="interior-section about-intro-copy">
            {aboutPage.summary.map(paragraph => (
              <p key={paragraph} className="interior-copy">
                {paragraph}
              </p>
            ))}
          </div>
          <AboutVideo video={aboutPage.video} />
        </section>

        <WorkExperienceTimeline entries={workExperience} title={aboutPage.experienceTitle} />

        <section className="interior-section strengths-section">
          <h2 className="interior-section-title">{aboutPage.strengthsTitle}</h2>
          <ol className="strengths-grid" ref={strengthsRef}>
            {aboutPage.strengths.map((item, index) => (
              <li
                key={item.title}
                className="info-card strength-card"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="strength-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </section>
      </section>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [aboutPage, siteSettings, workExperience] = await Promise.all([
    fetchAboutPage(), fetchSiteSettings(), fetchWorkExperience(),
  ])
  return { props: { aboutPage, siteSettings, workExperience } }
}

export default AboutPage
