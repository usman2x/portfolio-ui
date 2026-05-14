const isAbsoluteUrl = (value = "") => /^https?:\/\//i.test(value)

export const resolveSiteAssetUrl = (siteUrl = "", assetPath = "") => {
  if (!assetPath) {
    return ""
  }

  if (isAbsoluteUrl(assetPath)) {
    return assetPath
  }

  if (!siteUrl) {
    return assetPath
  }

  try {
    const parsedSiteUrl = new URL(siteUrl)
    const origin = parsedSiteUrl.origin
    const basePath =
      parsedSiteUrl.pathname && parsedSiteUrl.pathname !== "/"
        ? parsedSiteUrl.pathname.replace(/\/+$/, "")
        : ""

    if (assetPath.startsWith("/")) {
      if (basePath && assetPath.startsWith(`${basePath}/`)) {
        return `${origin}${assetPath}`
      }

      return `${origin}${basePath}${assetPath}`
    }

    return `${siteUrl.replace(/\/+$/, "")}/${assetPath.replace(/^\/+/, "")}`
  } catch (_error) {
    return assetPath
  }
}

export const resolveSitePageUrl = (siteUrl = "", pagePath = "") =>
  resolveSiteAssetUrl(siteUrl, pagePath)
