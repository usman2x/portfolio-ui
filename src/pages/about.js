import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import aboutPage from "../content/pages/about.json"
import WorkExperienceTimeline from "../components/WorkExperienceTimeline"

const AboutPage = () => {
  return (
    <Layout>
      <SEO
        title={aboutPage.seo.title}
        description={aboutPage.seo.description}
        pathname="/about/"
      />
      <section className="container interior-page about-page-shell">
        <section className="interior-section">
          {aboutPage.summary.map(paragraph => (
            <p key={paragraph} className="interior-copy">
              {paragraph}
            </p>
          ))}
        </section>

        <WorkExperienceTimeline />

        <section className="interior-section">
          <h2 className="interior-section-title">Strengths</h2>
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

export default AboutPage
