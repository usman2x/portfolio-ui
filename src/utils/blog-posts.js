const parseDateValue = (value) => {
  const timestamp = new Date(value || "").getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const sortPostsByDateDesc = (posts) =>
  [...posts].sort((left, right) => parseDateValue(right.date) - parseDateValue(left.date));

const normalizeCmsPost = (post) => ({
  id: `cms-${post.payloadId || post.id}`,
  source: "cms",
  slug: post.slug,
  title: post.title,
  date: post.date,
  description: post.description || post.excerpt || "",
  excerpt: post.excerpt || "",
  tags: Array.isArray(post.tags) ? post.tags : [],
  readingTimeMinutes: post.readingTimeMinutes || 1,
  contentHtml: post.contentHtml || "",
  seoTitle: post.seoTitle || post.title,
  seoDescription: post.seoDescription || post.description || post.excerpt || "",
  canonicalUrl: post.canonicalUrl || null,
  noindex: Boolean(post.noindex),
  coverImageUrl: post.coverImageUrl || null,
  coverImageAlt: post.coverImageAlt || post.title || "",
  ogImageUrl: post.ogImageUrl || null,
});

const normalizeMarkdownPost = (post) => ({
  id: post.id,
  source: "markdown",
  slug: post.frontmatter?.slug,
  title: post.frontmatter?.title,
  date: post.frontmatter?.date,
  description: post.frontmatter?.description || post.excerpt || "",
  excerpt: post.excerpt || "",
  tags: Array.isArray(post.frontmatter?.tags) ? post.frontmatter.tags : [],
  readingTimeMinutes: post.timeToRead || 1,
  contentHtml: post.html || "",
  seoTitle: post.frontmatter?.title,
  seoDescription: post.frontmatter?.description || post.excerpt || "",
  canonicalUrl: null,
  noindex: false,
  coverImageSharp: post.frontmatter?.cover || null,
  coverImageUrl: null,
  coverImageAlt: post.frontmatter?.title || "",
  ogImageUrl: null,
});

export const mergeBlogPosts = ({ cmsPosts = [], markdownPosts = [] }) => {
  const merged = new Map();

  markdownPosts
    .map(normalizeMarkdownPost)
    .filter((post) => post.slug)
    .forEach((post) => {
      merged.set(post.slug, post);
    });

  cmsPosts
    .map(normalizeCmsPost)
    .filter((post) => post.slug)
    .forEach((post) => {
      merged.set(post.slug, post);
    });

  return sortPostsByDateDesc(Array.from(merged.values()));
};

export const findPostBySlug = (posts, slug) =>
  posts.find((post) => post.slug === slug) || null;
