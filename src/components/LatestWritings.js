import React from "react"
import Link from "next/link"
import ArticleRow from "./ArticleRow"

// Homepage articles: one row link per post, the same rows as the archive.
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
        {posts.map(post => (
          <ArticleRow key={post.id} post={post} />
        ))}
      </ul>
    </section>
  )
}

export default LatestWritings
