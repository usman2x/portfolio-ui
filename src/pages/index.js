import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/seo";
import HomeIdentity from "../components/HomeIdentity";
import SelectedProjects from "../components/SelectedProjects";
import LatestWritings from "../components/LatestWritings";
import homeContent from "../content/pages/home.json";
import projects from "../content/misc/projects.json";
import { mergeBlogPosts } from "../utils/blog-posts";

const IndexPage = ({ data }) => {
  const posts = mergeBlogPosts({
    cmsPosts: data.allPortfolioBlogPost.nodes,
    markdownPosts: data.allMarkdownRemark.nodes,
  }).slice(0, 3);
  const featuredProjects = homeContent.projects.featuredSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter(Boolean);

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
  );
};

export const query = graphql`
  query HomePageWritingsQuery {
    allPortfolioBlogPost {
      nodes {
        id
        payloadId
        title
        slug
        excerpt
        description
        date
        tags
        readingTimeMinutes
        contentHtml
        seoTitle
        seoDescription
        canonicalUrl
        noindex
        coverImageUrl
        coverImageAlt
        ogImageUrl
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/blog/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        excerpt(pruneLength: 140)
        frontmatter {
          title
          date
          description
          slug
          tags
        }
      }
    }
  }
`;

export default IndexPage;
