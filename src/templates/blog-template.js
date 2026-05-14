import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import { format } from "date-fns"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import SEO from "../components/seo"
import ShareActions from "../components/ShareActions"
import { resolveSiteAssetUrl } from "../utils/url"

const wrapInlineImagesWithLinks = (html = "") => {
  if (!html) {
    return ""
  }

  return html.replace(
    /<img([^>]*?)src=("[^"]+"|'[^']+')([^>]*)>/gi,
    (_match, before, src, after) =>
      `<a href=${src} target="_blank" rel="noopener noreferrer" class="article-inline-image-link"><img${before}src=${src}${after}></a>`
  )
}

const BlogTemplate = ({ data, pageContext }) => {
  const { site, markdownRemark, portfolioBlogPost } = data
  const baseSiteUrl = site.siteMetadata.siteUrl || ""

  const sourceType = pageContext?.sourceType || (portfolioBlogPost ? "cms" : "markdown")
  const isMarkdownPost = sourceType === "markdown" || !portfolioBlogPost

  const markdownFrontmatter = markdownRemark?.frontmatter
  const markdownOgImage =
    markdownFrontmatter?.cover?.childImageSharp?.gatsbyImageData?.images?.fallback
      ?.src
      ? resolveSiteAssetUrl(
          baseSiteUrl,
          markdownFrontmatter.cover.childImageSharp.gatsbyImageData.images.fallback
            .src
        )
      : null

  const currentPost = isMarkdownPost
    ? {
        title: markdownFrontmatter?.title || "Untitled",
        slug: markdownFrontmatter?.slug || pageContext.slug,
        date: markdownFrontmatter?.date,
        description: markdownFrontmatter?.description || "",
        tags: markdownFrontmatter?.tags || [],
        seoTitle: markdownFrontmatter?.title || "Untitled",
        seoDescription: markdownFrontmatter?.description || "",
        canonicalUrl: null,
        noindex: false,
        ogImageUrl: markdownOgImage,
        coverImageUrl: null,
        coverImageAlt: markdownFrontmatter?.title || "",
      }
    : {
        title: portfolioBlogPost.title,
        slug: portfolioBlogPost.slug,
        date: portfolioBlogPost.date,
        description: portfolioBlogPost.description || portfolioBlogPost.excerpt || "",
        tags: portfolioBlogPost.tags || [],
        seoTitle: portfolioBlogPost.seoTitle || portfolioBlogPost.title,
        seoDescription:
          portfolioBlogPost.seoDescription ||
          portfolioBlogPost.description ||
          portfolioBlogPost.excerpt ||
          "",
        canonicalUrl: portfolioBlogPost.canonicalUrl || null,
        noindex: Boolean(portfolioBlogPost.noindex),
        ogImageUrl: portfolioBlogPost.ogImageUrl || portfolioBlogPost.coverImageUrl || null,
        coverImageUrl: portfolioBlogPost.coverImageUrl || null,
        coverImageAlt: portfolioBlogPost.coverImageAlt || portfolioBlogPost.title,
      }

  const coverImage = isMarkdownPost ? getImage(markdownFrontmatter?.cover) : null
  const title = currentPost.title
  const slug = currentPost.slug
  const date = currentPost.date
  const description = currentPost.description
  const tags = currentPost.tags
  const postUrl = baseSiteUrl ? `${baseSiteUrl}/blog/${slug}` : `/blog/${slug}`
  const canonicalUrl = currentPost.canonicalUrl || postUrl
  const postContentHtml = isMarkdownPost
    ? wrapInlineImagesWithLinks(markdownRemark?.html || "")
    : portfolioBlogPost?.contentHtml || ""
  const readingTimeMinutes = isMarkdownPost
    ? markdownRemark?.timeToRead || 1
    : portfolioBlogPost?.readingTimeMinutes || 1

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || `A detailed article on ${title}`,
    datePublished: date ? new Date(date).toISOString() : undefined,
    author: {
      "@type": "Person",
      name: site.siteMetadata.author,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    image: currentPost.ogImageUrl ? [currentPost.ogImageUrl] : undefined,
  }

  return (
    <Layout>
      <SEO
        title={currentPost.seoTitle || title}
        description={currentPost.seoDescription || description || `A detailed article on ${title}`}
        pathname={`/blog/${slug}`}
        image={currentPost.ogImageUrl || ""}
        type="article"
        canonicalUrl={currentPost.canonicalUrl || null}
        noindex={currentPost.noindex}
      />
      <section className="container blog-post-shell">
        <Link to="/blog/" className="blog-post-back">
          ← Back to writings
        </Link>
        <article className="blog-article">
          {isMarkdownPost && coverImage ? (
            <GatsbyImage
              image={coverImage}
              alt={title}
              className="blog-cover-image"
            />
          ) : null}
          {!isMarkdownPost && currentPost.coverImageUrl ? (
            <img
              src={currentPost.coverImageUrl}
              alt={currentPost.coverImageAlt || title}
              className="blog-cover-image"
              loading="lazy"
            />
          ) : null}
          <header className="blog-post-header">
            <h1 className="blog-post-title">{title}</h1>
            {description ? (
              <p className="blog-post-description">{description}</p>
            ) : null}
            <p className="blog-post-meta">
              <span>{format(new Date(date), "MMMM d, yyyy")}</span>
              <span>•</span>
              <span>{readingTimeMinutes} min read</span>
            </p>
          </header>
          <div className="blog-article-layout">
            <div
              className="blog-post-content article-prose"
              dangerouslySetInnerHTML={{ __html: postContentHtml }}
            />
            <aside className="blog-share-rail">
              <p className="blog-detail-label">Share this article</p>
              <ShareActions title={title} pathname={`/blog/${slug}`} />
            </aside>
          </div>
          {tags.length ? (
            <div className="blog-post-tags">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  className="tag-chip"
                  to={`/blog/?tag=${encodeURIComponent(tag.toLowerCase())}`}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
        </article>
      </section>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Layout>
  )
}

export const query = graphql`
  query ($slug: String!) {
    portfolioBlogPost(slug: { eq: $slug }) {
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
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      timeToRead
      frontmatter {
        title
        date
        description
        tags
        slug
        cover {
          childImageSharp {
            gatsbyImageData(
              width: 1200
              quality: 80
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
        author
      }
    }
  }
`

export default BlogTemplate
