const parseDateValue = value => {
  const timestamp = new Date(value || "").getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

const sortProjects = projects =>
  [...projects].sort((left, right) => {
    const dateDifference =
      parseDateValue(right.date) - parseDateValue(left.date)

    if (dateDifference !== 0) {
      return dateDifference
    }

    return left.sortIndex - right.sortIndex
  })

const normalizeCmsProject = (project, sortIndex) => ({
  id: `cms-${project.payloadId || project.id}`,
  source: "cms",
  sortIndex,
  slug: project.slug,
  title: project.title,
  summary: project.excerpt || project.description || "",
  description: project.description || project.excerpt || "",
  role: "",
  image: project.coverImageUrl || null,
  imageAlt: project.coverImageAlt || project.title || "",
  tags: Array.isArray(project.tags) ? project.tags : [],
  link: null,
  linkLabel: null,
  sections: [],
  contentHtml: project.contentHtml || "",
  seoTitle: project.seoTitle || project.title,
  seoDescription:
    project.seoDescription || project.description || project.excerpt || "",
  canonicalUrl: project.canonicalUrl || null,
  noindex: Boolean(project.noindex),
  ogImageUrl: project.ogImageUrl || project.coverImageUrl || null,
  date: project.date || null,
})

const normalizeLocalProject = (project, sortIndex) => ({
  id: `local-${project.slug}`,
  source: "local",
  sortIndex,
  slug: project.slug,
  title: project.title,
  summary: project.summary || project.description || "",
  description: project.description || project.summary || "",
  role: project.role || "",
  image: project.image || null,
  imageAlt: `${project.title} project preview`,
  tags: Array.isArray(project.tags) ? project.tags : [],
  link: project.link || null,
  linkLabel: project.linkLabel || null,
  sections: Array.isArray(project.sections) ? project.sections : [],
  contentHtml: "",
  seoTitle: project.title,
  seoDescription: project.description || project.summary || "",
  canonicalUrl: null,
  noindex: false,
  ogImageUrl: null,
  date: null,
})

export const mergeProjects = ({ cmsProjects = [], localProjects = [] }) => {
  const merged = new Map()
  const localIndexOffset = cmsProjects.length

  localProjects
    .map((project, index) =>
      normalizeLocalProject(project, localIndexOffset + index)
    )
    .filter(project => project.slug)
    .forEach(project => {
      merged.set(project.slug, project)
    })

  cmsProjects
    .map((project, index) => normalizeCmsProject(project, index))
    .filter(project => project.slug)
    .forEach(project => {
      merged.set(project.slug, project)
    })

  return sortProjects(Array.from(merged.values()))
}

export const findProjectBySlug = (projects, slug) =>
  projects.find(project => project.slug === slug) || null
