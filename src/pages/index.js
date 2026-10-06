import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import HomeIdentity from "../components/HomeIdentity"
import HomeProof from "../components/HomeProof"
import SelectedProjects from "../components/SelectedProjects"
import LatestWritings from "../components/LatestWritings"
import Testimonials from "../components/Testimonials"
import HomeServices from "../components/HomeServices"
import { getAllBlogPosts, getAllProjects } from "../lib/content"
import { fetchArchiveSettings, fetchHomePage, fetchPayloadServices, fetchPayloadTestimonials, fetchSiteSettings } from "../lib/cms"

const IndexPage = ({ posts, featuredProjects, services, testimonials, siteSettings, homeContent, archiveSettings }) => {
  return (
    <Layout siteSettings={siteSettings}>
      <SEO
        title={homeContent.seoTitle}
        description={homeContent.seoDescription}
        pathname="/"
        siteSettings={siteSettings}
      />
      <div className="home-page landing-home">
        <HomeIdentity siteSettings={siteSettings} homeContent={homeContent} />
        <HomeProof homeContent={homeContent} />
        {/* Order follows a client's questions: what, proof, how to engage, trust, thinking. The
            closing band from Layout is the ending, as on every page. */}
        <SelectedProjects projects={featuredProjects} homeContent={homeContent} />
        <HomeServices services={services} homeContent={homeContent} />
        <Testimonials testimonials={testimonials} content={homeContent} archiveHref="/testimonials/" variant="home" />
        <LatestWritings posts={posts} homeContent={homeContent} />
      </div>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [allPosts, projects, allTestimonials, services, siteSettings, homeContent, archiveSettings] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
    fetchPayloadTestimonials(),
    fetchPayloadServices(),
    fetchSiteSettings(),
    fetchHomePage(),
    fetchArchiveSettings(),
  ])
  const posts = allPosts.slice(0, homeContent.writingsLimit || 2)
  const featuredProjects = homeContent.featuredProjectIds
    .map(id => projects.find(project => project.payloadId === id))
    .filter(Boolean)
    .slice(0, 3)
  const testimonials = allTestimonials.filter(item => item.featured).slice(0, homeContent.testimonialLimit || 1)

  return {
    props: {
      posts,
      featuredProjects,
      services,
      testimonials,
      siteSettings,
      homeContent,
      archiveSettings,
    },
  }
}

export default IndexPage
