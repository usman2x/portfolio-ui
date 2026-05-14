const path = require("path")
const projects = require("./src/content/misc/projects.json")

const DEFAULT_CMS_POSTS_ENDPOINT = "/api/posts"
const BLOG_NODE_TYPE = "PortfolioBlogPost"
const PROJECT_NODE_TYPE = "PortfolioProject"

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

const canonicalizeTag = value =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")

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

const normalizeTags = tags =>
  Array.isArray(tags)
    ? tags
        .map(tag => {
          const [preferredTag = ""] = getTagCandidates(tag)
          return preferredTag.trim()
        })
        .filter(Boolean)
    : []

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

const pickMediaUrl = (media, baseUrl, sizeKey) => {
  if (!media || typeof media !== "object") {
    return null
  }

  const sizedPath = media?.sizes?.[sizeKey]?.url
  const directPath = media?.url

  return toAbsoluteUrl(baseUrl, sizedPath || directPath)
}

const fetchPayloadPosts = async () => {
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

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type PortfolioBlogPost implements Node {
      payloadId: String!
      title: String!
      slug: String!
      excerpt: String!
      description: String!
      contentHtml: String!
      date: String
      tags: [String!]!
      readingTimeMinutes: Int!
      seoTitle: String!
      seoDescription: String!
      canonicalUrl: String
      noindex: Boolean!
      coverImageUrl: String
      coverImageAlt: String!
      ogImageUrl: String
    }
    type PortfolioProject implements Node {
      payloadId: String!
      title: String!
      slug: String!
      excerpt: String!
      description: String!
      contentHtml: String!
      date: String
      tags: [String!]!
      readingTimeMinutes: Int!
      seoTitle: String!
      seoDescription: String!
      canonicalUrl: String
      noindex: Boolean!
      coverImageUrl: String
      coverImageAlt: String!
      ogImageUrl: String
    }
  `)
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const { createNode } = actions
  const payloadApiUrl = getPayloadApiUrl()
  if (!payloadApiUrl) {
    reporter.info(
      "[blog-cms] No PAYLOAD_API_URL or BLOG_CMS_API_URL provided. Using local Markdown posts only."
    )
    return
  }

  const payloadPostsEndpoint = resolvePostsEndpointUrl(
    payloadApiUrl,
    getPayloadPostsEndpoint()
  )
  const allowFallback = shouldAllowPayloadFallback()

  let posts = []
  try {
    posts = await fetchPayloadPosts()
  } catch (error) {
    const errorMessage = `[blog-cms] Failed to fetch CMS posts from ${payloadPostsEndpoint}. ${error.message}`

    if (allowFallback) {
      reporter.warn(
        `${errorMessage} Continuing with local Markdown because PAYLOAD_ALLOW_FALLBACK or BLOG_CMS_ALLOW_FALLBACK is enabled.`
      )
      return
    }

    reporter.panicOnBuild(
      `${errorMessage} Set PAYLOAD_ALLOW_FALLBACK=true to continue with local Markdown posts intentionally.`
    )
    return
  }

  let blogPostCount = 0
  let projectCount = 0

  posts.forEach(post => {
    const slug = typeof post?.slug === "string" ? post.slug.trim() : ""
    if (!slug) {
      return
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

    const isCaseStudy = hasTag(post?.tags, "case-study")
    const nodeType = isCaseStudy ? PROJECT_NODE_TYPE : BLOG_NODE_TYPE

    const nodeData = {
      id: createNodeId(`${nodeType}-${post.id}`),
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
      internal: {
        type: nodeType,
        contentDigest: createContentDigest(post),
      },
    }

    createNode(nodeData)

    if (isCaseStudy) {
      projectCount += 1
      return
    }

    blogPostCount += 1
  })

  if (posts.length > 0) {
    reporter.info(
      `[blog-cms] Sourced ${blogPostCount} blog post(s) and ${projectCount} case study project(s) from CMS.`
    )
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allPortfolioBlogPost {
        nodes {
          slug
        }
      }
      allPortfolioProject(sort: { date: DESC }) {
        nodes {
          slug
          title
        }
      }
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/blog/" } }) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  const cmsSlugs = new Set(
    (result.data.allPortfolioBlogPost?.nodes || [])
      .map(node => node.slug)
      .filter(Boolean)
  )
  const markdownSlugs = new Set(
    (result.data.allMarkdownRemark?.nodes || [])
      .map(node => node.frontmatter?.slug)
      .filter(Boolean)
  )
  const slugs = new Set([...markdownSlugs, ...cmsSlugs])

  slugs.forEach(slug => {
    const sourceType = cmsSlugs.has(slug) ? "cms" : "markdown"

    createPage({
      path: `/blog/${slug}`,
      component: path.resolve(`./src/templates/blog-template.js`),
      context: {
        slug,
        sourceType,
      },
    })
  })

  const cmsProjects = (result.data.allPortfolioProject?.nodes || []).map(
    project => ({
      slug: project.slug,
      title: project.title,
      sourceType: "cms",
    })
  )
  const cmsProjectSlugs = new Set(cmsProjects.map(project => project.slug))
  const mergedProjects = [
    ...cmsProjects,
    ...projects
      .filter(project => !cmsProjectSlugs.has(project.slug))
      .map(project => ({
        slug: project.slug,
        title: project.title,
        sourceType: "local",
        project,
      })),
  ]

  mergedProjects.forEach((project, index) => {
    const previousProject =
      index > 0
        ? {
            slug: mergedProjects[index - 1].slug,
            title: mergedProjects[index - 1].title,
          }
        : null
    const nextProject =
      index < mergedProjects.length - 1
        ? {
            slug: mergedProjects[index + 1].slug,
            title: mergedProjects[index + 1].title,
          }
        : null

    createPage({
      path: `/projects/${project.slug}/`,
      component: path.resolve(`./src/templates/project-template.js`),
      context: {
        slug: project.slug,
        sourceType: project.sourceType,
        project: project.project || null,
        previousProject,
        nextProject,
      },
    })
  })
}
