const normalizePathPrefix = value => {
  if (!value || value === "/") {
    return ""
  }

  const normalizedValue = value.trim().replace(/\/+$/, "")
  return normalizedValue.startsWith("/") ? normalizedValue : `/${normalizedValue}`
}

export const pathPrefix = normalizePathPrefix(
  process.env.NEXT_PUBLIC_PATH_PREFIX || process.env.PATH_PREFIX || ""
)

export const withBasePath = value => {
  if (!value || /^https?:\/\//i.test(value) || !pathPrefix) {
    return value
  }

  if (!value.startsWith("/")) {
    return `${pathPrefix}/${value}`
  }

  return value.startsWith(`${pathPrefix}/`) ? value : `${pathPrefix}${value}`
}

export const siteMetadata = {
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, ""),
}

export const getPublicEnv = (key, fallback = "") =>
  process.env[`NEXT_PUBLIC_${key}`] || process.env[key] || fallback
