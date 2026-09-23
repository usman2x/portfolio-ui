import React from "react"
import Link from "next/link"
import { format } from "date-fns"
import WritingLink from "./WritingLink"
import {
  getWritingCtaLabel,
  getWritingSourceLabel,
  isExternalWriting,
} from "../lib/writings"

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
            <p className="preview-meta">
              {getWritingSourceLabel(post) ? (
                <>
                  <span>{getWritingSourceLabel(post)}</span>
                  <span aria-hidden="true"> · </span>
                </>
              ) : null}
              <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
            </p>
            <h3 className="preview-card-title">
              <WritingLink post={post} className="post-link link-underline">
                {post.title}
              </WritingLink>
            </h3>
            <p className="preview-card-summary">
              {post.description || post.excerpt}
            </p>
            <div className="preview-tag-list">
              {(post.tags || []).map(tag => (
                <Link
                  key={tag}
                  href={`/blog/?page=1&tag=${encodeURIComponent(
                    tag.toLowerCase()
                  )}`}
                  className="tag-chip"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <WritingLink post={post} className="text-link-cta link-underline">
              {getWritingCtaLabel(post, readArticleLabel)}
              {isExternalWriting(post) ? (
                <span aria-hidden="true"> ↗</span>
              ) : null}
            </WritingLink>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LatestWritings
