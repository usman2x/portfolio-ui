require("dotenv").config();

const normalizePathPrefix = (value) => {
  if (!value || value === "/") {
    return "/";
  }

  const normalizedValue = value.trim().replace(/\/+$/, "");
  return normalizedValue.startsWith("/") ? normalizedValue : `/${normalizedValue}`;
};

const siteUrl = (
  process.env.GATSBY_SITE_URL ||
  process.env.SITE_URL ||
  "http://localhost:8000"
).replace(/\/+$/, "");
const pathPrefix = normalizePathPrefix(
  process.env.GATSBY_PATH_PREFIX || process.env.PATH_PREFIX || "/"
);

module.exports = {
  pathPrefix,
  siteMetadata: {
    title: "Muhammad Usman | Engineering Journal and Selected Work",
    description: "Software engineering notes, selected delivery work, and practical ways to start a project conversation.",
    author: "Muhammad Usman",
    siteUrl,
  },
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/sitemap.xml",
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GA_TRACKING_ID || "default-tracking-id", // Use environment variable
        head: true,
        anonymize: true,
        respectDNT: true,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content/blog/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content/experience/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content/misc/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Muhammad Usman`,
        short_name: `musman`,
        start_url: pathPrefix === "/" ? "/" : `${pathPrefix}/`,
        background_color: `#f7f3ee`,
        display: `minimal-ui`,
        icon: `static/images/portfolio.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
