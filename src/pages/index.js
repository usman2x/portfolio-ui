import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import HomeIdentity from "../components/HomeIdentity"
import SelectedProjects from "../components/SelectedProjects"
import LatestWritings from "../components/LatestWritings"
import Testimonials from "../components/Testimonials"
import { getAllBlogPosts, getAllProjects } from "../lib/content"
import { fetchArchiveSettings, fetchHomePage, fetchPayloadTestimonials, fetchSiteSettings } from "../lib/cms"

const IndexPage = ({ posts, featuredProjects, testimonials, siteSettings, homeContent, archiveSettings }) => {
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
        <section className="container landing-post-hero-note">
          <p>{homeContent.postHeroLine}</p>
        </section>
        <LatestWritings posts={posts} homeContent={homeContent} readArticleLabel={archiveSettings.readArticleLabel} />
        <SelectedProjects projects={featuredProjects} homeContent={homeContent} />
        <Testimonials testimonials={testimonials} content={homeContent} archiveHref="/testimonials/" />
      </div>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [allPosts, projects, allTestimonials, siteSettings, homeContent, archiveSettings] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
    fetchPayloadTestimonials(),
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
      testimonials,
      siteSettings,
      homeContent,
      archiveSettings,
    },
  }
}

export default IndexPage
