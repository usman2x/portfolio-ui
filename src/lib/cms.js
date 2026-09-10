const DEFAULT_CMS_POSTS_ENDPOINT = "/api/posts"

const getPayloadApiUrl = () => (process.env.PAYLOAD_API_URL || "").trim()

const getPublicCmsUrl = () =>
  (process.env.NEXT_PUBLIC_CMS_URL || getPayloadApiUrl()).trim()

const getPayloadPostsEndpoint = () =>
  process.env.PAYLOAD_POSTS_ENDPOINT || DEFAULT_CMS_POSTS_ENDPOINT

const fetchCms = async (url, attempts = 3) => {
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (response.ok || response.status < 500 || attempt === attempts) return response
      lastError = new Error(`CMS responded with ${response.status}`)
    } catch (error) {
      lastError = error
      if (attempt === attempts) throw error
    }

    await new Promise(resolve => setTimeout(resolve, attempt * 250))
  }

  throw lastError || new Error("CMS request failed")
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

const safeLinkUrl = value => {
  if (typeof value !== "string") return null
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(value)) return value
  return null
}

const renderFormattedText = node => {
  let output = escapeHtml(node.text || "")
  const format = Number(node.format) || 0
  if (format & 16) output = `<code>${output}</code>`
  if (format & 1) output = `<strong>${output}</strong>`
  if (format & 2) output = `<em>${output}</em>`
  if (format & 8) output = `<u>${output}</u>`
  if (format & 4) output = `<s>${output}</s>`
  if (format & 32) output = `<sub>${output}</sub>`
  if (format & 64) output = `<sup>${output}</sup>`
  if (format & 128) output = `<mark>${output}</mark>`
  return output
}

const renderRichTextNode = (node, baseUrl) => {
  if (!node || typeof node !== "object") {
    return ""
  }

  if (node.type === "text") {
    return renderFormattedText(node)
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

  if (node.type === "link" || node.type === "autolink") {
    const href = safeLinkUrl(node.fields?.url || node.url)
    if (!href) return childrenHtml
    const newWindow = node.fields?.newTab || node.fields?.newWindow
    const target = newWindow ? ' target="_blank" rel="noopener noreferrer"' : ""
    return `<a href="${escapeHtml(href)}"${target}>${childrenHtml}</a>`
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

  if (node.type === "horizontalrule") return "<hr />"
  if (node.type === "tab") return "&emsp;"
  if (node.type === "table") return `<div class="article-table-wrap"><table>${childrenHtml}</table></div>`
  if (node.type === "tablerow") return `<tr>${childrenHtml}</tr>`
  if (node.type === "tablecell") {
    const tag = node.headerState ? "th" : "td"
    return `<${tag}>${childrenHtml}</${tag}>`
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
          const preferredTag =
            typeof tag === "string"
              ? tag
              : [tag?.name, tag?.label, tag?.title, tag?.slug, tag?.value].find(
                  candidate => typeof candidate === "string" && candidate.trim()
                ) || ""
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

const normalizeGalleryMedia = (media, baseUrl) => {
  if (!media || typeof media !== "object") return null
  const fullUrl = toAbsoluteUrl(baseUrl, media.url)
  if (!fullUrl) return null
  return {
    id: media.id || fullUrl,
    fullUrl,
    thumbnailUrl:
      pickMediaUrl(media, baseUrl, "thumbnail") ||
      pickMediaUrl(media, baseUrl, "card") ||
      fullUrl,
    alt: media.alt || "",
    caption: media.caption || "",
    width: media.width || null,
    height: media.height || null,
  }
}

const textRows = rows =>
  Array.isArray(rows) ? rows.map(row => row?.text).filter(Boolean) : []

const optionRows = rows =>
  Array.isArray(rows)
    ? rows.map(row => ({ label: row?.label || row?.value, value: row?.value })).filter(row => row.value)
    : []

export const fetchPayloadGlobal = async slug => {
  const payloadApiUrl = getPayloadApiUrl()
  if (!payloadApiUrl) throw new Error("PAYLOAD_API_URL is required to load website content.")
  const endpoint = new URL(`/api/globals/${slug}`, payloadApiUrl)
  endpoint.searchParams.set("depth", "2")
  const response = await fetchCms(endpoint.toString())
  if (!response.ok) throw new Error(`CMS global ${slug} failed with ${response.status} ${response.statusText}`)
  return response.json()
}

export const fetchSiteSettings = async () => {
  const data = await fetchPayloadGlobal("site-settings")
  const publicCmsUrl = getPublicCmsUrl()
  return {
    ...data,
    portraitUrl:
      pickMediaUrl(data.portrait, publicCmsUrl, "card") || data.portraitPath || null,
  }
}

export const fetchHomePage = async () => {
  const data = await fetchPayloadGlobal("home-page")
  return {
    ...data,
    trustChips: textRows(data.trustChips),
    featuredProjectIds: (data.featuredProjects || []).map(item => typeof item === "object" ? item.id : item),
  }
}

export const fetchAboutPage = async () => {
  const data = await fetchPayloadGlobal("about-page")
  return { ...data, summary: textRows(data.summary) }
}

export const fetchTestimonialsPage = () => fetchPayloadGlobal("testimonials-page")

export const fetchQuotePage = async () => {
  const data = await fetchPayloadGlobal("quote-page")
  return {
    ...data,
    steps: [
      { id: "help_type", name: "help_type", label: data.helpTypeLabel || "", options: optionRows(data.helpTypes) },
      { id: "work_type", name: "work_type", label: data.workTypeLabel || "", options: optionRows(data.workTypes) },
      { id: "timeline", name: "timeline", label: data.timelineLabel || "", options: optionRows(data.timelines) },
      { id: "budget", name: "budget", label: data.budgetLabel || "", options: optionRows(data.budgets) },
    ],
    contactMethods: optionRows(data.contactMethods),
    contactFields: [
      { label: data.nameLabel || "", name: "name", type: "text", placeholder: data.namePlaceholder || "" },
      { label: data.emailLabel || "", name: "email", type: "email", placeholder: data.emailPlaceholder || "" },
      { label: data.companyLabel || "", name: "company", type: "text", placeholder: data.companyPlaceholder || "" },
    ],
  }
}

export const fetchArchiveSettings = () => fetchPayloadGlobal("archive-settings")
export const fetchProjectTemplate = () => fetchPayloadGlobal("project-template")
export const fetchSystemPages = () => fetchPayloadGlobal("system-pages")

export const fetchWorkExperience = async () => {
  const payloadApiUrl = getPayloadApiUrl()
  if (!payloadApiUrl) throw new Error("PAYLOAD_API_URL is required to load work experience.")
  const endpoint = new URL("/api/work-experience", payloadApiUrl)
  endpoint.searchParams.set("depth", "0")
  endpoint.searchParams.set("limit", "100")
  endpoint.searchParams.set("sort", "sortOrder")
  endpoint.searchParams.set("where[status][equals]", "published")
  const response = await fetchCms(endpoint.toString())
  if (!response.ok) throw new Error(`CMS work experience failed with ${response.status} ${response.statusText}`)
  const payload = await response.json()
  return (payload.docs || []).map(item => ({
    ...item,
    highlights: textRows(item.highlights),
  }))
}

export const fetchPayloadPosts = async () => {
  const payloadApiUrl = getPayloadApiUrl()
  if (!payloadApiUrl) {
    throw new Error(
      "PAYLOAD_API_URL is required. Start portfolio-cms and point the UI at its base URL."
    )
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

    const response = await fetchCms(endpoint.toString())

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

export const fetchPayloadTestimonials = async () => {
  const payloadApiUrl = getPayloadApiUrl()
  if (!payloadApiUrl) {
    throw new Error("PAYLOAD_API_URL is required to load testimonials.")
  }

  const endpoint = new URL("/api/testimonials", payloadApiUrl)
  endpoint.searchParams.set("depth", "0")
  endpoint.searchParams.set("limit", "100")
  endpoint.searchParams.set("sort", "sortOrder")
  endpoint.searchParams.set("where[status][equals]", "published")
  const response = await fetchCms(endpoint.toString())
  if (!response.ok) {
    throw new Error(`CMS testimonial fetch failed with ${response.status} ${response.statusText}`)
  }

  const payload = await response.json()
  return Array.isArray(payload?.docs)
    ? payload.docs.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        company: item.company || "",
        quote: item.quote,
        relationship: item.relationship,
        sourceLabel: item.sourceLabel || "Recommendation",
        sourceUrl: item.sourceUrl || "",
        featured: Boolean(item.featured),
      }))
    : []
}

export const getCmsContent = async () => {
  const payloadApiUrl = getPayloadApiUrl()
  const publicCmsUrl = getPublicCmsUrl()
  if (!payloadApiUrl) {
    throw new Error(
      "PAYLOAD_API_URL is required. Start portfolio-cms and point the UI at its base URL."
    )
  }

  const posts = await fetchPayloadPosts()

  const normalized = posts
    .map(post => {
      const slug = typeof post?.slug === "string" ? post.slug.trim() : ""
      if (!slug) {
        return null
      }

      const contentHtml = buildContentHtml(post?.content, publicCmsUrl)
      const excerpt = buildExcerpt(post, contentHtml)
      const publishedDate = post?.publishedAt || post?.createdAt || null
      const tags = normalizeTags(post?.tags)
      const coverImageUrl = pickMediaUrl(
        post?.coverImage,
        publicCmsUrl,
        "card"
      )
      const ogImageUrl =
        pickMediaUrl(post?.ogImage, publicCmsUrl, "og") ||
        pickMediaUrl(post?.coverImage, publicCmsUrl, "og") ||
        coverImageUrl
      const projectGallery = Array.isArray(post?.projectGallery)
        ? post.projectGallery.map(media => normalizeGalleryMedia(media, publicCmsUrl)).filter(Boolean)
        : []

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
        projectRole: post.projectRole || "",
        projectGallery,
        isCaseStudy: hasTag(post?.tags, "case-study"),
      }
    })
    .filter(Boolean)

  return {
    blogPosts: normalized.filter(post => !post.isCaseStudy),
    projects: normalized.filter(post => post.isCaseStudy),
  }
}
