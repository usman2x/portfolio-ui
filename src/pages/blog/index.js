import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import SEO from "../../components/seo"
import ArticleRow from "../../components/ArticleRow"
import { getAllBlogPosts } from "../../lib/content"
import { fetchArchiveSettings, fetchSiteSettings } from "../../lib/cms"

const buildArchivePath = tag =>
  tag ? `/blog/?tag=${encodeURIComponent(tag)}` : "/blog/"

const BlogPage = ({ posts, archiveSettings, siteSettings }) => {
  const router = useRouter()
  const postsPerPage = archiveSettings.postsPerPage || 6
  const selectedTag =
    typeof router.query.tag === "string" ? router.query.tag.toLowerCase() : ""
  const [visibleCount, setVisibleCount] = useState(postsPerPage)
  const listRef = useRef(null)
  const focusIndexRef = useRef(null)

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
  const filteredPosts = selectedTag
    ? posts.filter(post =>
        (post.tags || []).some(tag => tag.toLowerCase() === selectedTag)
      )
    : posts
  const selectedTagLabel = selectedTag
    ? allTags.find(tag => tag.value === selectedTag)?.label || selectedTag
    : ""
  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = filteredPosts.length > visibleCount
  const pageTitle = selectedTag
    ? `Articles tagged ${selectedTagLabel}`
    : archiveSettings.writingsTitle

  // Start from the first batch again whenever the topic changes.
  useEffect(() => {
    setVisibleCount(postsPerPage)
  }, [selectedTag, postsPerPage])

  // Move keyboard focus to the first newly revealed article.
  useEffect(() => {
    if (focusIndexRef.current === null || !listRef.current) return
    const link = listRef.current
      .querySelectorAll(".home-article-row")
      .item(focusIndexRef.current)
    focusIndexRef.current = null
    link?.focus()
  }, [visibleCount])

  const loadMore = () => {
    focusIndexRef.current = visibleCount
    setVisibleCount(count => count + postsPerPage)
  }

  return (
    <Layout siteSettings={siteSettings}>
      <SEO
        title={pageTitle}
        description={archiveSettings.writingsSeoDescription}
        pathname="/blog/"
        siteSettings={siteSettings}
      />
      <main className="writings-page">
        <section className="container page-intro writings-page-header">
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-description">
            {archiveSettings.writingsDescription}
          </p>
        </section>
        <section className="container">
          <div className="writings-layout">
            <aside
              className="writings-filter-panel"
              aria-label={archiveSettings.filterTitle}
            >
              <div className="writings-filter-copy">
                <p className="writings-filter-title">
                  {archiveSettings.filterTitle}
                </p>
                <p className="writings-filter-description">
                  {archiveSettings.filterDescription}
                </p>
              </div>
              <div className="writings-tag-list">
                <Link
                  href={buildArchivePath("")}
                  className={`blog-tag-pill ${selectedTag ? "" : "active"}`}
                  aria-current={selectedTag ? undefined : "page"}
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
                    aria-current={
                      selectedTag === tag.value ? "page" : undefined
                    }
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </aside>
            <div className="writings-main">
              {visiblePosts.length ? (
                <ul ref={listRef} className="home-articles-list writings-list">
                  {visiblePosts.map(post => (
                    <ArticleRow key={post.id} post={post} headingLevel="h2" />
                  ))}
                </ul>
              ) : (
                <p className="page-description">No articles found.</p>
              )}
              {hasMore ? (
                <button
                  type="button"
                  className="theme-btn-outline writings-load-more"
                  onClick={loadMore}
                >
                  Load more articles
                </button>
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
    getAllBlogPosts(),
    fetchArchiveSettings(),
    fetchSiteSettings(),
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
