import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"
import { withBasePath } from "./site"

const blogDirectory = path.join(process.cwd(), "src/content/blog")

const stripHtml = value =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const estimateReadingTimeMinutes = value => {
  const wordCount = stripHtml(value).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / 200))
}

const normalizeDate = value => {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString()
}

const excerptFromHtml = html => {
  const plainText = stripHtml(html)
  return plainText.length > 170
    ? `${plainText.slice(0, 167).trim()}...`
    : plainText
}

const resolveCoverImageUrl = cover => {
  if (!cover || typeof cover !== "string") {
    return null
  }

  const normalizedCover = cover.replace(/^\.\//, "")
  return withBasePath(`/images/blog/${normalizedCover.replace(/^images\//, "")}`)
}

const wrapInlineImagesWithLinks = (html = "") =>
  html.replace(
    /<img([^>]*?)src=("[^"]+"|'[^']+')([^>]*)>/gi,
    (_match, before, src, after) =>
      `<a href=${src} target="_blank" rel="noopener noreferrer" class="article-inline-image-link"><img${before}src=${src}${after}></a>`
  )

const readMarkdownFile = async filename => {
  const filePath = path.join(blogDirectory, filename)
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content)
  const contentHtml = wrapInlineImagesWithLinks(processedContent.toString())
  const slug = data.slug || filename.replace(/\.mdx?$/, "")
  const coverImageUrl = resolveCoverImageUrl(data.cover)

  return {
    id: `markdown-${slug}`,
    source: "markdown",
    slug,
    title: data.title || "Untitled",
    date: normalizeDate(data.date),
    description: data.description || excerptFromHtml(contentHtml),
    excerpt: excerptFromHtml(contentHtml),
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingTimeMinutes: estimateReadingTimeMinutes(contentHtml),
    contentHtml,
    seoTitle: data.title || "Untitled",
    seoDescription: data.description || excerptFromHtml(contentHtml),
    canonicalUrl: null,
    noindex: false,
    coverImageUrl,
    coverImageAlt: data.title || "",
    ogImageUrl: coverImageUrl,
  }
}

export const getMarkdownPosts = async () => {
  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  const filenames = fs
    .readdirSync(blogDirectory)
    .filter(filename => /\.mdx?$/.test(filename))

  return Promise.all(filenames.map(readMarkdownFile))
}
