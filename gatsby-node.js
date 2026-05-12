const path = require("path");
const projects = require("./src/content/misc/projects.json");

const DEFAULT_CMS_API_URL = "https://portfolio-cms-production-8546.up.railway.app";
const DEFAULT_CMS_POSTS_ENDPOINT = "/api/posts";
const BLOG_NODE_TYPE = "PortfolioBlogPost";

const getPayloadApiUrl = () =>
  process.env.PAYLOAD_API_URL ||
  process.env.BLOG_CMS_API_URL ||
  DEFAULT_CMS_API_URL;

const getPayloadPostsEndpoint = () =>
  process.env.PAYLOAD_POSTS_ENDPOINT ||
  process.env.BLOG_CMS_POSTS_ENDPOINT ||
  DEFAULT_CMS_POSTS_ENDPOINT;

const resolvePostsEndpointUrl = (baseUrl, endpoint) => {
  try {
    return new URL(endpoint).toString();
  } catch (_error) {
    return new URL(endpoint, baseUrl).toString();
  }
};

const toAbsoluteUrl = (baseUrl, assetPath) => {
  if (!assetPath || typeof assetPath !== "string") {
    return null;
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${baseUrl.replace(/\/$/, "")}/${assetPath.replace(/^\//, "")}`;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderRichTextNode = (node, baseUrl) => {
  if (!node || typeof node !== "object") {
    return "";
  }

  if (node.type === "text") {
    return escapeHtml(node.text || "");
  }

  const childrenHtml = Array.isArray(node.children)
    ? node.children.map((child) => renderRichTextNode(child, baseUrl)).join("")
    : "";

  if (node.type === "paragraph") {
    return `<p>${childrenHtml}</p>`;
  }

  if (node.type === "linebreak") {
    return "<br />";
  }

  if (node.type === "quote") {
    return `<blockquote>${childrenHtml}</blockquote>`;
  }

  if (node.type === "heading") {
    const tag = ["h2", "h3", "h4"].includes(node.tag) ? node.tag : "h2";
    return `<${tag}>${childrenHtml}</${tag}>`;
  }

  if (node.type === "list") {
    const listTag = node.listType === "number" ? "ol" : "ul";
    return `<${listTag}>${childrenHtml}</${listTag}>`;
  }

  if (node.type === "listitem") {
    return `<li>${childrenHtml}</li>`;
  }

  if (node.type === "upload") {
    const uploadValue =
      node.value && typeof node.value === "object" ? node.value : null;
    const imageUrl = toAbsoluteUrl(baseUrl, uploadValue?.url);

    if (!imageUrl) {
      return "";
    }

    const alt = escapeHtml(uploadValue?.alt || "");
    const caption = uploadValue?.caption
      ? `<figcaption>${escapeHtml(uploadValue.caption)}</figcaption>`
      : "";

    return `<figure><a href="${escapeHtml(
      imageUrl
    )}" target="_blank" rel="noopener noreferrer" class="article-inline-image-link"><img src="${escapeHtml(
      imageUrl
    )}" alt="${alt}" loading="lazy" /></a>${caption}</figure>`;
  }

  return childrenHtml;
};

const buildContentHtml = (richText, baseUrl) => {
  const nodes = Array.isArray(richText?.root?.children)
    ? richText.root.children
    : [];

  return nodes.map((node) => renderRichTextNode(node, baseUrl)).join("");
};

const buildPlainTextFromRichText = (richText) => {
  const output = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") {
      return;
    }

    if (node.type === "text" && node.text) {
      output.push(node.text);
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(walk);
      if (["paragraph", "heading", "quote", "listitem"].includes(node.type)) {
        output.push(" ");
      }
    }
  };

  walk(richText?.root);
  return output.join(" ").replace(/\s+/g, " ").trim();
};

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const buildExcerpt = (post, contentHtml) => {
  const explicitExcerpt = (post?.excerpt || "").trim();
  if (explicitExcerpt) {
    return explicitExcerpt;
  }

  const plainText = buildPlainTextFromRichText(post?.content) || stripHtml(contentHtml);
  if (!plainText) {
    return "";
  }

  return plainText.length > 170 ? `${plainText.slice(0, 167).trim()}...` : plainText;
};

const estimateReadingTimeMinutes = (post, contentHtml) => {
  if (
    Number.isFinite(post?.readingTimeMinutes) &&
    Number(post.readingTimeMinutes) > 0
  ) {
    return Number(post.readingTimeMinutes);
  }

  const wordCount = stripHtml(contentHtml).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
};

const normalizeTags = (tags) =>
  Array.isArray(tags)
    ? tags
        .map((tag) => {
          if (typeof tag === "string") {
            return tag.trim();
          }

          if (tag && typeof tag === "object" && typeof tag.name === "string") {
            return tag.name.trim();
          }

          return "";
        })
        .filter(Boolean)
    : [];

const pickMediaUrl = (media, baseUrl, sizeKey) => {
  if (!media || typeof media !== "object") {
    return null;
  }

  const sizedPath = media?.sizes?.[sizeKey]?.url;
  const directPath = media?.url;

  return toAbsoluteUrl(baseUrl, sizedPath || directPath);
};

const fetchPayloadPosts = async () => {
  const payloadApiUrl = getPayloadApiUrl();
  const endpoint = new URL(
    resolvePostsEndpointUrl(payloadApiUrl, getPayloadPostsEndpoint())
  );

  endpoint.searchParams.set("depth", "2");
  endpoint.searchParams.set("limit", "200");
  endpoint.searchParams.set("sort", "-publishedAt");
  endpoint.searchParams.set("where[_status][equals]", "published");

  const response = await fetch(endpoint.toString());

  if (!response.ok) {
    throw new Error(
      `CMS fetch failed with ${response.status} ${response.statusText}`
    );
  }

  const payload = await response.json();
  return Array.isArray(payload?.docs) ? payload.docs : [];
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
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
  `);
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const { createNode } = actions;
  const payloadApiUrl = getPayloadApiUrl();
  const payloadPostsEndpoint = resolvePostsEndpointUrl(
    payloadApiUrl,
    getPayloadPostsEndpoint()
  );

  let posts = [];
  try {
    posts = await fetchPayloadPosts();
  } catch (error) {
    reporter.warn(
      `[blog-cms] Failed to fetch CMS posts from ${payloadPostsEndpoint}. Falling back to local Markdown. ${error.message}`
    );
    return;
  }

  posts.forEach((post) => {
    const slug = typeof post?.slug === "string" ? post.slug.trim() : "";
    if (!slug) {
      return;
    }

    const contentHtml = buildContentHtml(post?.content, payloadApiUrl);
    const excerpt = buildExcerpt(post, contentHtml);
    const publishedDate = post?.publishedAt || post?.createdAt || null;
    const tags = normalizeTags(post?.tags);
    const coverImageUrl = pickMediaUrl(post?.coverImage, payloadApiUrl, "card");
    const ogImageUrl =
      pickMediaUrl(post?.ogImage, payloadApiUrl, "og") ||
      pickMediaUrl(post?.coverImage, payloadApiUrl, "og") ||
      coverImageUrl;

    const nodeData = {
      id: createNodeId(`${BLOG_NODE_TYPE}-${post.id}`),
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
        type: BLOG_NODE_TYPE,
        contentDigest: createContentDigest(post),
      },
    };

    createNode(nodeData);
  });

  if (posts.length > 0) {
    reporter.info(`[blog-cms] Sourced ${posts.length} published post(s) from CMS.`);
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allPortfolioBlogPost {
        nodes {
          slug
        }
      }
      allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/blog/"}}) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `);

  const cmsSlugs = new Set(
    (result.data.allPortfolioBlogPost?.nodes || [])
      .map((node) => node.slug)
      .filter(Boolean)
  );
  const markdownSlugs = new Set(
    (result.data.allMarkdownRemark?.nodes || [])
      .map((node) => node.frontmatter?.slug)
      .filter(Boolean)
  );
  const slugs = new Set([...markdownSlugs, ...cmsSlugs]);

  slugs.forEach((slug) => {
    const sourceType = cmsSlugs.has(slug) ? "cms" : "markdown";

    createPage({
      path: `/blog/${slug}`,
      component: path.resolve(`./src/templates/blog-template.js`),
      context: {
        slug,
        sourceType,
      },
    });
  });

  projects.forEach((project, index) => {
    const previousProject = index > 0 ? projects[index - 1] : null;
    const nextProject = index < projects.length - 1 ? projects[index + 1] : null;

    createPage({
      path: `/projects/${project.slug}/`,
      component: path.resolve(`./src/templates/project-template.js`),
      context: {
        project,
        previousProject,
        nextProject,
      },
    });
  });
};
