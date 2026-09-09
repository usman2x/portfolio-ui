import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { format } from "date-fns"
import Layout from "../../components/Layout"
import SEO from "../../components/seo"
import { getAllBlogPosts } from "../../lib/content"
import { fetchArchiveSettings, fetchSiteSettings } from "../../lib/cms"

const formatPostDate = date => {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : format(parsedDate, "MMMM d, yyyy")
}

const BlogPage = ({ posts, archiveSettings, siteSettings }) => {
  const router = useRouter()
  const postsPerPage = archiveSettings.postsPerPage || 6
  const selectedTag =
    typeof router.query.tag === "string" ? router.query.tag : "all-tags"
  const requestedPage = Number.parseInt(router.query.page || "1", 10)
  const allTags = Array.from(
    posts.reduce((tagMap, post) => {
      ;(post.tags || []).forEach(tag => {
        const normalizedTag = tag.toLowerCase()
        if (!tagMap.has(normalizedTag)) {
          tagMap.set(normalizedTag, tag)
        }
      })
      return tagMap
    }, new Map())
  )
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label))
  const filteredPosts =
    selectedTag === "all-tags"
      ? posts
      : posts.filter(post =>
          (post.tags || []).some(tag => tag.toLowerCase() === selectedTag)
        )
  const selectedTagLabel =
    selectedTag === "all-tags"
      ? "All"
      : allTags.find(tag => tag.value === selectedTag)?.label || selectedTag
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage))
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )
  const buildArchivePath = (tag, page = 1) => {
    const params = new URLSearchParams()
    if (page > 1) {
      params.set("page", String(page))
    }
    if (tag !== "all-tags") {
      params.set("tag", tag)
    }
    const queryString = params.toString()

    return queryString ? `/blog/?${queryString}` : "/blog/"
  }

  return (
    <Layout siteSettings={siteSettings}>
      <SEO
        title={archiveSettings.writingsTitle}
        description={archiveSettings.writingsSeoDescription}
        pathname="/blog/"
        siteSettings={siteSettings}
      />
      <main className="writings-page">
        <section className="container writings-page-header">
          <h1 className="page-title">{archiveSettings.writingsTitle}</h1>
        </section>
        <section className="container">
          <div className="writings-layout">
            <aside className="writings-filter-panel">
              <div className="writings-filter-copy">
                <h2 className="writings-filter-title">{archiveSettings.filterTitle}</h2>
                <p className="writings-filter-description">
                  {archiveSettings.filterDescription}
                </p>
              </div>
              <div className="writings-tag-list">
                <Link
                  href={buildArchivePath("all-tags")}
                  className={`blog-tag-pill ${
                    selectedTag === "all-tags" ? "active" : ""
                  }`}
                >
                  All
                </Link>
                {allTags.map(tag => (
                  <Link
                    key={tag.value}
                    href={buildArchivePath(tag.value)}
                    className={`blog-tag-pill ${
                      selectedTag === tag.value ? "active" : ""
                    }`}
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </aside>
            <div className="writings-main">
              <div className="writings-results-bar">
                <p className="writings-results-copy">
                  Showing {visiblePosts.length} of {filteredPosts.length}{" "}
                  article
                  {filteredPosts.length === 1 ? "" : "s"}
                  {selectedTag !== "all-tags" ? ` in ${selectedTagLabel}` : ""}.
                </p>
                <Link href="/quote/" className="text-link-cta link-underline">
                  {archiveSettings.writingCtaLabel}
                </Link>
              </div>
              <div className="writings-list">
                {visiblePosts.map(post => {
                  const {
                    id,
                    title,
                    slug,
                    date,
                    description,
                    excerpt,
                    tags,
                    coverImageUrl,
                    coverImageAlt,
                    readingTimeMinutes,
                  } = post
                  const hasImage = Boolean(coverImageUrl)

                  return (
                    <article
                      key={id}
                      className={`writing-list-item ${
                        hasImage ? "writing-list-item-with-media" : ""
                      }`}
                    >
                      <div className="writing-list-body">
                        <p className="writing-list-meta">
                          <span>{formatPostDate(date)}</span>
                          <span>•</span>
                          <span>{readingTimeMinutes} min read</span>
                        </p>
                        <h2 className="writing-list-title">
                          <Link
                            href={`/blog/${slug}`}
                            className="writing-list-title-link link-underline"
                          >
                            {title}
                          </Link>
                        </h2>
                        <p className="writing-list-description">
                          {description || excerpt}
                        </p>
                        {tags?.length ? (
                          <div className="writing-list-tags">
                            {tags.map(tag => (
                              <Link
                                key={tag}
                                className="tag-chip"
                                href={buildArchivePath(tag.toLowerCase())}
                              >
                                #{tag}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                        <Link
                          href={`/blog/${slug}`}
                          className="text-link-cta link-underline writing-read-link"
                        >
                          {archiveSettings.readArticleLabel}
                        </Link>
                      </div>
                      {coverImageUrl ? (
                        <Link href={`/blog/${slug}`} className="writing-list-media">
                          <img
                            src={coverImageUrl}
                            alt={coverImageAlt || title}
                            className="writing-list-image"
                            loading="lazy"
                          />
                        </Link>
                      ) : null}
                    </article>
                  )
                })}
              </div>
              {totalPages > 1 ? (
                <nav
                  className="writings-pagination"
                  aria-label="Blog pagination"
                >
                  {currentPage > 1 ? (
                    <Link
                      href={buildArchivePath(selectedTag, currentPage - 1)}
                      className="pagination-link pagination-link-prev"
                    >
                      Previous page
                    </Link>
                  ) : (
                    <span className="pagination-link pagination-link-disabled">
                      Previous page
                    </span>
                  )}
                  <p className="pagination-status">
                    Page {currentPage} of {totalPages}
                  </p>
                  {currentPage < totalPages ? (
                    <Link
                      href={buildArchivePath(selectedTag, currentPage + 1)}
                      className="pagination-link pagination-link-next"
                    >
                      Next page
                    </Link>
                  ) : (
                    <span className="pagination-link pagination-link-disabled">
                      Next page
                    </span>
                  )}
                </nav>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [posts, archiveSettings, siteSettings] = await Promise.all([
    getAllBlogPosts(), fetchArchiveSettings(), fetchSiteSettings(),
  ])

  return {
    props: {
      posts,
      archiveSettings,
      siteSettings,
    },
  }
}

export default BlogPage
