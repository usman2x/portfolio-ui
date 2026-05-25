import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import HomeIdentity from "../components/HomeIdentity"
import SelectedProjects from "../components/SelectedProjects"
import LatestWritings from "../components/LatestWritings"
import homeContent from "../content/pages/home.json"
import { getAllBlogPosts, getAllProjects } from "../lib/content"

const IndexPage = ({ posts, featuredProjects }) => {
  return (
    <Layout>
      <SEO
        title={homeContent.seo.title}
        description={homeContent.seo.description}
        pathname="/"
      />
      <div className="home-page landing-home">
        <HomeIdentity />
        <section className="container landing-post-hero-note">
          <p>{homeContent.identity.postHeroLine}</p>
        </section>
        <LatestWritings posts={posts} />
        <SelectedProjects projects={featuredProjects} />
      </div>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [allPosts, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
  ])
  const posts = allPosts.slice(0, homeContent.writings.limit || 3)
  const featuredProjects = homeContent.projects.featuredSlugs
    .map(slug => projects.find(project => project.slug === slug))
    .filter(Boolean)

  return {
    props: {
      posts,
      featuredProjects,
    },
  }
}

export default IndexPage
