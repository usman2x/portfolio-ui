import React from "react"
import Head from "next/head"
import Link from "next/link"
import { format } from "date-fns"
import Layout from "../../components/Layout"
import SEO from "../../components/seo"
import ShareActions from "../../components/ShareActions"
import { getAllBlogPosts } from "../../lib/content"
import { siteMetadata } from "../../lib/site"
import { resolveSiteAssetUrl } from "../../utils/url"

const formatPostDate = date => {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : format(parsedDate, "MMMM d, yyyy")
}

const BlogPostPage = ({ post }) => {
  const title = post.title
  const slug = post.slug
  const date = post.date
  const description = post.description
  const tags = post.tags || []
  const postUrl = siteMetadata.siteUrl
    ? `${siteMetadata.siteUrl}/blog/${slug}/`
    : `/blog/${slug}/`
  const canonicalUrl = post.canonicalUrl || postUrl

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || `A detailed article on ${title}`,
    datePublished: date ? new Date(date).toISOString() : undefined,
    author: {
      "@type": "Person",
      name: siteMetadata.author,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    image: post.ogImageUrl
      ? [resolveSiteAssetUrl(siteMetadata.siteUrl, post.ogImageUrl)]
      : undefined,
  }

  return (
    <Layout>
      <SEO
        title={post.seoTitle || title}
        description={
          post.seoDescription || description || `A detailed article on ${title}`
        }
        pathname={`/blog/${slug}/`}
        image={post.ogImageUrl || ""}
        type="article"
        canonicalUrl={post.canonicalUrl || null}
        noindex={post.noindex}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <section className="container blog-post-shell">
        <Link href="/blog/" className="blog-post-back">
          &larr; Back to writings
        </Link>
        <article className="blog-article">
          {post.coverImageUrl ? (
            <img
              src={post.coverImageUrl}
              alt={post.coverImageAlt || title}
              className="blog-cover-image"
              loading="eager"
            />
          ) : null}
          <header className="blog-post-header">
            <h1 className="blog-post-title">{title}</h1>
            {description ? (
              <p className="blog-post-description">{description}</p>
            ) : null}
            <p className="blog-post-meta">
              <span>{formatPostDate(date)}</span>
              <span>•</span>
              <span>{post.readingTimeMinutes} min read</span>
            </p>
          </header>
          <div className="blog-article-layout">
            <div
              className="blog-post-content article-prose"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
            <aside className="blog-share-rail">
              <p className="blog-detail-label">Share this article</p>
              <ShareActions title={title} pathname={`/blog/${slug}/`} />
            </aside>
          </div>
          {tags.length ? (
            <div className="blog-post-tags">
              {tags.map(tag => (
                <Link
                  key={tag}
                  className="tag-chip"
                  href={`/blog/?tag=${encodeURIComponent(tag.toLowerCase())}`}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
        </article>
      </section>
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const posts = await getAllBlogPosts()

  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const posts = await getAllBlogPosts()
  const post = posts.find(item => item.slug === params.slug) || null

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
  }
}

export default BlogPostPage
