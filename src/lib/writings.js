export const isExternalWriting = post =>
  post?.publicationType === "external" && Boolean(post?.externalUrl)

export const getWritingHref = post =>
  isExternalWriting(post) ? post.externalUrl : `/blog/${post.slug}/`

export const tagArchiveHref = tag =>
  `/blog/?tag=${encodeURIComponent(tag.toLowerCase())}`

export const getWritingSourceLabel = post => {
  if (!isExternalWriting(post)) return null
  if (post.externalPlatform === "medium") return "Medium"
  if (post.externalPlatform === "linkedin") return "LinkedIn"
  return "External"
}
