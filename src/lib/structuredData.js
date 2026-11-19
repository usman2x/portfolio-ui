import { siteMetadata } from "./site"
import { resolveSiteAssetUrl, resolveSitePageUrl } from "../utils/url"

// schema.org JSON-LD for the home and About pages, built from Site Settings so search engines and
// AI crawlers can identify the person behind the site and the consulting service on offer. Nodes
// share stable @ids, so pages can reference the Person instead of repeating it.

const siteUrl = () => siteMetadata.siteUrl
const homeUrl = () => resolveSitePageUrl(siteUrl(), "/")
const personId = () => `${homeUrl()}#person`
const serviceId = () => `${homeUrl()}#service`
const websiteId = () => `${homeUrl()}#website`

const compact = value =>
  Object.fromEntries(
    Object.entries(value).filter(
      ([, item]) => item !== undefined && item !== null && item !== "" && !(Array.isArray(item) && !item.length)
    )
  )

const sameAs = siteSettings =>
  (siteSettings.socialLinks || []).map(link => link?.url).filter(Boolean)

const portrait = siteSettings =>
  siteSettings.portraitUrl ? resolveSiteAssetUrl(siteUrl(), siteSettings.portraitUrl) : undefined

export const personSchema = siteSettings =>
  compact({
    "@type": "Person",
    "@id": personId(),
    name: siteSettings.name,
    url: homeUrl(),
    image: portrait(siteSettings),
    jobTitle: siteSettings.professionalTitle,
    description: siteSettings.defaultSeoDescription,
    email: siteSettings.email ? `mailto:${siteSettings.email}` : undefined,
    sameAs: sameAs(siteSettings),
  })

export const professionalServiceSchema = (siteSettings, services = []) =>
  compact({
    "@type": "ProfessionalService",
    "@id": serviceId(),
    name: siteSettings.professionalTitle
      ? `${siteSettings.name}, ${siteSettings.professionalTitle}`
      : siteSettings.name,
    url: homeUrl(),
    image: portrait(siteSettings),
    description: siteSettings.footerDescription || siteSettings.defaultSeoDescription,
    email: siteSettings.email,
    areaServed: "Worldwide",
    founder: { "@id": personId() },
    sameAs: sameAs(siteSettings),
    hasOfferCatalog: services.length
      ? {
          "@type": "OfferCatalog",
          name: "Ways to work together",
          itemListElement: services.map(service => ({
            "@type": "Offer",
            itemOffered: compact({
              "@type": "Service",
              name: service.title,
              description: service.summary,
              provider: { "@id": personId() },
            }),
          })),
        }
      : undefined,
  })

export const websiteSchema = siteSettings =>
  compact({
    "@type": "WebSite",
    "@id": websiteId(),
    name: siteSettings.defaultSeoTitle || siteSettings.name,
    url: homeUrl(),
    description: siteSettings.defaultSeoDescription,
    inLanguage: "en",
    publisher: { "@id": personId() },
  })

export const profilePageSchema = (siteSettings, pathname) =>
  compact({
    "@type": "ProfilePage",
    "@id": resolveSitePageUrl(siteUrl(), pathname),
    url: resolveSitePageUrl(siteUrl(), pathname),
    isPartOf: { "@id": websiteId() },
    mainEntity: { "@id": personId() },
  })

export const personReference = siteSettings =>
  compact({ "@type": "Person", "@id": personId(), name: siteSettings.name, url: homeUrl() })

export const graph = nodes => ({
  "@context": "https://schema.org",
  "@graph": nodes.filter(Boolean),
})
