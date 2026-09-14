export const isExternalWriting = post =>
  post?.publicationType === "external" && Boolean(post?.externalUrl)

export const getWritingHref = post =>
  isExternalWriting(post) ? post.externalUrl : `/blog/${post.slug}/`

export const getWritingCtaLabel = (post, nativeLabel = "Read article") => {
  if (!isExternalWriting(post)) return nativeLabel
  if (post.externalCtaLabel) return post.externalCtaLabel
  if (post.externalPlatform === "medium") return "Read on Medium"
  if (post.externalPlatform === "linkedin") return "Read on LinkedIn"
  return "Read original article"
}

export const getWritingSourceLabel = post => {
  if (!isExternalWriting(post)) return "Original"
  if (post.externalPlatform === "medium") return "Medium"
  if (post.externalPlatform === "linkedin") return "LinkedIn"
  return "External"
}
