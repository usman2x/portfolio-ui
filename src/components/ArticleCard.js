import Link from "next/link"
import { format } from "date-fns"
import WritingLink from "./WritingLink"
import {
  getWritingCtaLabel,
  getWritingSourceLabel,
  isExternalWriting,
} from "../lib/writings"

const formatPostDate = date => {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : format(parsedDate, "MMMM d, yyyy")
}

export const tagArchiveHref = tag =>
  `/blog/?tag=${encodeURIComponent(tag.toLowerCase())}`

const ArticleCard = ({ post, readArticleLabel, headingLevel = "h2" }) => {
  const {
    title,
    date,
    description,
    excerpt,
    tags,
    coverImageUrl,
    coverThumbnailUrl,
    coverImageAlt,
    readingTimeMinutes,
  } = post
  const Heading = headingLevel
  const sourceLabel = getWritingSourceLabel(post)
  const isExternal = isExternalWriting(post)

  return (
    <article
      className={`writing-list-item ${
        coverImageUrl ? "writing-list-item-with-media" : ""
      }`}
    >
      <div className="writing-list-body">
        <p className="writing-list-meta">
          {sourceLabel ? (
            <>
              <span>{sourceLabel}</span>
              <span aria-hidden="true">•</span>
            </>
          ) : null}
          <span>{formatPostDate(date)}</span>
          {!isExternal ? <span aria-hidden="true">•</span> : null}
          {!isExternal ? <span>{readingTimeMinutes} min read</span> : null}
        </p>
        <Heading className="writing-list-title">
          <WritingLink
            post={post}
            className="writing-list-title-link link-underline"
          >
            {title}
          </WritingLink>
        </Heading>
        <p className="writing-list-description">{description || excerpt}</p>
        {tags?.length ? (
          <div className="writing-list-tags">
            {tags.map(tag => (
              <Link key={tag} className="tag-chip" href={tagArchiveHref(tag)}>
                {tag}
              </Link>
            ))}
          </div>
        ) : null}
        <WritingLink
          post={post}
          className="text-link-cta link-underline writing-read-link"
        >
          {getWritingCtaLabel(post, readArticleLabel)}
          {isExternal ? <span aria-hidden="true"> ↗</span> : null}
        </WritingLink>
      </div>
      {coverImageUrl ? (
        <WritingLink post={post} className="writing-list-media">
          <img
            src={coverThumbnailUrl || coverImageUrl}
            alt={coverImageAlt || title}
            className="writing-list-image"
            loading="lazy"
            decoding="async"
          />
        </WritingLink>
      ) : null}
    </article>
  )
}

export default ArticleCard
