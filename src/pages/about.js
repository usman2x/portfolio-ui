import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import WorkExperienceTimeline from "../components/WorkExperienceTimeline"
import AboutVideo from "../components/AboutVideo"
import { fetchAboutPage, fetchSiteSettings, fetchWorkExperience } from "../lib/cms"

const AboutPage = ({ aboutPage, siteSettings, workExperience }) => {
  return (
    <Layout siteSettings={siteSettings}>
      <SEO
        title={aboutPage.seoTitle}
        description={aboutPage.seoDescription}
        pathname="/about/"
        siteSettings={siteSettings}
      />
      <section className="container interior-page about-page-shell">
        <section className="about-intro-grid">
          <div className="interior-section about-intro-copy">
            <p className="section-eyebrow">{aboutPage.eyebrow}</p>
            <h1 className="page-title">{aboutPage.title}</h1>
            {aboutPage.summary.map(paragraph => (
              <p key={paragraph} className="interior-copy">
                {paragraph}
              </p>
            ))}
          </div>
          <AboutVideo video={aboutPage.video} />
        </section>

        <WorkExperienceTimeline entries={workExperience} title={aboutPage.experienceTitle} />

        <section className="interior-section">
          <h2 className="interior-section-title">{aboutPage.strengthsTitle}</h2>
          <div className="info-grid">
            {aboutPage.strengths.map(item => (
              <article key={item.title} className="info-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
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
