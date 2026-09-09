import React from "react"
import Head from "next/head"
import { siteMetadata } from "../lib/site"
import { resolveSiteAssetUrl } from "../utils/url"

const SEO = ({
  title,
  description = "",
  meta = [],
  lang = "en",
  pathname = "/",
  image = "",
  type = "website",
  canonicalUrl = "",
  noindex = false,
  siteSettings,
}) => {
  const metaDescription = description || siteSettings.defaultSeoDescription
  const defaultTitle = siteSettings.defaultSeoTitle
  const baseSiteUrl = siteMetadata.siteUrl || ""
  const resolvedCanonicalUrl =
    canonicalUrl || (baseSiteUrl ? `${baseSiteUrl}${pathname}` : pathname)

  const resolvedImage = image ? resolveSiteAssetUrl(baseSiteUrl, image) : ""
  const pageTitle = defaultTitle ? `${title} | ${defaultTitle}` : title

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {resolvedImage ? <meta property="og:image" content={resolvedImage} /> : null}
      {resolvedImage ? <meta name="twitter:image" content={resolvedImage} /> : null}
      <meta
        name="twitter:card"
        content={resolvedImage ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:creator" content={siteSettings.name || ""} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {resolvedCanonicalUrl ? (
        <link rel="canonical" href={resolvedCanonicalUrl} />
      ) : null}
      {meta.map((item, index) => {
        const key = item.name || item.property || index
        return <meta key={key} {...item} />
      })}
    </Head>
  )
}

export default SEO
