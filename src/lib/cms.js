const DEFAULT_CMS_POSTS_ENDPOINT = "/api/posts"

const getPayloadApiUrl = () =>
  process.env.PAYLOAD_API_URL || process.env.BLOG_CMS_API_URL || ""

const getPayloadPostsEndpoint = () =>
  process.env.PAYLOAD_POSTS_ENDPOINT ||
  process.env.BLOG_CMS_POSTS_ENDPOINT ||
  DEFAULT_CMS_POSTS_ENDPOINT

const shouldAllowPayloadFallback = () => {
  const fallbackValue =
    process.env.PAYLOAD_ALLOW_FALLBACK ||
    process.env.BLOG_CMS_ALLOW_FALLBACK ||
    ""

  return /^(1|true|yes)$/i.test(fallbackValue.trim())
}

const resolvePostsEndpointUrl = (baseUrl, endpoint) => {
  try {
    return new URL(endpoint).toString()
  } catch (_error) {
    return new URL(endpoint, baseUrl).toString()
  }
}

const toAbsoluteUrl = (baseUrl, assetPath) => {
  if (!assetPath || typeof assetPath !== "string") {
    return null
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath
  }

  return `${baseUrl.replace(/\/$/, "")}/${assetPath.replace(/^\//, "")}`
}

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")

const renderRichTextNode = (node, baseUrl) => {
  if (!node || typeof node !== "object") {
    return ""
  }

  if (node.type === "text") {
    return escapeHtml(node.text || "")
  }

  const childrenHtml = Array.isArray(node.children)
    ? node.children.map(child => renderRichTextNode(child, baseUrl)).join("")
    : ""

  if (node.type === "paragraph") {
    return `<p>${childrenHtml}</p>`
  }

  if (node.type === "linebreak") {
    return "<br />"
  }

  if (node.type === "quote") {
    return `<blockquote>${childrenHtml}</blockquote>`
  }

  if (node.type === "heading") {
    const tag = ["h2", "h3", "h4"].includes(node.tag) ? node.tag : "h2"
    return `<${tag}>${childrenHtml}</${tag}>`
  }

  if (node.type === "list") {
    const listTag = node.listType === "number" ? "ol" : "ul"
    return `<${listTag}>${childrenHtml}</${listTag}>`
  }

  if (node.type === "listitem") {
    return `<li>${childrenHtml}</li>`
  }

  if (node.type === "upload") {
    const uploadValue =
      node.value && typeof node.value === "object" ? node.value : null
    const imageUrl = toAbsoluteUrl(baseUrl, uploadValue?.url)

    if (!imageUrl) {
      return ""
    }

    const alt = escapeHtml(uploadValue?.alt || "")
    const caption = uploadValue?.caption
      ? `<figcaption>${escapeHtml(uploadValue.caption)}</figcaption>`
      : ""

    return `<figure><a href="${escapeHtml(
      imageUrl
    )}" target="_blank" rel="noopener noreferrer" class="article-inline-image-link"><img src="${escapeHtml(
      imageUrl
    )}" alt="${alt}" loading="lazy" /></a>${caption}</figure>`
  }

  return childrenHtml
}

const buildContentHtml = (richText, baseUrl) => {
  const nodes = Array.isArray(richText?.root?.children)
    ? richText.root.children
    : []

  return nodes.map(node => renderRichTextNode(node, baseUrl)).join("")
}

const buildPlainTextFromRichText = richText => {
  const output = []
  const walk = node => {
    if (!node || typeof node !== "object") {
      return
    }

    if (node.type === "text" && node.text) {
      output.push(node.text)
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(walk)
      if (["paragraph", "heading", "quote", "listitem"].includes(node.type)) {
        output.push(" ")
      }
    }
  }

  walk(richText?.root)
  return output.join(" ").replace(/\s+/g, " ").trim()
}

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const buildExcerpt = (post, contentHtml) => {
  const explicitExcerpt = (post?.excerpt || "").trim()
  if (explicitExcerpt) {
    return explicitExcerpt
  }

  const plainText =
    buildPlainTextFromRichText(post?.content) || stripHtml(contentHtml)
  if (!plainText) {
    return ""
  }

  return plainText.length > 170
    ? `${plainText.slice(0, 167).trim()}...`
    : plainText
}

const estimateReadingTimeMinutes = (post, contentHtml) => {
  if (
    Number.isFinite(post?.readingTimeMinutes) &&
    Number(post.readingTimeMinutes) > 0
  ) {
    return Number(post.readingTimeMinutes)
  }

  const wordCount = stripHtml(contentHtml).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / 200))
}

const getTagCandidates = tag => {
  if (typeof tag === "string") {
    return [tag]
  }

  if (!tag || typeof tag !== "object") {
    return []
  }

  return [tag.slug, tag.value, tag.name, tag.label, tag.title].filter(
    candidate => typeof candidate === "string" && candidate.trim()
  )
}

const canonicalizeTag = value =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")

const hasTag = (tags, tagName) => {
  const normalizedTagName = canonicalizeTag(tagName)

  return Array.isArray(tags)
    ? tags.some(tag =>
        getTagCandidates(tag).some(
          candidate => canonicalizeTag(candidate) === normalizedTagName
        )
      )
    : false
}

const normalizeTags = tags =>
  Array.isArray(tags)
    ? tags
        .map(tag => {
          const [preferredTag = ""] = getTagCandidates(tag)
          return preferredTag.trim()
        })
        .filter(Boolean)
    : []

const pickMediaUrl = (media, baseUrl, sizeKey) => {
  if (!media || typeof media !== "object") {
    return null
  }

  const sizedPath = media?.sizes?.[sizeKey]?.url
  const directPath = media?.url

  return toAbsoluteUrl(baseUrl, sizedPath || directPath)
}

export const fetchPayloadPosts = async () => {
  const payloadApiUrl = getPayloadApiUrl()
  if (!payloadApiUrl) {
    return []
  }

  const endpointUrl = resolvePostsEndpointUrl(
    payloadApiUrl,
    getPayloadPostsEndpoint()
  )
  const posts = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const endpoint = new URL(endpointUrl)
    endpoint.searchParams.set("depth", "2")
    endpoint.searchParams.set("limit", "200")
    endpoint.searchParams.set("page", String(page))
    endpoint.searchParams.set("sort", "-publishedAt")
    endpoint.searchParams.set("where[_status][equals]", "published")

    const response = await fetch(endpoint.toString())

    if (!response.ok) {
      throw new Error(
        `CMS fetch failed with ${response.status} ${response.statusText}`
      )
    }

    const payload = await response.json()
    if (Array.isArray(payload?.docs)) {
      posts.push(...payload.docs)
    }

    hasNextPage = Boolean(
      payload?.hasNextPage ||
        (Number.isFinite(payload?.totalPages) &&
          Number.isFinite(payload?.page) &&
          payload.page < payload.totalPages)
    )
    page += 1
  }

  return posts
}

export const getCmsContent = async () => {
  const payloadApiUrl = getPayloadApiUrl()
  if (!payloadApiUrl) {
    return { blogPosts: [], projects: [] }
  }

  let posts = []
  try {
    posts = await fetchPayloadPosts()
  } catch (error) {
    if (shouldAllowPayloadFallback()) {
      console.warn(
        `[blog-cms] Failed to fetch CMS posts. Continuing with local content because fallback is enabled. ${error.message}`
      )
      return { blogPosts: [], projects: [] }
    }

    throw error
  }

  const normalized = posts
    .map(post => {
      const slug = typeof post?.slug === "string" ? post.slug.trim() : ""
      if (!slug) {
        return null
      }

      const contentHtml = buildContentHtml(post?.content, payloadApiUrl)
      const excerpt = buildExcerpt(post, contentHtml)
      const publishedDate = post?.publishedAt || post?.createdAt || null
      const tags = normalizeTags(post?.tags)
      const coverImageUrl = pickMediaUrl(post?.coverImage, payloadApiUrl, "card")
      const ogImageUrl =
        pickMediaUrl(post?.ogImage, payloadApiUrl, "og") ||
        pickMediaUrl(post?.coverImage, payloadApiUrl, "og") ||
        coverImageUrl

      return {
        id: `cms-${post.id}`,
        payloadId: post.id,
        title: post.title || "Untitled",
        slug,
        excerpt,
        description: post.seoDescription || excerpt,
        contentHtml,
        date: publishedDate,
        tags,
        readingTimeMinutes: estimateReadingTimeMinutes(post, contentHtml),
        seoTitle: post.seoTitle || post.title || "Untitled",
        seoDescription: post.seoDescription || excerpt,
        canonicalUrl: post.canonicalUrl || null,
        noindex: Boolean(post.noindex),
        coverImageUrl,
        coverImageAlt: post?.coverImage?.alt || post.title || "",
        ogImageUrl,
        isCaseStudy: hasTag(post?.tags, "case-study"),
      }
    })
    .filter(Boolean)

  return {
    blogPosts: normalized.filter(post => !post.isCaseStudy),
    projects: normalized.filter(post => post.isCaseStudy),
  }
}
