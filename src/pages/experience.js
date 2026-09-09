import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import WorkExperienceTimeline from "../components/WorkExperienceTimeline"
import { fetchAboutPage, fetchSiteSettings, fetchWorkExperience } from "../lib/cms"

const ExperiencePage = ({ aboutPage, siteSettings, workExperience }) => (
  <Layout siteSettings={siteSettings}>
    <SEO title={aboutPage.experienceTitle} description={aboutPage.seoDescription} pathname="/experience/" siteSettings={siteSettings} />
    <section className="container interior-page about-page-shell">
      <WorkExperienceTimeline entries={workExperience} title={aboutPage.experienceTitle} />
    </section>
  </Layout>
)

export const getStaticProps = async () => {
  const [aboutPage, siteSettings, workExperience] = await Promise.all([
    fetchAboutPage(), fetchSiteSettings(), fetchWorkExperience(),
  ])
  return { props: { aboutPage, siteSettings, workExperience } }
}

export default ExperiencePage
