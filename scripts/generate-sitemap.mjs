import { readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import nextEnv from "@next/env"

// postbuild runs outside Next.js, so load the same .env files `next build` used.
nextEnv.loadEnvConfig(process.cwd(), false)

const outputDir = path.resolve("out")
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  ""
).replace(/\/+$/, "")

if (!siteUrl) {
  console.error("NEXT_PUBLIC_SITE_URL is required to generate sitemap.xml")
  process.exit(1)
}

const walk = async directory => {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map(async entry => {
        const target = path.join(directory, entry.name)
        return entry.isDirectory() ? walk(target) : [target]
      })
    )
  ).flat()
}

const decodeEntities = value =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")

const metaContent = (html, attribute, name) => {
  const tag = html.match(new RegExp(`<meta[^>]*${attribute}="${name}"[^>]*>`, "i"))?.[0]
  const content = tag?.match(/content="([^"]*)"/i)?.[1]
  return content ? decodeEntities(content) : ""
}

const readPage = async file => {
  const html = await readFile(file, "utf8")
  let route = path
    .relative(outputDir, file)
    .replaceAll(path.sep, "/")
    .replace(/\.html$/, "")
  route = route.replace(/(^|\/)index$/, "$1")
  const jsonLd = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(match => {
      try {
        const data = JSON.parse(match[1])
        return data["@graph"] || [data]
      } catch {
        return []
      }
    })
  return {
    route: route ? `/${route}` : "/",
    url: route ? `${siteUrl}/${route}` : `${siteUrl}/`,
    // og:title is the page title without the " | <site name>" suffix.
    title: metaContent(html, "property", "og:title") || decodeEntities(html.match(/<title>([^<]*)<\/title>/i)?.[1] || ""),
    description: metaContent(html, "name", "description"),
    noindex: /noindex/i.test(metaContent(html, "name", "robots")),
    jsonLd,
  }
}

const pages = (
  await Promise.all(
    (await walk(outputDir))
      .filter(file => file.endsWith(".html") && !file.endsWith("404.html"))
      .map(readPage)
  )
)
  .filter(page => !page.noindex)
  .filter(page => !page.url.endsWith("/404/"))
  .filter(page => !page.url.endsWith("/quote/"))
  .filter(page => !page.url.endsWith("/thank-you/"))
  .sort((a, b) => a.url.localeCompare(b.url))

const urls = pages.map(page => page.url)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(url => `  <url><loc>${url.replaceAll("&", "&amp;")}</loc></url>`)
  .join("\n")}
</urlset>
`

await writeFile(path.join(outputDir, "sitemap.xml"), xml)
await writeFile(
  path.join(outputDir, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
)

// llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI assistants, built from
// the same exported pages as the sitemap, with the person and service from the home page JSON-LD.
const home = pages.find(page => page.route === "/")
const person = home?.jsonLd.find(node => node["@type"] === "Person") || {}
const service = home?.jsonLd.find(node => node["@type"] === "ProfessionalService") || {}
const link = page =>
  `- [${page.route === "/" ? "Home" : page.title}](${page.url})${page.description ? `: ${page.description}` : ""}`
const section = (title, items) => (items.length ? `## ${title}\n\n${items.join("\n")}\n` : "")
const isDetail = (page, prefix) => page.route.startsWith(prefix) && page.route !== prefix

const offers = (service.hasOfferCatalog?.itemListElement || [])
  .map(offer => offer.itemOffered)
  .filter(item => item?.name)
  .map(item => `- ${item.name}${item.description ? `: ${item.description}` : ""}`)

const contact = [
  ...pages.filter(page => page.route === "/contact/").map(link),
  person.email ? `- Email: ${person.email.replace(/^mailto:/, "")}` : "",
  ...(person.sameAs || []).map(url => `- [${url.replace(/^https?:\/\/(www\.)?/, "")}](${url})`),
].filter(Boolean)

const llms = [
  `# ${person.name || home?.title || siteUrl}\n`,
  `> ${[person.jobTitle, person.description || home?.description].filter(Boolean).join(". ")}\n`,
  section(
    "Pages",
    pages
      .filter(page => !isDetail(page, "/projects/") && !isDetail(page, "/blog/"))
      .map(link)
  ),
  section("Services", offers),
  section("Case studies", pages.filter(page => isDetail(page, "/projects/")).map(link)),
  section("Articles", pages.filter(page => isDetail(page, "/blog/")).map(link)),
  section("Contact", contact),
]
  .filter(part => part !== "")
  .join("\n")
  .replace(/\n{3,}/g, "\n\n")

await writeFile(path.join(outputDir, "llms.txt"), llms)
