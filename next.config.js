const normalizePathPrefix = value => {
  if (!value || value === "/") {
    return ""
  }

  const normalizedValue = value.trim().replace(/\/+$/, "")
  return normalizedValue.startsWith("/") ? normalizedValue : `/${normalizedValue}`
}

const pathPrefix = normalizePathPrefix(
  process.env.NEXT_PUBLIC_PATH_PREFIX || process.env.PATH_PREFIX || ""
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: pathPrefix || undefined,
  assetPrefix: pathPrefix || undefined,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
