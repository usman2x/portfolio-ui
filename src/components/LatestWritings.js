import React from "react"
import Link from "next/link"
import { format } from "date-fns"

const LatestWritings = ({ posts, homeContent, readArticleLabel }) => {
  return (
    <section
      id="writings"
      className="container landing-section landing-section-surface landing-section-surface-brand"
    >
      <div className="landing-section-header">
        <h2 className="landing-section-title">{homeContent.writingsTitle}</h2>
        <Link href="/blog/" className="text-link-cta link-underline">
          {homeContent.writingsArchiveLabel}
        </Link>
      </div>
      <div className="latest-writings-list">
        {posts.map(post => (
          <article key={post.id} className="writing-preview-item">
            <p className="preview-meta">{format(new Date(post.date), "MMMM d, yyyy")}</p>
            <h3 className="preview-card-title">
              <Link href={`/blog/${post.slug}`} className="post-link link-underline">
                {post.title}
              </Link>
            </h3>
            <p className="preview-card-summary">{post.description || post.excerpt}</p>
            <div className="preview-tag-list">
              {(post.tags || []).map(tag => (
                <Link
                  key={tag}
                  href={`/blog/?page=1&tag=${encodeURIComponent(tag.toLowerCase())}`}
                  className="tag-chip"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <Link href={`/blog/${post.slug}`} className="text-link-cta link-underline">
              {readArticleLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LatestWritings
