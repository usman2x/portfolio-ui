import React from "react"
import Link from "next/link"
import { format } from "date-fns"
import WritingLink from "./WritingLink"
import { getWritingSourceLabel, isExternalWriting } from "../lib/writings"

const formatPostDate = date => {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : format(parsedDate, "MMM d, yyyy")
}

// Homepage articles: one row link per post (meta, title + summary, arrow). The archive keeps
// the full ArticleCard with tags and images.
const LatestWritings = ({ posts, homeContent }) => {
  if (!posts.length) return null

  return (
    <section
      id="articles"
      className="container landing-section home-articles"
      aria-labelledby="home-articles-title"
    >
      <div className="landing-section-header home-articles-header">
        <div className="home-articles-heading">
          <h2 id="home-articles-title" className="landing-section-title">
            {homeContent.writingsTitle}
          </h2>
          {homeContent.writingsDescription ? (
            <p className="landing-section-description">
              {homeContent.writingsDescription}
            </p>
          ) : null}
        </div>
        <Link href="/blog/" className="text-link-cta link-underline">
          {homeContent.writingsArchiveLabel}
        </Link>
      </div>
      <ul className="home-articles-list">
        {posts.map(post => {
          const external = isExternalWriting(post)
          const meta = [
            getWritingSourceLabel(post),
            formatPostDate(post.date),
            !external && post.readingTimeMinutes
              ? `${post.readingTimeMinutes} min`
              : null,
          ].filter(Boolean)
          return (
            <li key={post.id}>
              <WritingLink post={post} className="home-article-row">
                <span className="home-article-meta">{meta.join(" · ")}</span>
                <div className="home-article-body">
                  <h3 className="home-article-title">{post.title}</h3>
                  <p className="home-article-summary">
                    {post.description || post.excerpt}
                  </p>
                </div>
                <span className="home-article-arrow" aria-hidden="true">
                  {external ? "↗" : "→"}
                </span>
              </WritingLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default LatestWritings
