import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outputDir = path.resolve('out')
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.musman.online').replace(/\/$/, '')

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  }))).flat()
}

const urls = (await walk(outputDir))
  .filter((file) => file.endsWith('.html') && !file.endsWith('404.html'))
  .map((file) => {
    let route = path.relative(outputDir, file).replaceAll(path.sep, '/').replace(/\.html$/, '')
    route = route.replace(/(^|\/)index$/, '$1')
    return route ? `${siteUrl}/${route}` : `${siteUrl}/`
  })
  .filter((url) => !url.endsWith('/404/'))
  .sort()

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n')}
</urlset>
`

await writeFile(path.join(outputDir, 'sitemap.xml'), xml)
await writeFile(path.join(outputDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
