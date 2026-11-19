import React from "react"
import WritingLink from "./WritingLink"
import { getWritingSourceLabel, isExternalWriting } from "../lib/writings"
import { formatDate } from "../utils/date"

// The one article list pattern (homepage and archive): meta, title + summary, arrow; the whole
// row is the link. Render inside a `.home-articles-list` <ul>.
const ArticleRow = ({ post, headingLevel = "h3" }) => {
  const external = isExternalWriting(post)
  const Heading = headingLevel
  const meta = [
    getWritingSourceLabel(post),
    formatDate(post.date),
    !external && post.readingTimeMinutes ? `${post.readingTimeMinutes} min` : null,
  ].filter(Boolean)

  return (
    <li>
      <WritingLink post={post} className="home-article-row">
        <span className="home-article-meta">{meta.join(" · ")}</span>
        <div className="home-article-body">
          <Heading className="home-article-title">{post.title}</Heading>
          <p className="home-article-summary">{post.description || post.excerpt}</p>
        </div>
        <span className="home-article-arrow" aria-hidden="true">
          {external ? "↗" : "→"}
        </span>
      </WritingLink>
    </li>
  )
}

export default ArticleRow
