import Link from "next/link"
import { isExternalWriting } from "../lib/writings"

const WritingLink = ({ post, href, children, ...props }) => {
  if (isExternalWriting(post)) {
    return (
      <a
        href={href || post.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href || `/blog/${post.slug}/`} {...props}>
      {children}
    </Link>
  )
}

export default WritingLink
